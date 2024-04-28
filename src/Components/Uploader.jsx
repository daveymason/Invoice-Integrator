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
      });

      if (!response.ok) {
        alert('File upload failed!');
        setUploadResult('File upload failed');
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      setUploadResult('File uploaded successfully!');
      setExtractedData(result.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadResult('Error uploading file');
    }
    setIsLoading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'application/pdf',
    onDrop: handleUpload,
  });

  function renderDataTable(data) {
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
                <TableCell align="right">{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  
  return (
    <Grid container spacing={2} sx={{ bgcolor: '#f5f5f5', p: 5 }} {...getRootProps()}>
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

      <Grid item xs={12}>
        {isLoading ? <CircularProgress /> : (uploadResult && renderDataTable(extractedData))}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
          {uploadResult}
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{color: '#323232'}}
        style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(extractedData, null, 2)}
      </Grid>
      
    </Grid>
  );
}

export default Uploader;
