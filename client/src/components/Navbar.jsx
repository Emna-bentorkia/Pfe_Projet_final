import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContent'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

    const navigate = useNavigate()
    const {userData, backendUrl, setUserData, setIsLoggedin} = useContext(AppContent)

    const sendVerificationOtp = async ()=>{
      try{
        axios.defaults.withCredentials = true;

        const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')

        if(data.success){
          navigate('/email-verify')
          toast.success(data.message)
        }else{
          toast.error(data.message)
        }

      }catch (error){
        toast.error
      }
    }

    const logout = async ()=>{
      try{

          axios.defaults.withCredentials = true;
          const { data } = await axios.post(backendUrl + '/api/auth/logout')
          data.success && setIsLoggedin(false)
          data.success && setUserData(false)
          navigate('/')
          

      }catch (error){
        toast.error(error.message)

      }
    }


  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-50'>
  <img 
    src={assets.logo}  
    className='w-28 sm:w-32 cursor-pointer' 
    onClick={() => navigate('/')} 
    alt="Logo"
  />
  
  {userData ? (
    <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group overflow-visible'>
      {userData.name[0].toUpperCase()}
      
      <div className='absolute hidden group-hover:block top-full right-0 z-50 bg-white shadow-md rounded-md pt-2 min-w-[150px]'>
        <ul className='list-none m-0 p-2'>
          {!userData.isAccountVerified && (
            <li 
              onClick={sendVerificationOtp} 
              className='py-2 px-4 hover:bg-gray-100 cursor-pointer rounded-md'
            >
              Verify email
            </li>
          )}
          <li 
            onClick={logout} 
            className='py-2 px-4 hover:bg-gray-100 cursor-pointer text-black rounded-md'
          >
            Logout
          </li>
        </ul>
      </div>
    </div>
  ) : (
    <button 
      onClick={() => navigate('/Login')}
      className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'
    >
      Login <img src={assets.arrow_icon} alt=''/>
    </button>
  )}
</div>
  )
}

export default Navbar;

