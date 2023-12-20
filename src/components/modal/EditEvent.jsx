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
  import {
    DateRangePicker,
    SingleInputTimeRangeField,
  } from "@mui/x-date-pickers-pro";
  
  const EditEvent = ({ open, onClose, id, data }) => {
    const [formData, setFormData] = useState({
      event: "",
      location: "",
    });
  
    useEffect(() => {
        setFormData({
            event: data.eventName || "",
            location: data.location || "",
        })
        
      }, [data])
  
    const [date, setDate] = useState({
      start: null,
      end: null,
    });
    const [time, setTime] = useState({
      start: null,
      end: null,
    });
  
    const navigate = useNavigate();
  
  
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
  
    const handleEdit = async (id) => {
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
        const dataRef = doc(db, "data_events", id);
        const data = {
          eventName: formData.event,
          location: formData.location,
  
          startDay: date.start.toDate(),
          endDay: date.end.toDate(),
          startTime: time.start.toDate(),
          endTime: time.end.toDate(),
  
          timeStamp: serverTimestamp(),
        };
        await updateDoc(dataRef, data);
        toast.success("Successfully edited", {
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
        <DialogTitle>Edit Event </DialogTitle>
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
          <Button onClick={() => handleEdit(id)} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default EditEvent;
  