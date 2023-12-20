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

const AddDonation = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    amount: "",
  });
  const [member, setMember] = useState("");

  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [dod, setDod] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];
        const dataRef = query(collection(db, "users"));
        const dataSnap = await getDocs(dataRef);
        dataSnap.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setMembers(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

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

  const handleDodChange = (date) => {
    setDod(date);
  };

  const handleAdd = async () => {
    try {
      if (!formData.amount || !member || !dod) {
        toast.error("Please fill out all fields.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
        return; // Exit the function if validation fails
      }
      // Convert the amount to a number
      const amountAsNumber = parseFloat(formData.amount);

      if (isNaN(amountAsNumber)) {
        toast.error("Please enter a valid amount.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
        return; // Exit the function if amount is not a valid number
      }

      const dataRef = collection(db, "data_donations");
      const data = {
        amount: amountAsNumber,

        memberName: member,

        donationDate: dod.toDate(),

        timeStamp: serverTimestamp(),
      };
      await addDoc(dataRef, data);
      toast.success("Successfully added", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      navigate("/dashboard/donation");
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
      <DialogTitle>Donation</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Right Column */}
          <Grid item xs={6}>
            <FormControl sx={{ mt: 1, width: "100%" }}>
              <InputLabel id="demo-simple-select-label">
                Select Member
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={member}
                label="Age"
                onChange={handleChange}
              >
                {members.map((memberItem) => (
                  <MenuItem key={memberItem.id} value={memberItem.displayName}>
                    {memberItem.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Left Column */}
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Donation Date"
                sx={{ mt: 1, width: "100%" }}
                value={dod}
                onChange={handleDodChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              label="Amount"
              placeholder="Amount"
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    ₱ {/* Peso symbol */}
                  </InputAdornment>
                ),
              }}
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

export default AddDonation;
