import React, { useEffect, useState } from 'react';
import { GrView } from "react-icons/gr";
import { Link } from 'react-router-dom';
import './css/header.css';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import { alpha } from '@mui/material/styles';
const HeaderAdmin = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(null);
  const MENU_OPTIONS = [
    {
      label: 'Home',
      icon: 'eva:home-fill',
    },
    {
      label: 'Profile',
      icon: 'eva:person-fill',
    },
    {
      label: 'Settings',
      icon: 'eva:settings-2-fill',
    },
  ];
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  useEffect(() => {
    const accessToken = window.localStorage.getItem("accessToken");
    if (accessToken) {
      fetchUserInfo(accessToken);
    }
  }, []);

  function fetchUserInfo(accessToken) {
    fetch("http://localhost:5000/getProfile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((userData) => {
        setUser(userData.user);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }
  const logOut = () => {
    window.localStorage.clear();
    window.location.href= "/login-admin";
  };
  return (
    <header className="header">
      <h1>Tân Mai</h1>
      <Link to="/" className='viewhome'><GrView /> Xem Trang Chủ</Link> 
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '50%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        
        {user && (
        <Avatar src={user.avatar} alt="photoURL" />
        )}
      </IconButton>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        disableScrollLock
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
         {user && (
           <Box sx={{ my: 1.5, px: 2.5 }}>
           <Typography variant="subtitle2" noWrap>
             {user.fullName}
           </Typography>
           <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
             {user.email}
           </Typography>
         </Box>
          )}
  
        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={logOut} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </header>

  );
};

export default HeaderAdmin;
