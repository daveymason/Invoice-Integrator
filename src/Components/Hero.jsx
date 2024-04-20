import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import heroImage from '../assets/heroImage.png'; 

function Hero() {
  return (
    <Box sx={{ flexGrow: 1, minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 5,mt:5 }}>
      <Grid container spacing={2}>
        <Grid item xs={1}>
          {/* Empty grid item to create space */}
        </Grid>
        <Grid item xs={10} md={5}>
          <Typography variant="h3" gutterBottom>
            AI-Powered Invoice Solutions
          </Typography>
          <Typography variant="h6" gutterBottom>
          Say goodbye to manual sorting and hello to automated, error-free processing with our 
          <b> intelligent cloud system</b> that harnesses the power of <b>AI</b> to <i>redefine invoice management</i>.
           </Typography>
        </Grid>
        <Grid item xs={12} md={5} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <img 
            src={heroImage} 
            alt="Efficient Invoicing" 
            style={{ maxWidth: '66%', maxHeight: '320px' }} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Hero;
