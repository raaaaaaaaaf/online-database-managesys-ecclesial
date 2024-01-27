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
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const RequestCert = ({ open, onClose }) => {
  const [userList, setUserList] = useState([]);

  const [user, setUser] = useState("");

  const [docType, setDocType] = useState("");

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({});

  const [error, setError] = useState("");

  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];
        const dataRef = query(
          collection(db, "users"),
          where("role", "==", "User")
        );
        const dataSnap = await getDocs(dataRef);
        dataSnap.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setUserList(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      const dataRef = doc(db, "users", user);
      const fetchData = async () => {
        try {
          const docSnap = await getDoc(dataRef);
          if (docSnap.exists()) {
            setData({ ...docSnap.data(), user: docSnap.user });
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
  }, [user]);

  console.log(data);

  const handleChange = (event) => {
    setUser(event.target.value);
  };

  const handleDocType = (event) => {
    setDocType(event.target.value);

    if (event.target.value === "Marriage" && data.cstatus === "Single") {
      setError("You are not Married");
    } else {
      setError(""); // Reset error if conditions are not met
    }
  };

  const handleAdd = async () => {
    try {
      if (!user || !docType) {
        toast.error("Please fill out all fields.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
        return; // Exit the function if validation fails
      }

      const dataRef = collection(db, "data_certificates");
      const docRef = collection(db, "data_notifications");
      const chapelRef = doc(db, "data_chapel", data.chapelID);

      const notificationData = {
        userName: "ODMSBEC ADMIN",
        recipientUserId: "GoBdnoJ0ZhaA6wyjC7m9K8myDka2",
        senderUserEmail: currentUser.email,
        senderUserId: currentUser.uid,
        displayName: currentUser.displayName,
        type: "request",
        role: "Admin",
        docType: docType,
        message: "Has requested a certificate",
        timestamp: serverTimestamp(),
        isRead: false,
      };
      const notificationDocRef = await addDoc(docRef, notificationData);

      // Assuming docType is a variable that holds the type of certificate

      let updateField;

      if (docType === "Baptismal") {
        updateField = { baptismal: increment(1) };
      } else if (docType === "Marriage") {
        updateField = { marriage: increment(1) };
      } else {
        // Handle the case where docType is not recognized or do nothing
      }

      // Perform the update only if updateField is defined
      if (updateField) {
        await updateDoc(chapelRef, updateField);
      }

      const birthDate2Value = data.birthDate2 ? data.birthDate2.toDate() : null;
      const dateofmarriageValue = data.dateofmarriage
        ? data.dateofmarriage.toDate()
        : null;

      const docData = {
        fullName: data.displayName,
        fullName2: data.name2,
        fatherName: data.fatherFullName,
        motherName: data.motherFullName,
        birthplace: data.birthplace,
        birthDate: data.birthDate.toDate(),
        birthDate2: birthDate2Value,
        dateofmarriage: dateofmarriageValue,
        place: data.placeofmarriage,
        docType: docType,
        chapel: data.chapelName,
        isApproved: null,
        adminNotificationID: notificationDocRef.id,
        uid: currentUser.uid,
        userName: currentUser.displayName,
        email: currentUser.email,
        timeStamp: serverTimestamp(),
      };

      await addDoc(dataRef, docData);
      toast.success("Successfully added", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      navigate("/client/certificates");
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
      <DialogTitle>Request Certificate</DialogTitle>
      <DialogContent>
        <Grid container spacing={0.5}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Search Name</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={user}
                label="Age"
                onChange={handleChange}
              >
                {userList.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Certificate Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={docType}
                label="Age"
                onChange={handleDocType}
              >
                <MenuItem value={"Baptismal"}>Baptismal</MenuItem>
                <MenuItem value={"Marriage"}>Marriage</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>

        <Button
          onClick={handleAdd}
          color="primary"
          variant="contained"
          disabled={error}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestCert;
