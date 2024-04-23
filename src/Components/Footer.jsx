import React from 'react';
import { Grid } from '@mui/material';


export default function Footer() {
    return (
      <Grid container spacing={2} sx={{bgcolor: '#00AEEF', mt:5 }}>
      <footer style={{backgroundColor: '#00AEEF', color: 'white', textAlign: 'center', padding: '3px', position: 'fixed', left: '0', bottom: '0', width: '100%'}}>
        <p>© {new Date().getFullYear()} Invoice Integrator. Jun found it </p>
      </footer>
    </Grid>
    );
    }

