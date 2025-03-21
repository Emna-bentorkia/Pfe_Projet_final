import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {
    const { name, lastname, email, password, confirmpassword, dateBirth, numeroPhone, adress } = req.body;

    // Vérification des champs obligatoires
    if (!name || !lastname || !email || !password || !confirmpassword || !dateBirth || !numeroPhone || !adress) {
        return res.status(400).json({ success: false, message: 'Missing details' });
    }

    // Vérification que les mots de passe correspondent
    if (password !== confirmpassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // Validation du mot de passe
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character (@$!%*?&).' 
        });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Validation de la date de naissance
    const today = new Date();
    const birthDate = new Date(dateBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (age < 18 || (age === 18 && (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)))) {
        return res.status(400).json({ success: false, message: 'You must be at least 18 years old to register.' });
    }

    try {
        // Vérification si l'utilisateur existe déjà
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 8);

        // Génération de l'OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        // Création de l'utilisateur
        const user = new userModel({ 
            name, 
            lastname, 
            email, 
            password: hashedPassword, 
            dateBirth, 
            numeroPhone, 
            adress, 
            verifyOtp: otp,
            verifyOtpExpireAt: Date.now() + 24 * 60 * 60 * 1000 // 24h
        });

        await user.save();

        // Envoi de l'OTP par email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification Code",
            text: `Your verification code is: ${otp}. It will expire in 24 hours.`
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Registration successful. Check your email for verification." });

    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }

        if (!user.isAccountVerified) {
            return res.status(400).json({ success: false, message: 'Account not verified. Check your email.' });
        }

        // Création du token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Envoi du token via un cookie sécurisé
        res.cookie('token', token, {
            httpOnly: true, // Empêche l'accès au cookie via JavaScript
            secure: process.env.NODE_ENV === 'production', // Utilise HTTPS en production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Sécurisation des cookies
            maxAge: 7 * 24 * 60 * 60 * 1000 // Durée de validité du cookie (7 jours)
        });

        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const logout = async (req, res) => {
    try {
        // Supprimer le cookie du token pour se déconnecter
        res.clearCookie('token', {
            httpOnly: true, // Empêche l'accès JavaScript
            secure: process.env.NODE_ENV === 'production', // Utilise HTTPS en production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Options de sécurité des cookies
        });

        // Si tu utilises un autre mécanisme de stockage côté serveur, supprime-le ici

        return res.json({ success: true, message: "Déconnexion réussie" });

    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const sendVerifyOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification Code",
            text: `Your verification code is: ${otp}. It will expire in 24 hours.`
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Verification code sent to email" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  // Validation des entrées
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email et OTP sont requis.' });
  }

  try {
    // Recherche de l'utilisateur
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    // Vérification si le compte est déjà vérifié
    if (user.isAccountVerified) {
      return res.status(400).json({ success: false, message: 'Le compte est déjà vérifié.' });
    }

    // Vérification de l'OTP
    if (!user.verifyOtp || user.verifyOtp.toString() !== otp.toString()) {
      return res.status(400).json({ success: false, message: 'Code OTP invalide.' });
    }

    // Vérification de l'expiration de l'OTP
    if (user.verifyOtpExpireAt < Date.now()) {
      user.verifyOtp = '';
      user.verifyOtpExpireAt = null;
      await user.save();
      return res.status(400).json({ success: false, message: 'Le code OTP a expiré.' });
    }

    // Marquer le compte comme vérifié
    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = null;
    await user.save();

    return res.json({ success: true, message: 'E-mail vérifié avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'e-mail :', error);
    return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la vérification.' });
  }
};

//check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // Récupère le token
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, user });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


//send password reset
export const sendResetOtp = async (req, res)=>{
    const {email} = req.body;

    if(!email){
        return res.status(404).json({ success: false, message: "Email is required" });
    }

    try {

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset Code",
            text: `Your Code for resetting your password is: ${otp}. Use this Code to proceed with resetting your password.`
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Code sent to your email" });

        
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });

    }
};

export const resetPassword = async (req,res)=>{
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.status(400).json({ success: false, message: "Email, Code , new Password are required" });
    }

    try {

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.status(400).json({ success: false, message: "Invalid Code" });

        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.status(400).json({ success: false, message: "Code Expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0 ;

        await user.save();

        return res.json({ success: true, message: "Password has been reset successfully" });

        
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });

    }
};