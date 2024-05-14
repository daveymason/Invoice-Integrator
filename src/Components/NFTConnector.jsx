import React, { useState } from 'react';
import { Typography, Grid, Box, Button, CircularProgress, TextField, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function NFTConnector() {
  const [recipient, setRecipient] = useState('');
  const [tokenURI, setTokenURI] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mintResult, setMintResult] = useState('');

  const handleMint = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/mint_nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipient, token_uri: tokenURI }),
      });

      if (!response.ok) {
        throw new Error(`Minting failed with status: ${response.status}`);
      }

      const data = await response.json();
      setMintResult(`NFT minted successfully! Transaction hash: ${data.tx_hash}`);
    } catch (error) {
      console.error('Error minting NFT:', error);
      setMintResult('Error minting NFT');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid container spacing={2} sx={{ bgcolor: '#f5f5f5', p: 5 }}>
      <Grid item xs={12}>
        <Typography variant="h5">Mint NFT</Typography>
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="Recipient Address"
          variant="outlined"
          fullWidth
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </Grid>
      
      <Grid item xs={6}>
        <TextField
          label="Token URI"
          variant="outlined"
          fullWidth
          value={tokenURI}
          onChange={(e) => setTokenURI(e.target.value)}
        />
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          sx={{ bgcolor: '#1E3050', color: 'white', p: 2, m: 2 }}
          onClick={handleMint}
          disabled={isLoading}
        >
          <CloudUploadIcon sx={{ mr: 1 }} /> Mint NFT
        </Button>
      </Grid>

      <Grid item xs={12}>
        {isLoading ? <CircularProgress /> : mintResult && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="body1">{mintResult}</Typography>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
}

export default NFTConnector;
