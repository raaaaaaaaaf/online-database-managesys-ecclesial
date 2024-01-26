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
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  DateRangePicker,
  SingleInputTimeRangeField,
} from "@mui/x-date-pickers-pro";
import { AuthContext } from "../../context/AuthContext";

const AddEvent = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    event: "",
    location: "",
  });

  const { currentUser } = useContext(AuthContext)

  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState({
    start: null,
    end: null,
  });
  const [time, setTime] = useState({
    start: null,
    end: null,
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    setMember(event.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (dates) => {
    setDate({
      start: dates[0] || date.start,
      end: dates[1] || date.end,
    });
  };

  const handleTimeChange = (dates) => {
    setTime({
      start: dates[0] || time.start,
      end: dates[1] || time.end,
    });
  };

  const handleAdd = async () => {
    try {
      if (
        !formData.event ||
        !formData.location ||
        !date.start ||
        !date.end ||
        !time.start ||
        !time.end
      ) {
        toast.error("Please fill out all fields.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
        return; // Exit the function if validation fails
      }
      const dataRef = collection(db, "data_events");
      const notificationRef = collection(db, "data_notifications");

      const eventMessage = `There's a new event happening: '${formData.event}' at ${formData.location} on ${date.start}. Check it out!`;

      
      const notificationData = {
        userName: "all_users",
        recipientUserId: "all_users",
        senderUserEmail: currentUser.email,
        senderUserId: currentUser.uid,
        displayName: currentUser.displayName,
        type: "event",
        role: "Admin",
        message: eventMessage,
        timestamp: serverTimestamp(),
        isRead: false,
      };

      const notificationDocRef = await addDoc(notificationRef, notificationData);

      const data = {
        eventName: formData.event,
        location: formData.location,
        startDay: date.start.toDate(),
        endDay: date.end.toDate(),
        startTime: time.start.toDate(),
        endTime: time.end.toDate(),
        eventNotificationID: notificationDocRef.id,
        timeStamp: serverTimestamp(),
      };

      await addDoc(dataRef, data);
      toast.success("Successfully added", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
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
      <DialogTitle>Event </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Right Column */}
          <Grid item xs={6}>
            <TextField
              required
              id="event"
              name="event"
              value={formData.event}
              onChange={handleInputChange}
              label="Event Name"
              placeholder="Event Name"
              fullWidth
              variant="outlined"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <SingleInputTimeRangeField
                label="Time"
                value={[time.start, time.end]}
                onChange={handleTimeChange}
                sx={{ mt: 1, width: "100%" }}
              />
            </LocalizationProvider>
          </Grid>
          {/* Left Column */}
          <Grid item xs={6}>
            <TextField
              required
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              label="Location: "
              placeholder="Location"
              fullWidth
              variant="outlined"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateRangePicker
                label="Date"
                value={[date.start, date.end]}
                onChange={handleDateChange}
                sx={{ mt: 1, width: "100%" }}
              />
            </LocalizationProvider>
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

export default AddEvent;
