import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContent";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [state, setState] = useState("Login");
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

      const url = state === "Sign Up" ? "/api/auth/register" : "/api/auth/login";
      const { data } = await axios.post(backendUrl + url, formData);

      if (data.success) {
        if (state === "Sign Up") {
          toast.success("Inscription réussie ! Vérifiez votre email pour valider votre compte.");
          setIsVerificationSent(true); // Afficher l'interface de vérification
        } else {
          if (!data.isAccountVerified) {
            toast.error("Votre compte n'est pas encore vérifié. Vérifiez votre email.");
            return;
          }

          localStorage.setItem("token", data.token);
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Une erreur est survenue");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-pink-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up" ? "Create your account" : "Login to your account!"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <>
              {[...Array(8).keys()].map((index) => (
                <div key={index} className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                  <input
                    className="bg-transparent outline-none w-full text-white"
                    type={index === 5 || index === 6 ? "password" : index === 2 ? "date" : "text"}
                    name={["name", "lastname", "dateBirth", "numeroPhone", "email", "password", "confirmpassword", "adress"][index]}
                    placeholder={["Nom", "Prénom", "Date de naissance", "Numéro de téléphone", "Email", "Mot de passe", "Confirmer le mot de passe", "Adresse"][index]}
                    value={formData[["name", "lastname", "dateBirth", "numeroPhone", "email", "password", "confirmpassword", "adress"][index]]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
            </>
          )}

          {state === "Login" && (
            <>
              {[
                { name: "email", placeholder: "Email", type: "email" },
                { name: "password", placeholder: "Mot de passe", type: "password" },
              ].map((field, index) => (
                <div key={index} className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                  <input
                    className="bg-transparent outline-none w-full text-white"
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
              <p onClick={() => navigate("/reset-password")} className="mb-4 text-indigo-500 cursor-pointer">
                Mot de passe oublié ?
              </p>
            </>
          )}

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>
        </form>

        <p className="text-gray-400 text-center text-xs mt-4">
          {state === "Sign Up" ? "Vous avez déjà un compte ?" : "Vous n'avez pas de compte ?"}{" "}
          <span onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")} className="text-blue-400 cursor-pointer underline">
            {state === "Sign Up" ? "Connectez-vous ici" : "Inscrivez-vous"}
          </span>
        </p>

        {/* Affichage du message après inscription */}
        {isVerificationSent && (
          <p className="text-center text-green-500 mt-4">
            Un code a été envoyé à votre adresse email. Vérifiez votre email pour continuer.
            <button onClick={() => navigate("/email-verify")} className="text-blue-400 underline ml-2">
              Vérifiez votre email
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
