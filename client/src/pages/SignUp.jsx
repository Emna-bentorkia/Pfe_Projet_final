import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContent";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import Cookies from "js-cookie";

const SignUp = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    dateBirth: "",
    numeroPhone: "",
    email: "",
    password: "",
    confirmpassword: "",
    adress: "",
  });

  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + "/api/auth/register", formData);
      if (data.success) {
        toast.success("Inscription réussie ! Vérifiez votre email pour valider votre compte.");

        // Stocker le token dans les cookies (si renvoyé par le backend)
        if (data.token) {
          Cookies.set('token', data.token, { expires: 7, path: '/', domain: window.location.hostname });
        }

        // Enregistrer l'email dans le localStorage pour qu'il soit accessible dans EmailVerify.jsx
        localStorage.setItem("email", formData.email);

        setIsVerificationSent(true); // Afficher l'interface de vérification
        navigate("/email-verify"); // Rediriger vers la page de vérification de l'email
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error.response?.data); // Afficher l'erreur détaillée
      toast.error(error.response?.data?.message || "Une erreur est survenue");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="backdrop-blur-md bg-white/10 p-8 sm:p-10 rounded-2xl shadow-2xl w-full sm:w-[450px] text-[#45659c84] text-sm mt-28 sm:mt-26">
        <h2 className="text-3xl font-semibold text-[#45659c84] text-center mb-3">Create Account</h2>
        <p className="text-center text-sm mb-6">Create your account</p>

        <form onSubmit={onSubmitHandler}>
          {[...Array(8).keys()].map((index) => (
            <div key={index} className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full backdrop-blur bg-white/10">
              <input
                className="bg-transparent outline-none w-full text-[#16191ea5]"
                type={index === 5 || index === 6 ? "password" : index === 2 ? "date" : "text"}
                name={["name", "lastname", "dateBirth", "numeroPhone", "email", "password", "confirmpassword", "adress"][index]}
                placeholder={["Nom", "Prénom", "Date de naissance", "Numéro de téléphone", "Email", "Mot de passe", "Confirmer le mot de passe", "Adresse"][index]}
                value={formData[["name", "lastname", "dateBirth", "numeroPhone", "email", "password", "confirmpassword", "adress"][index]]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            Sign Up
          </button>
        </form>

        {isVerificationSent && (
          <p className="text-center text-green-500 mt-4">
            Un code a été envoyé à votre adresse email. Vérifiez votre email pour continuer.
            <button onClick={() => navigate("/email-verify")} className="text-blue-400 underline ml-2">
              Vérifiez votre email
            </button>
          </p>
        )}

        <p className="text-[#424c5fac] text-center text-xs mt-4">
          Vous avez déjà un compte ?{" "}
          <span onClick={() => navigate("/login")} className="text-blue-500 cursor-pointer underline">
            Connectez-vous ici
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;