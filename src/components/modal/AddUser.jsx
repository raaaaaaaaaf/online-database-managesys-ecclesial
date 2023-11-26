import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const AddUser = ({ open, onClose }) => {
  const [dob, setDob] = useState(null);
  const [age, setAge] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [course, setCourse] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    pass: "",
    contact: "",
    address: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const handleCivilStatusChange = (event) => {
    setCivilStatus(event.target.value);
  };

  const handleCourseChange = (event) => {
    setCourse(event.target.value);
  };

  const handleAdd = async () => {
    try {
      // Create user account
      const res = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.pass
      );

      // Update user profile
      await updateProfile(res.user, {
        displayName: formData.fullName,
      });
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: formData.fullName,
        email: formData.email,
        contact: formData.contact,
        address: formData.address,
        age: age,
        dob: dob,
        civilStatus: civilStatus,
        course: course,
        role: "User",
      });
      toast.success("Information has been added.", {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
      });
    } catch (err) {
      toast.error(err.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Member Information</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              margin="dense"
              required
              id="fullName"
              name="fullName"
              label="Full Name"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              required
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              label="Email"
              placeholder="Email"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              required
              type="password"
              id="pass"
              name="pass"
              value={formData.pass}
              onChange={handleInputChange}
              label="Password"
              placeholder="Password"
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                sx={{ mt: 1, width: "100%" }}
                value={dob}
                onChange={handleDobChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <FormControl
              fullWidth
              variant="outlined"
              style={{ margin: "12px 0" }}
            >
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

            <FormControl fullWidth variant="outlined">
              <InputLabel id="course-label">Grade Level</InputLabel>
              <Select
                labelId="course-label"
                id="course-label"
                value={course}
                onChange={handleCourseChange}
                label="Grade Level"
              >
                <MenuItem value="Elementary">Elementary</MenuItem>
                <MenuItem value="High School">High School</MenuItem>
                <MenuItem value="College">College</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <TextField
              margin="dense"
              id="age"
              name="age"
              label="Age"
              fullWidth
              value={age}
              disabled
            />
            <TextField
              margin="dense"
              required
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              label="Contact No."
              placeholder="Contact No."
              fullWidth
              variant="outlined"
              type="number" // Set the type to "tel" for telephone input
            />
            <TextField
              margin="dense"
              required
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              label="Address"
              placeholder="Address"
              fullWidth
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button onClick={handleAdd} color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUser;
