import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";

const EditMarriage = ({ open, onClose, id, data }) => {
  const [dobf, setDobf] = useState(null);
  const [dobm, setDobm] = useState(null);
  const [dom, setDom] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    motherName: "",
    fatherName: "",

    fullFName: "",
    motherFName: "",
    fatherFName: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        fullName: data.fullName || "",
        motherName: data.motherName || "",
        fatherName: data.fatherName || "",

        fullFName: data.fullFName || "",
        motherFName: data.motherFName || "",
        fatherFName: data.fatherFName || "",
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDobfChange = (date) => {
    setDobf(date);
  };
  const handleDobmChange = (date) => {
    setDobm(date);
  };
  const handleDomChange = (date) => {
    setDom(date);
  };

  const handleEdit = async (id) => {
    try {
      
      if(
        !formData.fullName ||
        !formData.fatherName ||
        !formData.motherName ||

        !formData.fullFName ||
        !formData.fatherFName ||
        !formData.motherFName ||
        
        !dobf ||
        !dobm ||
        !dom
      ) {
        toast.error("Please fill out all fields.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
        return; // Exit the function if validation fails
      }

      const docRef = doc(db, "data_certificates", id)
      const data = {
        fullName: formData.fullName,
        fatherName: formData.fatherName,
        motherName: formData.motherName,

        fullFName: formData.fullFName,
        fatherFName: formData.fatherFName,
        motherFName: formData.motherFName,
        
        dobf: dobf.toDate(),
        dobm: dobm.toDate(),
        dom: dom.toDate(),
        docType: "Marriage",
        isApproved: false,
        timeStamp: serverTimestamp(),
      };
      await updateDoc(docRef, data)
      toast.success("Edited Succesfully", {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
      });
      onClose()
    } catch(err) {
      console.error(err)
      toast.error(err, {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
      });
      onClose()
    }
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Marriage</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Right Column */}
          <Grid item xs={6}>
            <Typography variant="subtitle1">GROOM</Typography>
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
              id="fatherName"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleInputChange}
              label="Father Name"
              placeholder="Father Name"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              required
              id="motherName"
              name="motherName"
              value={formData.motherName}
              onChange={handleInputChange}
              label="Mother Name"
              placeholder="Mother Name"
              fullWidth
              variant="outlined"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                sx={{ mt: 1, width: "100%" }}
                value={dobm}
                onChange={handleDobmChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          {/* Left Column */}
          <Grid item xs={6}>
            <Typography variant="subtitle1">BRIDE</Typography>
            <TextField
              margin="dense"
              required
              id="fullFName"
              name="fullFName"
              value={formData.fullFName}
              onChange={handleInputChange}
              label="Full Name"
              placeholder="Full Name"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              required
              id="fatherFName"
              name="fatherFName"
              value={formData.fatherFName}
              onChange={handleInputChange}
              label="Father Name"
              placeholder="Father Name"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              required
              id="motherFName"
              name="motherFName"
              value={formData.motherFName}
              onChange={handleInputChange}
              label="Mother Name"
              placeholder="Mother Name"
              fullWidth
              variant="outlined"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                sx={{ mt: 1, width: "100%" }}
                value={dobf}
                onChange={handleDobfChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Marriage"
              sx={{ mt: 1.5, ml: 2, width: "100%" }}
              value={dom}
              onChange={handleDomChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button onClick={() => handleEdit(id)} color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMarriage;
