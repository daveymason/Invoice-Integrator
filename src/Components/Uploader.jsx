import React, { useState } from 'react';
import { Typography, Grid, Box, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useDropzone } from 'react-dropzone';

function Uploader() {
  const [uploadResult, setUploadResult] = useState(''); // State to store the upload result
  const [extractedData, setExtractedData] = useState(''); // State to store extracted data from the upload

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'application/pdf',
    onDrop: async (acceptedFiles) => {
      const formData = new FormData();
      acceptedFiles.forEach(file => {
        formData.append('file', file);
      });

      try {
        const response = await fetch('/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (response.ok) {
          setUploadResult('File uploaded successfully!');
          setExtractedData(result.data); // Update extracted data state
        } else {
          alert('File upload failed!');
          setUploadResult('File upload failed');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadResult('Error uploading file');
      }
    },
  });

  return (
    <Grid container spacing={2} sx={{ bgcolor: '#f5f5f5', p: 5 }}>
      {extractedData && (
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {extractedData}
          </Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
          {uploadResult}
        </Typography>
      </Grid>
      <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button variant="contained" component="label" sx={{ bgcolor: '#1E3050', color: 'white', p: 2, m: 2 }} {...getRootProps()}>
          <CloudUploadIcon sx={{ mr: 1 }} />Upload Invoices
          <input type="file" hidden {...getInputProps()} />
        </Button>
      </Grid>
      <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box {...getRootProps()} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px dashed #1E3050', borderRadius: '10px', minHeight: '200px' }}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography variant="h6" gutterBottom>
              Drop the files here
            </Typography>
          ) : (
            <Typography variant="h6" gutterBottom>
              <DragIndicatorIcon sx={{ mr: 1 }} />Drag and drop some invoices here, or click to select files
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default Uploader;
