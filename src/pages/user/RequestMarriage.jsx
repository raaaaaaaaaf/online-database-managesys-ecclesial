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
  const { currentUser, userData } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    gfullName: "",

    bfullName: "",

    place: "",
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
      if (
        !formData.gfullName ||
        !formData.bfullName ||
        !formData.place ||
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
        gfullName: formData.gfullName,
        bfullName: formData.bfullName,
        place: formData.place,
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
      navigate("/client/certificates");
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Marriage"
                  sx={{ mt: 1, mb: 0.5, width: "100%" }}
                  value={dom}
                  onChange={handleDomChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>

              <TextField
                margin="dense"
                required
                id="gfullName"
                name="gfullName"
                value={formData.gfullName}
                onChange={handleInputChange}
                label="Groom Full Name"
                placeholder="Full Name"
                fullWidth
                variant="outlined"
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Groom Date of Birth"
                  sx={{ mt: 1, width: "100%" }}
                  value={dobm}
                  onChange={handleDobmChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            {/* Left Column */}
            <Grid item xs={6}>
              <TextField
                margin="dense"
                required
                id="place"
                name="place"
                value={formData.place}
                onChange={handleInputChange}
                label="Place of Marriage"
                placeholder="Place of Marriage"
                fullWidth
                variant="outlined"
              />

              <TextField
                margin="dense"
                required
                id="bfullName"
                name="bfullName"
                value={formData.bfullName}
                onChange={handleInputChange}
                label="Bride Full Name"
                placeholder="Bride Full Name"
                fullWidth
                variant="outlined"
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Bride Date of Birth"
                  sx={{ mt: 1, width: "100%" }}
                  value={dobf}
                  onChange={handleDobfChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default RequestMarriage;
