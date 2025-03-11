import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        n
        return res.status(401).json({ success: false, message: 'Token is missing. Please log in again.' });
    }

    try {

        // Essayer de décoder le token
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = tokenDecode.id; // On ajoute l'ID de l'utilisateur à la requête
        next(); // Si le token est valide, on passe à la suite

    } catch (error) {

        if (error.name === 'TokenExpiredError') {

            return res.status(401).json({ 

                success: false, message: 'Token has expired. Please log in again.' });

        }

        if (error.name === 'JsonWebTokenError') {

            return res.status(401).json({ success: false, message: 'Invalid token. Please log in again.' });

        }

        return res.status(401).json({ success: false, message: 'Failed to authenticate token. Please try again.' });

    }
};

export default userAuth;