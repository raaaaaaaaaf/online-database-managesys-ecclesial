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
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Iconify from "../iconify";

const AddMember = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    nname: "",
    religion: "",
    address: "",
    cp: "",
    edu: "",
    course: "",
    income: "",
    caddress: "",
    work: "",
    asawa: "",
    work1: "",
    nchild: "",
    achild: "",
  });
  const [member, setMember] = useState("");

  const [baptized, setBaptized] = useState("");

  const [confirmation, setConfirmation] = useState("");

  const [house, setHouse] = useState("");

  const [renting, setRenting] = useState("");

  const [nakikitira, setNakikitira] = useState("");

  const [cstatus, setCstatus] = useState("");

  const [chapel, setChapel] = useState("");

  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [dob, setDob] = useState(null);

  const [age, setAge] = useState("");

  const [children, setChildren] = useState([
    {
      name: "",
      age: "",
      work: "",
      baptized: "",
      kumpisal: "",
      inSchool: "",
      schoolLevel: "",
    },
  ]);

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

  const handleBChange = (event) => {
    setBaptized(event.target.value);
  };

  const handleCChange = (event) => {
    setConfirmation(event.target.value);
  };

  const handleHChange = (event) => {
    setHouse(event.target.value);
  };

  const handleRChange = (event) => {
    setRenting(event.target.value);
  };

  const handleNChange = (event) => {
    setNakikitira(event.target.value);
  };

  const handleCStatusChange = (event) => {
    setCstatus(event.target.value);
  };

  const handleChapelChange = (event) => {
    setChapel(event.target.value);
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
        name: "",
        age: "",
        work: "",
        baptized: "",
        kumpisal: "",
        inSchool: "",
        schoolLevel: "",
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

  const handleAdd = async () => {
    try {
      if (
        !formData.nname ||
        !formData.religion ||
        !formData.address ||
        !formData.cp ||
        !formData.edu ||
        !formData.course ||
        !formData.income ||
        !formData.caddress ||
        !formData.work ||
        !formData.asawa ||
        !formData.work1 ||
        !formData.nchild ||
        !formData.achild ||
        !dob ||
        !member ||
        !baptized ||
        !confirmation ||
        !house ||
        !renting ||
        !nakikitira ||
        !cstatus ||
        !children ||
        !chapel
      ) {
        toast.error("Please fill out all fields.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
        return; // Exit the function if validation fails
      }

      const dataRef = collection(db, "data_members");
      const data = {
        memberName: member,
        nickName: formData.nname,
        religion: formData.religion,
        address: formData.address,
        cp: formData.cp,
        edu: formData.edu,
        course: formData.course,
        income: formData.income,
        caddress: formData.caddress,
        work: formData.work,
        asawa: formData.asawa,
        work1: formData.work1,
        numberChild: formData.nchild,
        aliveChild: formData.achild,
        dob: dob.toDate(),
        age: age,
        baptized: baptized,
        confirmation: confirmation,
        house: house,
        renting: renting,
        nakikitira: nakikitira,
        cstatus: cstatus,
        children: children,
        chapel: chapel,

        timeStamp: serverTimestamp(),
      };
      await addDoc(dataRef, data);
      toast.success("Successfully added", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      navigate("/dashboard/user");
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
    <Dialog maxWidth={"lg"} open={open} onClose={onClose}>
      <DialogTitle>Members</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          {/* Right Column */}
          <Grid item xs={4}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-label">Select User</InputLabel>
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

          <Grid item xs={4}>
            <TextField
              
              id="nname"
              name="nname"
              value={formData.nname}
              onChange={handleInputChange}
              label="Nickname"
              placeholder="Nickname"
              fullWidth
              variant="outlined"
            />
          </Grid>

          
          <Grid item xs={4}>
          <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Chapel</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={chapel}
                label="Chapel"
                onChange={handleChapelChange}
              >
                <MenuItem value={"Bagumbayan Chapel"}>Bagumbayan Chapel</MenuItem>
                <MenuItem value={"Cab-ilan Chapel"}>Cab-ilan Chapel</MenuItem>
                <MenuItem value={"Cabayawan Chapel"}>Cabayawan Chapel</MenuItem>
                <MenuItem value={"Cayetano Chapel"}>Cayetano Chapel</MenuItem>
                <MenuItem value={"Cuarenta Chapel"}>Cuarenta Chapel</MenuItem>
                <MenuItem value={"Escolta Chapel"}>Escolta Chapel</MenuItem>
                <MenuItem value={"Gomez Chapel"}>Gomez Chapel</MenuItem>
                <MenuItem value={"Justiniana Edera Chapel"}>Justiniana Edera Chapel</MenuItem>
                <MenuItem value={"Luna Chapel"}>Luna Chapel</MenuItem>
                <MenuItem value={"Magsaysay Chapel"}>Magsaysay Chapel</MenuItem>
                <MenuItem value={"Mauswagon Chapel"}>Mauswagon Chapel</MenuItem>
                <MenuItem value={"Matingbe Chapel"}>Matingbe Chapel</MenuItem>
                <MenuItem value={"New Mabuhay Chapel"}>New Mabuhay Chapel</MenuItem>
                <MenuItem value={"Sitio Ecleo Chapel"}>Sitio Ecleo Chapel</MenuItem>
                <MenuItem value={"Sta. Cruz Chapel"}>Sta. Cruz Chapel</MenuItem>
                <MenuItem value={"Tagbuyakhaw Chapel"}>Tagbuyakhaw Chapel</MenuItem>
                <MenuItem value={"Wadas Chapel"}>Wadas Chapel</MenuItem>
                <MenuItem value={"White Beach Chapel"}>White Beach Chapel</MenuItem>
                <MenuItem value={"Wilson Chapel"}>Wilson Chapel</MenuItem>
                
              </Select>
            </FormControl>
          </Grid>
          {/* Left Column */}
          <Grid item xs={6}>
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
          <Grid item xs={6}>
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
              id="religion"
              name="religion"
              value={formData.religion}
              onChange={handleInputChange}
              label="Religion"
              placeholder="Religion"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Baptized?</InputLabel>
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
              <InputLabel id="demo-simple-select-label">
                Confirmation?
              </InputLabel>
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

          <Grid item xs={6}>
            <TextField
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              label="Address"
              placeholder="Address"
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              id="cp"
              name="cp"
              value={formData.cp}
              onChange={handleInputChange}
              label="Contact No."
              placeholder="XXXX XXXX XXXX"
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Own House?</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={house}
                label="Age"
                onChange={handleHChange}
              >
                <MenuItem value={"Yes"}>Yes</MenuItem>
                <MenuItem value={"No"}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Renting?</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={renting}
                label="Age"
                onChange={handleRChange}
              >
                <MenuItem value={"Yes"}>Yes</MenuItem>
                <MenuItem value={"No"}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Nakikitira?</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={nakikitira}
                label="Age"
                onChange={handleNChange}
              >
                <MenuItem value={"Yes"}>Yes</MenuItem>
                <MenuItem value={"No"}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
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
          <Grid item xs={6}>
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

          <Grid item xs={4}>
            <TextField
              id="income"
              name="income"
              value={formData.income}
              onChange={handleInputChange}
              label="Income in a week"
              placeholder=""
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="caddress"
              name="caddress"
              value={formData.caddress}
              onChange={handleInputChange}
              label="Company Address"
              placeholder=""
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="work"
              name="work"
              value={formData.work}
              onChange={handleInputChange}
              label="Other Knowledge Work"
              placeholder=""
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={2}>
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
                <MenuItem value={"Binata/Dalaga"}>Binata/Dalaga</MenuItem>
                <MenuItem value={"May Asawa"}>May Asawa</MenuItem>
                <MenuItem value={"Hiwalay sa Asawa"}>Hiwalay sa Asawa</MenuItem>
                <MenuItem value={"Balo"}>Balo</MenuItem>
                <MenuItem value={"Kasal sa simbahang Katoliko"}>
                  Kasal sa simbahang Katoliko
                </MenuItem>
                <MenuItem value={"Kasal sa ibang relihiyon"}>
                  Kasal sa ibang relihiyon
                </MenuItem>
                <MenuItem value={"Kasal sa Sibil"}>Kasal sa Sibil</MenuItem>
                <MenuItem value={"Nagsama ng di-kasal"}>
                  Nagsama ng di-kasal
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="asawa"
              name="asawa"
              value={formData.asawa}
              onChange={handleInputChange}
              label="Husband/Wife Name"
              placeholder=""
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              id="work1"
              name="work1"
              value={formData.work1}
              onChange={handleInputChange}
              label="Husband/Wife Work"
              placeholder=""
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={2}>
            <TextField
              type="number"
              id="nchild"
              name="nchild"
              value={formData.nchild}
              onChange={handleInputChange}
              label="Number of Children(All included)"
              placeholder=""
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              type="number"
              id="achild"
              name="achild"
              value={formData.achild}
              onChange={handleInputChange}
              label="How many are alive"
              placeholder=""
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={12}
            style={{ marginTop: "10px", marginBottom: "10px" }}
          >
            <Divider>CHILDREN</Divider>
          </Grid>

          {children.map((record, index) => (
            <Grid
              container
              spacing={1}
              key={index}
              style={{ marginLeft: "1px", marginBottom: "10px" }}
            >
              <Grid item xs={3}>
                <TextField
                  name={`name${index}`}
                  label="Children Name"
                  variant="outlined"
                  fullWidth
                  value={record.name}
                  onChange={(e) => handleAddChild(e, index, "name")}
                />
              </Grid>
              <Grid item xs={1}>
                <TextField
                  name={`age${index}`}
                  type="number"
                  label="Age"
                  variant="outlined"
                  fullWidth
                  value={record.age}
                  onChange={(e) => handleAddChild(e, index, "age")}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  name={`work${index}`}
                  label="Work"
                  variant="outlined"
                  fullWidth
                  value={record.work}
                  onChange={(e) => handleAddChild(e, index, "work")}
                />
              </Grid>

              <Grid item xs={1}>
                <FormControl fullWidth>
                  <InputLabel id={`baptized-label-${index}`}>
                    Nabinyagan?
                  </InputLabel>
                  <Select
                    labelId={`baptized-label-${index}`}
                    id={`baptized-select-${index}`}
                    label="Age"
                    value={record.baptized}
                    onChange={(e) => handleSelectChange(e, index, "baptized")}
                  >
                    <MenuItem value={"Yes"}>Yes</MenuItem>
                    <MenuItem value={"No"}>No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={1}>
                <FormControl fullWidth>
                  <InputLabel id={`kumpisal-label-${index}`}>
                    Nakumpisalan
                  </InputLabel>
                  <Select
                    labelId={`kumpisal-label-${index}`}
                    id={`kumpisal-select-${index}`}
                    label="Nakumpisalan"
                    value={record.kumpisal}
                    onChange={(e) => handleSelectChange(e, index, "kumpisal")}
                  >
                    <MenuItem value={"Yes"}>Yes</MenuItem>
                    <MenuItem value={"No"}>No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={1}>
                <FormControl fullWidth>
                  <InputLabel id={`inSchool-label-${index}`}>
                    Nag-aaral
                  </InputLabel>
                  <Select
                    labelId={`inSchool-label-${index}`}
                    id={`inSchool-select-${index}`}
                    label="Nag-aaral"
                    value={record.inSchool}
                    onChange={(e) => handleSelectChange(e, index, "inSchool")}
                  >
                    <MenuItem value={"Yes"}>Yes</MenuItem>
                    <MenuItem value={"No"}>No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  name={`schoolLevel${index}`}
                  label="Kursong Pinag-aralan/Natapos"
                  variant="outlined"
                  fullWidth
                  value={record.schoolLevel}
                  onChange={(e) => handleAddChild(e, index, "schoolLevel")}
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
          <Grid item xs={12}>
            <Divider>
              <Button onClick={addChild}>Add Another Child</Button>
            </Divider>
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
