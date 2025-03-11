import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  // Assurer que les cookies sont inclus avec axios
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // État pour gérer le chargement

  // Fonction pour récupérer l'état d'authentification
  const getAuthState = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/is-auth`);

      // Vérification si la réponse contient 'isAuthenticated'
      if (response.data && response.data.isAuthenticated !== undefined) {
        setIsLoggedin(response.data.isAuthenticated);
        if (response.data.isAuthenticated) {
          await getUserData(); // Récupérer les données utilisateur si authentifié
        }
      } else {
        setIsLoggedin(false); // Si la propriété n'est pas définie, on considère l'utilisateur comme non authentifié
      }
    } catch (error) {
      setIsLoggedin(false);
      if (error.response && error.response.status === 401) {
        // L'utilisateur n'est pas authentifié, ce qui est normal
        console.log("Utilisateur non authentifié");
      } else {
        toast.error("Erreur d'authentification : " + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false); // Arrêter le chargement une fois la vérification terminée
    }
  };

  // Fonction pour récupérer les données utilisateur
  const getUserData = async () => {
    try {
      // Changer l'URL de '/api/data' à '/api/user/data'
      const response = await axios.get(`${backendUrl}/api/user/data`);

      if (response.data.success) {
        setUserData(response.data.userData);
      } else {
        toast.error(response.data.message || "Erreur de récupération des données utilisateur");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          toast.error("L'API '/user/data' n'a pas été trouvée. Vérifiez la route côté serveur.");
        } else {
          toast.error("Erreur de récupération des données utilisateur : " + error.response.data.message);
        }
      } else if (error.request) {
        toast.error("Aucune réponse reçue du serveur. Vérifiez votre connexion réseau.");
      } else {
        toast.error("Erreur de configuration de la requête : " + error.message);
      }
    }
  };

  // Vérification de l'authentification au chargement du composant
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

  return <AppContent.Provider value={value}>{props.children}</AppContent.Provider>;
};
