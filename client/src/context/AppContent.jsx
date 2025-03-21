import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
    // Activer les cookies dans les requêtes axios
    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4001';
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fonction pour vérifier l'état d'authentification
    const getAuthState = async () => {
        try {
            const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token'));
            console.log(`Token dans les cookies :${token}` );  // Vérifie si le token est là
    
            const response = await axios.get(`${backendUrl}/api/auth/is-auth`);
    
            if (response.data && response.data.success) {
                setIsLoggedin(true);
                setUserData(response.data.user);
            } else {
                setIsLoggedin(false);
            }
        } catch (error) {
            setIsLoggedin(false);
            // Gère l'erreur
        }
    };    
    

    // Fonction pour récupérer les données utilisateur
    const getUserData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/data`);

            if (response.data.success) {
                setUserData(response.data.userData);
            } else {
                toast.error(response.data.message || "Failed to fetch user data");
            }
        } catch (error) {
            console.error("Failed to fetch user data: " + error.message);
        }
    };

    // Vérifier l'état d'authentification au chargement du composant
    useEffect(() => {
        getAuthState();
    }, []);

    // Valeur contextuelle partagée dans toute l'application
    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
        loading,
    };

    return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};
