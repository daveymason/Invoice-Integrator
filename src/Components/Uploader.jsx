import React from 'react';
import { Typography, Grid, Box, Button } from '@mui/material';
//upload icon
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
//drag icon
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

function Uploader() {
  return (
    <Grid container spacing={2} sx={{bgcolor: '#f5f5f5', p:5 }}>
    <Grid item xs={6} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      {/* Upload Button with Icon */}
      <Button variant="contained" component="label" sx={{bgcolor: '#1E3050', color: 'white', p: 2, m: 2}}>
      <CloudUploadIcon sx={{mr: 1}} />Upload Invoices
        <input type="file" hidden />
      </Button>
    </Grid>
    <Grid item xs={6} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Box sx={{ flexGrow: 1, minHeight: '20vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 5, bgcolor: '#fff', borderRadius: '10px', border: '1px solid #1E3050' }}>
        <Typography variant="h6" gutterBottom sx={{color: '#1E3050'}}>
          <DragIndicatorIcon sx={{mr: 1}} />
            Drop Invoices Here
        </Typography>
      </Box>
    </Grid>
    </Grid>
  );
}

export default Uploader;
