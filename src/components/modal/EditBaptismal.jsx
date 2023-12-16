import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useContext, useEffect, useState } from "react";
import Iconify from "../iconify";
import { AuthContext } from "../../context/AuthContext";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";

const EditBaptismal = ({ open, onClose, id, data }) => {
  const [dob, setDob] = useState(null);
  const [pob, setPob] = useState(null);
  const { currentUser, userData } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: "",
    motherName: "",
    fatherName: "",
    placeofbirth: "",
  });
  const [sponsors, setSponsors] = useState([
    {
      name: "",
    },
  ]);

  useEffect(() => {
    if (data) {
      setFormData({
        fullName: data.fullName || "",
        motherName: data.motherName || "",
        fatherName: data.fatherName || "",
        placeofbirth: data.placeofbirth || "",
      });
      if (Array.isArray(data.sponsors)) {
        setSponsors(data.sponsors.map((record) => ({
          name: record.name || "",
        }))
        );
      } else {
        setSponsors([])
      }
    }
  }, [data]);

  console.log(id);

  const handleAddSponsors = (event, index, fieldName) => {
    const updatedRecords = [...sponsors];
    updatedRecords[index][fieldName] = event.target.value;
    setSponsors(updatedRecords);
  };
  const handleDeleteSponsor = (index) => {
    const updatedRecords = [...sponsors];
    updatedRecords.splice(index, 1);
    setSponsors(updatedRecords);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addSponsors = () => {
    setSponsors([...sponsors, { name: "" }]);
  };
  const handleDobChange = (date) => {
    setDob(date);
  };
  const handlePobChange = (date) => {
    setPob(date);
  };

  const handleEdit = async (id) => {
    try {

      if(
        !formData.fullName ||
        !formData.fatherName ||
        !formData.motherName ||
        !formData.placeofbirth ||
        !dob ||
        !pob ||
        !sponsors
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
        placeofbirth: formData.placeofbirth,
        dob: dob.toDate(),
        pob: pob.toDate(),
        sponsors: sponsors,
        docType: "Baptismal",
        isApproved: false,
        timeStamp: serverTimestamp()
      }
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
      <DialogTitle>Edit Baptismal</DialogTitle>
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
              id="motherName"
              name="motherName"
              value={formData.motherName}
              onChange={handleInputChange}
              label="Mother Name"
              placeholder="Mother Name"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              required
              id="placeofbirth"
              name="placeofbirth"
              value={formData.placeofbirth}
              onChange={handleInputChange}
              label="Place of Birth"
              placeholder="Place of Birth"
              fullWidth
              variant="outlined"
            />
          </Grid>
          {/* Left Column */}
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                sx={{ mt: 1, width: "100%" }}
                value={dob}
                onChange={handleDobChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <TextField
              sx={{ mt: 1.5, width: "100%" }}
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Baptized"
                sx={{ mt: 1.5, width: "100%" }}
                value={pob}
                onChange={handlePobChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>

          {sponsors.map((record, index) => (
            <TextField
              style={{ marginLeft: "15px" }}
              margin="dense"
              required
              name={`name${index}`}
              value={record.name}
              onChange={(e) => handleAddSponsors(e, index, "name")}
              label="Sponsors"
              placeholder="Sponsors"
              fullWidth
              variant="outlined"
              InputProps={
                sponsors.length > 1
                  ? {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleDeleteSponsor(index)}
                            style={{ color: "red" }}
                          >
                            <Iconify icon="material-symbols-light:delete-outline" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  : {}
              }
            />
          ))}

          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button onClick={addSponsors}>Add Another Sponsor</Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button
          onClick={() => handleEdit(id)}
          color="primary"
          variant="contained"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBaptismal;
