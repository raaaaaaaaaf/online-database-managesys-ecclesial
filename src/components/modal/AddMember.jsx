import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Iconify from "../iconify";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const AddMember = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    lname: "",
    fname: "",
    mname: "",
    address: "",
    birthplace: "",
    trabaho: "",
    income: "",
    edu: "",
    course: "",
    //father
    fatherlname: "",
    fatherfname: "",
    fathermname: "",

    //mother
    motherlname: "",
    motherfname: "",
    mothermname: "",

    //husband/wife
    name2: "",
    place: "",
  });

  const [baptized, setBaptized] = useState("");

  const [confirmation, setConfirmation] = useState("");

  const [confession, setConfession] = useState("");

  const [cstatus, setCstatus] = useState("");

  const [dom, setDom] = useState(null);

  const [dob, setDob] = useState(null);

  const [dob2, setDob2] = useState(null);

  const [age, setAge] = useState("");

  const [children, setChildren] = useState([
    {
      lname: "",
      fname: "",
      mname: "",
    },
  ]);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [chapelList, setChapelList] = useState([]);

  const [chapel, setChapel] = useState("");

  const [chapelID, setChapelID] = useState("");

  const [chapelName, setChapelName] = useState("");

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];
        const dataRef = query(collection(db, "data_chapel"));
        const dataSnap = await getDocs(dataRef);
        dataSnap.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setChapelList(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Combine first name, middle name, and last name into displayName
  const fullName = `${formData.fname} ${formData.mname} ${formData.lname}`;

  // Combine first name, middle name, and last name into displayName
  const fatherFullName = `${formData.fatherfname} ${formData.fathermname} ${formData.fatherlname}`;

  // Combine first name, middle name, and last name into displayName
  const motherFullName = `${formData.motherfname} ${formData.mothermname} ${formData.motherlname}`;

  const handleBChange = (event) => {
    setBaptized(event.target.value);
  };

  const handleCChange = (event) => {
    setConfirmation(event.target.value);
  };

  const handleCStatusChange = (event) => {
    setCstatus(event.target.value);
  };

  const handleMChange = (event) => {
    setConfession(event.target.value);
  };

  const handleCHapelChange = (event) => {
    const selectedChapel = event.target.value;
    const selectedChapelId = selectedChapel.id;
    const selectedChapelName = selectedChapel.name;

    // Perform any specific actions with the selected ID and name
    console.log("Selected Chapel ID:", selectedChapelId);
    console.log("Selected Chapel Name:", selectedChapelName);

    // Update state or perform other actions as needed
    setChapel(selectedChapel);
    setChapelID(selectedChapelId)
    setChapelName(selectedChapelName)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddChild = (event, index, fieldName) => {
    const updatedRecords = [...children];
    updatedRecords[index][fieldName] = event.target.value;
    setChildren(updatedRecords);
  };

  const handleSelectChange = (event, index, fieldName) => {
    const updatedRecords = [...children];
    updatedRecords[index][fieldName] = event.target.value;
    setChildren(updatedRecords);
  };

  const addChild = () => {
    setChildren([
      ...children,
      {
        lname: "",
        fname: "",
        mname: "",
      },
    ]);
  };

  const handleDeleteChild = (index) => {
    const updatedRecords = [...children];
    updatedRecords.splice(index, 1);
    setChildren(updatedRecords);
  };

  const handleDobChange = (date) => {
    setDob(date);

    // Calculate age based on the selected date of birth
    if (date) {
      const today = new Date();
      const birthDate = new Date(date);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();

      // Check if the birthday has occurred this year
      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
          today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }

      setAge(calculatedAge.toString());
    } else {
      setAge("");
    }
  };

  const handleDob2Change = (date) => {
    setDob2(date);
  };

  const handleDomChange = (date) => {
    setDom(date);
  };

  const handleAdd = async () => {
    try {
      if (
        !formData.lname ||
        !formData.fname ||
        !formData.mname ||
        !formData.address ||
        !formData.birthplace ||
        !formData.trabaho ||
        !formData.income ||
        !formData.edu ||
        !formData.course ||
        !formData.fatherlname ||
        !formData.fatherfname ||
        !formData.fathermname ||
        !formData.motherlname ||
        !formData.motherfname ||
        !formData.mothermname ||
        !dob ||
        !baptized ||
        !confirmation ||
        !confession ||
        !cstatus
      ) {
        toast.error("Please fill out all fields.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
        return; // Exit the function if validation fails
      }
      const birthDate2Value = dob2 ? dob2.toDate() : null;
      const dateofmarriageValue = dom ? dom.toDate() : null;
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, {
        displayName: fullName,
      });
      const dataRef = doc(db, "data_chapel", chapelID);
      const memberData = {
        fullName: fullName,
        fatherFullName: fatherFullName,
        motherFullName: motherFullName,
        address: formData.address,
        birthplace: formData.birthplace,
        trabaho: formData.trabaho,
        course: formData.course,
        income: formData.income,
        edu: formData.edu,
        name2: formData.name2,
        placeofmarriage: formData.place,
        birthDate: dob.toDate(),
        birthDate2: birthDate2Value,
        dateofmarriage: dateofmarriageValue,
        age: age,
        baptized: baptized,
        confirmation: confirmation,
        confession: confession,
        cstatus: cstatus,
        children: children,
      };
      const arrayField = "members";

      // Use arrayUnion to add memberData to the array
      const updateObject = {
        [arrayField]: arrayUnion(memberData),
      };

      await updateDoc(dataRef, updateObject);
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: fullName,
        email: email,
        password: password,
        role: "User",

        lname: formData.lname,
        fname: formData.fname,
        mname: formData.mname,

        fatherlname: formData.fatherlname,
        fatherfname: formData.fatherfname,
        fathermname: formData.fathermname,

        motherlname: formData.motherlname,
        motherfname: formData.motherfname,
        mothermname: formData.mothermname,

        fatherFullName: fatherFullName,
        motherFullName: motherFullName,
        address: formData.address,
        birthplace: formData.birthplace,
        trabaho: formData.trabaho,
        course: formData.course,
        income: formData.income,
        edu: formData.edu,
        name2: formData.name2,
        placeofmarriage: formData.place,
        birthDate: dob.toDate(),
        birthDate2: birthDate2Value,
        dateofmarriage: dateofmarriageValue,
        age: age,
        baptized: baptized,
        confirmation: confirmation,
        confession: confession,
        cstatus: cstatus,
        children: children,
        chapelID: chapelID,
        chapelName: chapelName
      });

      toast.success("Successfully registered!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      navigate("/client/userApp");
    } catch (error) {
      let customErrorMessage = "An error occurred.";

      // Check the error code and customize the message accordingly
      if (error.code === "auth/invalid-email") {
        customErrorMessage = "Invalid email address. Please check your email.";
      } else if (error.code === "auth/user-not-found") {
        customErrorMessage = "User not found. Please sign up or try again.";
      } // Add more conditions for other Firebase error codes if needed
      toast.error(customErrorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      console.error(error);
    }
  };
  console.log(chapel)

  return (
    <Dialog maxWidth={"md"} open={open} onClose={onClose}>
      <DialogTitle style={{ textAlign: "center" }}>
        SIGN-UP MEMBER SURVEY FORM
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          {/* Right Column */}
          <Grid item xs={4}>
            <TextField
              id="lname"
              name="lname"
              value={formData.lname}
              onChange={handleInputChange}
              label="Last Name"
              placeholder="Last Name"
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="fname"
              name="fname"
              value={formData.fname}
              onChange={handleInputChange}
              label="First Name"
              placeholder="First Name"
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="mname"
              name="mname"
              value={formData.mname}
              onChange={handleInputChange}
              label="Middle Name"
              placeholder="Middle Name"
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              label="Address"
              placeholder="Birth Place"
              fullWidth
              variant="outlined"
            />
          </Grid>
          {/* Left Column */}
          <Grid item xs={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ width: "100%" }}
                label="Date of Birth"
                value={dob}
                onChange={handleDobChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={1}>
            <TextField
              id="age"
              name="age"
              label="Age"
              value={age}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="birthplace"
              name="birthplace"
              value={formData.birthplace}
              onChange={handleInputChange}
              label="Birth Place"
              placeholder="Birth Place"
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Nakompirmahan?
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={baptized}
                label="Age"
                onChange={handleBChange}
              >
                <MenuItem value={"Yes"}>Yes</MenuItem>
                <MenuItem value={"No"}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Nabinyagan?</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={confirmation}
                label="Age"
                onChange={handleCChange}
              >
                <MenuItem value={"Yes"}>Yes</MenuItem>
                <MenuItem value={"No"}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Nakumpisalan?
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={confession}
                label="Age"
                onChange={handleMChange}
              >
                <MenuItem value={"Yes"}>Yes</MenuItem>
                <MenuItem value={"No"}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Chapel</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={chapel}
                label="Chapel"
                onChange={handleCHapelChange}
              >
                {chapelList.map((chapel) => (
                  <MenuItem
                    key={chapel.id}
                    value={chapel}
                  >
                    {chapel.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="trabaho"
              name="trabaho"
              value={formData.trabaho}
              onChange={handleInputChange}
              label="Trabaho"
              placeholder="Trabaho"
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="income"
              name="income"
              value={formData.income}
              onChange={handleInputChange}
              label="Monthly Income"
              placeholder="Monthly Income"
              fullWidth
              type="number"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₱</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Civil Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={cstatus}
                label="Civil Status"
                onChange={handleCStatusChange}
              >
                <MenuItem value={"Single"}>Single</MenuItem>
                <MenuItem value={"Married"}>Married</MenuItem>
                <MenuItem value={"Divorced"}>Divorced</MenuItem>
                <MenuItem value={"Widowed"}>Widowed</MenuItem>
                <MenuItem value={"Separated"}>Separated</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="edu"
              name="edu"
              value={formData.edu}
              onChange={handleInputChange}
              label="Educational Attainment"
              placeholder=""
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="course"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              label="Course Completed"
              placeholder=""
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} style={{ marginTop: "5px", marginBottom: "5px" }}>
            <Divider>FATHER</Divider>
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="fatherlname"
              name="fatherlname"
              value={formData.fatherlname}
              onChange={handleInputChange}
              label="Last Name"
              placeholder="Last Name"
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="fatherfname"
              name="fatherfname"
              value={formData.fatherfname}
              onChange={handleInputChange}
              label="First Name"
              placeholder="First Name"
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="fathermname"
              name="fathermname"
              value={formData.fathermname}
              onChange={handleInputChange}
              label="Middle Name"
              placeholder="Middle Name"
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} style={{ marginTop: "5px", marginBottom: "5px" }}>
            <Divider>MOTHER</Divider>
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="motherlname"
              name="motherlname"
              value={formData.motherlname}
              onChange={handleInputChange}
              label="Last Name"
              placeholder="Last Name"
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="motherfname"
              name="motherfname"
              value={formData.motherfname}
              onChange={handleInputChange}
              label="First Name"
              placeholder="First Name"
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="mothermname"
              name="mothermname"
              value={formData.mothermname}
              onChange={handleInputChange}
              label="Middle Name"
              placeholder="Middle Name"
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid
            item
            xs={12}
            style={{ marginTop: "10px", marginBottom: "10px" }}
          >
            {cstatus !== "Single" && <Divider>If Married</Divider>}
          </Grid>

          {cstatus !== "Single" && (
            <>
              <Grid item xs={3}>
                <TextField
                  id="name2"
                  name="name2"
                  value={formData.name2}
                  onChange={handleInputChange}
                  label="Husband/Wife Name"
                  placeholder="Full Name"
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Date of Birth"
                    value={dob2}
                    onChange={handleDob2Change}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={3}>
                <TextField
                  id="place"
                  name="place"
                  value={formData.place}
                  onChange={handleInputChange}
                  label="Place of Marriage"
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Date of Marriage"
                    value={dom}
                    onChange={handleDomChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            </>
          )}
          <Grid
            item
            xs={12}
            style={{ marginTop: "10px", marginBottom: "10px" }}
          >
            {cstatus !== "Single" && <Divider>Children</Divider>}
          </Grid>
          {cstatus !== "Single" &&
            children.map((record, index) => (
              <Grid
                container
                spacing={1}
                key={index}
                style={{
                  marginLeft: "1px",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                <Grid item xs={4}>
                  <TextField
                    name={`lname${index}`}
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    value={record.lname}
                    onChange={(e) => handleAddChild(e, index, "lname")}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    name={`fname${index}`}
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    value={record.fname}
                    onChange={(e) => handleAddChild(e, index, "fname")}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    name={`mname${index}`}
                    label="Middle Name"
                    variant="outlined"
                    fullWidth
                    value={record.mname}
                    onChange={(e) => handleAddChild(e, index, "mname")}
                    InputProps={
                      children.length > 1
                        ? {
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => handleDeleteChild(index)}
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
                </Grid>
              </Grid>
            ))}
          {cstatus !== "Single" && (
            <Grid item xs={12}>
              <Divider>
                <Button onClick={addChild}>Add Another Child</Button>
              </Divider>
            </Grid>
          )}

          <Grid item xs={12} style={{ marginBottom: "5px" }}>
            <Divider>Account Information</Divider>
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="email"
              label="Email address"
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="password"
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      <Iconify
                        icon={
                          showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                        }
                      />
                    </IconButton>
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

export default AddMember;
