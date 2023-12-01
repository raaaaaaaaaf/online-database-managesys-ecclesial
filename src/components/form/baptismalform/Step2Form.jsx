import React, { useContext } from 'react'
import { AddFormContext } from '../../context/AddContext';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function Step2Form () {
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
      Sponsors
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          required
          id="rev"
          name="rev"
          value={formData.rev}
          onChange={handleInputChange}
          label="Reverend"
          fullWidth
          variant="standard"
        />
      </Grid>
      <Grid item xs={12} >
        <TextField
          required
          id="sponsor1"
          name="sponsor1"
          value={formData.sponsor1}
          onChange={handleInputChange}
          label="Sponsors"
          fullWidth
          autoComplete="family-name"
          variant="standard"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="sponsor2"
          name="sponsor2"
          value={formData.sponsor2}
          onChange={handleInputChange}
          label="Sponsors"
          fullWidth
          variant="standard"
          
        />
      </Grid>
      <Grid item xs={12} >
        <TextField
          required
          id="sponsor3"
          name="sponsor3"
          value={formData.sponsor3}
          onChange={handleInputChange}
          label="Sponsors"
          fullWidth
          variant="standard"
        />
      </Grid>
      <Grid item xs={12} >
        <TextField
          required
          id="sponsor4"
          name="sponsor4"
          value={formData.sponsor4}
          onChange={handleInputChange}
          label="Sponsors"
          fullWidth
          variant="standard"
        />
      </Grid>

    </Grid>
  </React.Fragment>
  )
}

 