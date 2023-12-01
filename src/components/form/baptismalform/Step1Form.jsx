import React, { useContext } from 'react'
import { AddFormContext } from '../../context/AddContext';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';


export default function Step1Form () {
    const {formData, setFormData} = useContext(AddFormContext);
          // Define the handleInputChange function to update formData
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };
  return (
    <React.Fragment>
    <Typography variant="h6" gutterBottom>
      Child's Information
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          required
          id="childName"
          name="childName"
          value={formData.childName}
          onChange={handleInputChange}
          label="Full Name"
          fullWidth
          variant="standard"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="church"
          name="church"
          value={formData.church}
          onChange={handleInputChange}
          label="Church"
          fullWidth
          variant="standard"
        />
      </Grid>
      <Grid item xs={12} >
        <TextField
          required
          id="parent1"
          name="parent1"
          value={formData.parent1}
          onChange={handleInputChange}
          label="Mother"
          fullWidth
          autoComplete="family-name"
          variant="standard"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="parent2"
          name="parent2"
          value={formData.parent2}
          onChange={handleInputChange}
          label="Father"
          fullWidth
          variant="standard"
        />
      </Grid>
      <Grid item xs={12} >
        <TextField
          required
          id="born"
          name="born"
          value={formData.born}
          onChange={handleInputChange}
          label="Place of Birth"
          fullWidth
          variant="standard"
        />
      </Grid>
      <Grid item xs={12} >
        <TextField
          required
          id="dob"
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
          label="Date of Birth"
          fullWidth
          variant="standard"
        />
      </Grid>
      <Grid item xs={12} >
        <TextField
          required
          id="dobaptized"
          name="dobaptized"
          value={formData.dobaptized}
          onChange={handleInputChange}
          label="Date of Baptized"
          fullWidth
          variant="standard"

        />
      </Grid>
    </Grid>
  </React.Fragment>
  )
}

 