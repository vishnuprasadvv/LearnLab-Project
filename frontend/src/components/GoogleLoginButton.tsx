import { useAppDispatch } from '@/app/hooks';
import { authSuccess, googleLoginThunk } from '@/features/authSlice';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import toast, {Toaster} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


  const GoogleLoginButton : React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const login = useGoogleLogin({
      onSuccess: async (tokenResponse : any) => {
        try {
          // Send the Google OAuth token to your backend
          console.log(tokenResponse)

          const response = await dispatch(googleLoginThunk({token:tokenResponse.access_token})).unwrap()
          console.log(response.user)

        //    // Optionally, store the token in localStorage
        // localStorage.setItem("token", response.token);
  
          // Dispatch user data to Redux
          dispatch(authSuccess({user:{id: response.user.id, email : response.user.email, role : response.user.role, firstName : response.user.firstName , lastName: response.user.lastName, phone: response.user.phone}}));
          navigate('/home')
          

        } catch (error: any) {
          console.error('Login failed:', error);
          toast.error(error.message || 'Login failed')
        }
      },
      onError: () => {
        console.error('Login Failed');
      },
    });
  
  return (
    <button onClick={() => login()} className="google-login-button">
    <FcGoogle className='size-6'/>
  </button>
  )
};

export default GoogleLoginButton;
