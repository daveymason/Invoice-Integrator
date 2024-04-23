import React from 'react';
import { Typography, Grid, Box, Button } from '@mui/material';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { useDropzone } from 'react-dropzone';

function Uploader() {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    // Accept only PDF files
    accept: 'application/pdf',
    onDrop: async (acceptedFiles) => {
      // Use FormData to send files as multipart/form-data
      const formData = new FormData();
      acceptedFiles.forEach(file => {
        formData.append('file', file);
      });

      try {
        // Update the URL to the endpoint of your Flask backend
        const response = await fetch('/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          alert('File uploaded successfully!');
          // Handle response here
        } else {
          alert('File upload failed!');
          // Handle error here
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    },
  });
  
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
        <Box {...getRootProps()} style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px dashed #1E3050', borderRadius: '10px', minHeight: '200px'}}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography variant="h6" gutterBottom>
              Drop the files here
            </Typography>
          ) : (
            <Typography variant="h6" gutterBottom>
              <DragIndicatorIcon sx={{mr: 1}} />Drop some invoices here
            </Typography>
          )}
        
      </Box>

    </Grid>
    </Grid>
  );
}

export default Uploader;
