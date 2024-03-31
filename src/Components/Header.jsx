import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import logo1 from '../assets/logo1.png';

export default function Header() {
    return (
        <AppBar position="fixed" sx={{mb:5, bgcolor: '#1E3050' }}>
        <Toolbar>
          {/* logo 1 */}
          <img src={logo1} alt="logo1" style={{ width: '50px', height: '50px', marginRight: '16px' }} />

            <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Invoice Integrator
            </Typography>



            <IconButton edge="end" color="inherit" aria-label="menu">
            <MenuIcon />
            </IconButton>
        </Toolbar>
        </AppBar>
    );
    }

