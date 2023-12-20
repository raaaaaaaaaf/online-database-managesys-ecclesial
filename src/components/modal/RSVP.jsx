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
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RSVP = ({ open, onClose, id, data }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = async (id) => {
    try {
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.address
      ) {
        toast.error("Please fill out all fields.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
        return; // Exit the function if validation fails
      }
      const dataRef = doc(db, "data_events", id);
      const data = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        isApproved: false,
      };
      await updateDoc(dataRef, {
        registerData: arrayUnion(data),
      });
      toast.success(
        "After submitting your RSVP, please note that approval from the admin is required before your attendance is confirmed.",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
        }
      );
      navigate("/dashboard/event");
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>RSVP </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Right Column */}
          <Grid item xs={6}>
            <TextField
              margin="dense"
              required
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              label="Full Name"
              placeholder="Full Name"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              required
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              label="Email"
              placeholder="Email"
              fullWidth
              variant="outlined"
            />
          </Grid>
          {/* Left Column */}
          <Grid item xs={6}>
            <TextField
              margin="dense"
              required
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              label="Address "
              placeholder="Address"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              required
              id="phone"
              name="phone"
              type="number"
              value={formData.phone}
              onChange={handleInputChange}
              label="Phone No. "
              placeholder="Phone No."
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
        <Button onClick={() => handleRegister(id)} color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RSVP;
