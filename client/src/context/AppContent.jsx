import axios from "axios";
import { createContext, useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext()

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggidin] = useState(false)
    const [userDate, setUserData] = useState(false)

    const getAuthState = async ()=>{
        try{
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth',{
                withCredentials: true
            });
            if (data.success){
                setIsLoggidin(true)
                getUserData()

            }
            
        }catch(error){
            console.error("Erreur d'authentification :", error.response?.data || error.message);
            toast.error(error.message)
        }
    }

    const getUserData = async ()=>{
        try{
            const {data} = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userDate) : toast.error(data.message)
        }catch (error){
            toast.error(error.message)

        }
    }

    useEffect(()=>{
        getAuthState();

    },[])


    const value = {

        backendUrl,
        isLoggedin, setIsLoggidin,
        userDate, setUserData,
        getUserData


    }

    return (
        <AppContent.Provider value={value}>
            {props.children}

            console.log("Backend URL:", backendUrl);

        </AppContent.Provider>
    )
}
