import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import loader from '/assets/loader.gif'

export default function Loading() {
  return (
    <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
     }}>
      <img src={loader} alt='gif' />
    </Box>
  );
}