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
  collection,
  getDocs,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddChapel = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
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

  const handleAdd = async () => {
    try {
      if (!formData.name || !formData.address) {
        toast.error("Please fill out all fields.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
        return; // Exit the function if validation fails
      }

      const dataRef = collection(db, "data_chapel");
      const data = {
        name: formData.name,
        address: formData.address,
        members: [],
        baptismal: Number(0),
        marriage: Number(0),
        burial: Number(0),
        timeStamp: serverTimestamp(),
      };
      await addDoc(dataRef, data);
      toast.success("Successfully added", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      navigate("/dashboard/chapel");
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
    <Dialog maxWidth={"sm"} open={open} onClose={onClose}>
      <DialogTitle>Chapel</DialogTitle>
      <DialogContent>
        <Grid container spacing={0.5}>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              required
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              label="Chapel Name"
              placeholder="Chapel Name"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
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

export default AddChapel;
