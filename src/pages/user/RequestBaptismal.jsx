import {
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import Iconify from "../../components/iconify";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RequestBaptismal = () => {
  const [dob, setDob] = useState(null);
  const [pob, setPob] = useState(null);
  const { currentUser, userData } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: "",
    motherName: "",
    fatherName: "",
    placeofbirth: "",
    rev: "",
  });
  const [sponsors, setSponsors] = useState([
    {
      name: "",
    },
  ]);

  const uid = currentUser.uid;

  const navigate = useNavigate();

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

  const handleAdd = async () => {
    try {
      if (
        !formData.fullName ||
        !formData.fatherName ||
        !formData.motherName ||
        !formData.placeofbirth ||
        !formData.rev ||
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

      const docRef = collection(db, "data_certificates");
      const data = {
        fullName: formData.fullName,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        placeofbirth: formData.placeofbirth,
        rev: formData.rev,
        dob: dob.toDate(),
        pob: pob.toDate(),
        sponsors: sponsors,
        docType: "Baptismal",
        isApproved: false,
        userName: userData.displayName,
        email: userData.email,
        uid: uid,
        timeStamp: serverTimestamp(),
      };
      await addDoc(docRef, data);
      toast.success("Requested Succesfully", {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
      });
      navigate("/client/certificates");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <Helmet>Request Baptismal</Helmet>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Typography variant="h4" gutterBottom>
              Request Baptismal Certificate
            </Typography>
            <Button onClick={handleAdd} variant="contained">
              Submit
            </Button>
          </Stack>

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
              {sponsors.map((record, index) => (
                <TextField
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
              <Button onClick={addSponsors}>Add Another Sponsor</Button>
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
              <TextField
                sx={{ mt: 1.5, width: "100%" }}
                required
                id="rev"
                name="rev"
                value={formData.rev}
                onChange={handleInputChange}
                label="Reverend"
                placeholder="Father Name"
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default RequestBaptismal;
