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

const RequestMarriage = () => {
  const [dobf, setDobf] = useState(null);
  const [dobm, setDobm] = useState(null);
  const [dom, setDom] = useState(null);
  const { currentUser, userData } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    fullName: "",
    motherName: "",
    fatherName: "",

    fullFName: "",
    motherFName: "",
    fatherFName: "",

  });

  const uid = currentUser.uid;

  const navigate = useNavigate();

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

  const handleAdd = async () => {
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
      const docRef = collection(db, "data_certificates");
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
        userName: userData.displayName,
        email: userData.email,
        uid: uid,
      };
      await addDoc(docRef, data);
      toast.success("Requested Succesfully", {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
      });
      navigate('/client/certificates')
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <Helmet>Request Marriage</Helmet>
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
              Request Marriage Certificate
            </Typography>
            <Button onClick={handleAdd} variant="contained">
              Submit
            </Button>
          </Stack>

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
        </Paper>
      </Container>
    </>
  );
};

export default RequestMarriage;
