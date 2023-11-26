import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// @mui
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Checkbox,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import Iconify from "../../../components/iconify";
import Swal from "sweetalert2";
import { doc, setDoc } from "firebase/firestore";
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, {
        displayName: name,
      });
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: name,
        email: email,
        password: password,
        role: "User",
      });
      Swal.fire({
        icon: "success",
        title: "Registered Successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/dashboard", { replace: true });
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
          name="displayName"
          label="Full Name"
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          name="email"
          label="Email address"
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          name="password"
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 2 }}
      >
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={signIn}
        color="info"
      >
        Sign Up
      </LoadingButton>
    </>
  );
}
