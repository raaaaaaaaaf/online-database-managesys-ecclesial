import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../../../firebase/firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import Swal from 'sweetalert2'

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire({
        icon: 'success',
        title: 'Login Successfully',
        showConfirmButton: false,
        timer: 1500
      })
      navigate('/dashboard', { replace: true });
    } catch (error) {
      let customErrorMessage = "An error occurred.";

      // Check the error code and customize the message accordingly
      if (error.code === "auth/invalid-email") {
        customErrorMessage = "Invalid email address. Please check your email.";
      } else if (error.code === "auth/user-not-found") {
        customErrorMessage = "User not found. Please sign up or try again.";
      } // Add more conditions for other Firebase error codes if needed

      Swal.fire({
        icon: "error",
        title: "Error",
        text: customErrorMessage,
      });
      console.error(error);
    }
    
  };



  return (
    <>
      <Stack spacing={3}>
        <TextField
         name="email" 
         label="Email address"
         onChange={(e) => setEmail(e.target.value)} 
         />

        <TextField
          name="password"
          label="Password"
          onChange={(e) => setPassword(e.target.value)} 
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={signIn} color="info">
        Login
      </LoadingButton>
    </>
  );
}
