import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
// @mui
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Checkbox,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import Iconify from "../../../components/iconify";
import Swal from "sweetalert2";
import { doc, setDoc } from "firebase/firestore";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [dob, setDob] = useState(null);
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(true)

  const handleCivilStatusChange = (event) => {
    setCivilStatus(event.target.value);
  };

  const handleDobChange = (date) => {
    setDob(date);

    // Calculate age based on the selected date of birth
    if (date) {
      const today = new Date();
      const birthDate = new Date(date);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();

      // Check if the birthday has occurred this year
      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
          today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }

      setAge(calculatedAge.toString());
    } else {
      setAge("");
    }
  };

  const signIn = async () => {
    try {
      if (
        !name || 
        !email || 
        !password ||
        !contact ||
        !address ||
        !civilStatus ||
        !dob
        
        ) {
        toast.error("Please fill out all fields.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
        return; // Exit the function if validation fails
      }
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(res.user)
      await updateProfile(res.user, {
        displayName: name,
      });
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: name,
        email: email,
        contact: contact,
        address: address,
        age: age,
        dob: dob.toDate(),
        civilStatus: civilStatus,
        role: "User",
      });
      setLoading(false)
      toast.success("Email verification link sent.", {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
      });

      
    } catch (err) {
      let customErrorMessage = "An error occurred.";

      // Check the error code and customize the message accordingly
      if (err.code === "auth/invalid-email") {
        customErrorMessage = "Invalid email address. Please check your email.";
      } else if (err.code === "auth/user-not-found") {
        customErrorMessage = "User not found. Please sign up or try again.";
      } // Add more conditions for other Firebase error codes if needed

      toast.error(err.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      console.error(err);
    }
    navigate('/client', { replace: true });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            name="displayName"
            label="Full Name"
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            name="email"
            label="Email address"
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            type="number"
            name="contact"
            label="Contact"
            onChange={(e) => setContact(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            name="password"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            fullWidth
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
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="civil-status-label">Civil Status</InputLabel>
            <Select
              labelId="civil-status-label"
              id="civil-status"
              value={civilStatus}
              onChange={handleCivilStatusChange}
              label="Civil Status"
            >
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
              <MenuItem value="Widowed">Widowed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            name="address"
            label="Address"
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
              value={dob}
              onChange={handleDobChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id="age"
            name="age"
            label="Age"
            value={age}
            disabled
            fullWidth
          />
        </Grid>
      </Grid>

      <LoadingButton
        style={{ marginTop: '16px' }} 
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
