import React, { useState } from 'react';
import { Typography, Grid, Box, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useDropzone } from 'react-dropzone';

function Uploader() {
  const [uploadResult, setUploadResult] = useState('');
  const [extractedData, setExtractedData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (files) => {
    setIsLoading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('file', file));
  
    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (event) => {
          const progress = Math.round((event.loaded / event.total) * 100);
          console.log(`Upload progress: ${progress}%`);
        },
      });
  
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
  
      const contentType = response.headers.get('Content-Type');
  
      if (contentType.includes('application/json')) {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          setUploadResult('File uploaded successfully!');
          setExtractedData(data);
        } catch (e) {
          console.error('Error parsing JSON:', e);
          setUploadResult('File upload failed - server did not return valid JSON.');
        }
      } else {
        // Handle other response formats here
        const text = await response.text();
        setUploadResult('File uploaded successfully!');
        console.log('Server response (not JSON):', text);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadResult('Error uploading file');
    } finally {
      setIsLoading(false);
    }
  };
  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'application/pdf',
    onDrop: handleUpload,
  });

  function renderDataTable(data) {
    if (typeof data !== 'object' || data == null) {
      return <Typography> No data to display. </Typography>;
    }
  
    const entries = Object.entries(data);
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Field</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map(([key, value]) => (
              <TableRow
                key={key}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {key}
                </TableCell>
                <TableCell align="right">
                  {typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  
  
  return (
    <Grid container spacing={2} sx={{ bgcolor: '#f5f5f5', p: 5 }} >
      <Grid item xs={6}>
        <Button variant="contained" component="label" sx={{ bgcolor: '#1E3050', color: 'white', p: 2, m: 2 }}>
          <CloudUploadIcon sx={{ mr: 1 }} />Upload Invoices
          <input {...getInputProps({ onClick: event => event.stopPropagation() })} hidden />
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Box {...getRootProps()} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px dashed #1E3050', borderRadius: '10px', minHeight: '200px' }}>         
        <input {...getInputProps()} />
        {isDragActive ? (
              <Typography variant="h6" gutterBottom>
                Drop the files here
              </Typography>
            ) : (
              <Typography variant="h6" gutterBottom>
                <DragIndicatorIcon sx={{ mr: 1 }} />Drag and drop some invoices here
              </Typography>
            )}
        </Box>
      </Grid>

      <Grid item xs={12}>
        <hr />
      </Grid>

      <Grid item xs={12} sx={{color: '#323232'}}>
        {extractedData && <Typography variant="h5">Extracted Data</Typography>}
      </Grid>

      <Grid item xs={12}>
        {isLoading ? <CircularProgress /> : (uploadResult && renderDataTable(extractedData))}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
          {uploadResult}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default Uploader;
