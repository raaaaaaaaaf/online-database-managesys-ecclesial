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
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Attendance = ({ open, onClose, id }) => {
  const [fullName, setFullName] = useState("");

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(null)

  const [time, setTime] = useState(null)

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFullName(event.target.value);
  };

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleTimeChange = (time) => {
    setTime(time);
  };

  useEffect(() => {
    if (id) {
      const dataRef = doc(db, "data_events", id);
      const fetchData = async () => {
        try {
          const docSnap = await getDoc(dataRef);
          if (docSnap.exists()) {
            setData({ ...docSnap.data(), id: docSnap.id });
            setLoading(false);
          } else {
            setData({});
            setLoading(false);
          }
        } catch (err) {
          console.error(err);
          setData({});
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setData({});
    }
  }, [id]);



  const handleRegister = async (id) => {
    try {
      if (
        !fullName ||
        !date ||
        !time
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
        fullName: fullName,
        date: date.toDate(),
        time: time.toDate()
      };
      await updateDoc(dataRef, {
        attendanceData: arrayUnion(data),
      });
      toast.success("Attendance success", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
      });
      navigate("/client/events");
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
      <DialogTitle>Attendance </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Right Column */}
          <Grid item xs={12}>
            <FormControl sx={{ mt: 1, width: "100%" }}>
              <InputLabel id="demo-simple-select-label">Select Name</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={fullName}
                label="Age"
                onChange={handleChange}
              >
                {data.registerData ? (
                  data.registerData.map((item, index) => (
                    <MenuItem key={index} value={item.fullName}>
                      {" "}
                      {item.fullName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="None">No Registered Users</MenuItem>
                )}
              </Select>
            </FormControl>

          </Grid>
          {/* Left Column */}
          <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                sx={{  width: "100%" }}
                value={date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

          </Grid>

          <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Time"
                sx={{ width: "100%" }}
                value={time}
                onChange={handleTimeChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button
          onClick={() => handleRegister(id)}
          color="primary"
          variant="contained"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Attendance;
