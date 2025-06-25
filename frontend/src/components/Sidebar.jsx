import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  Avatar,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Event,
  MarkEmailUnread,
  People,
  AccountCircle,
  Logout
} from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Events', icon: <Event />, path: '/dashboard2/UIevent1' },
    { text: 'Invitations Received', icon: <MarkEmailUnread />, path: '/dashboard2/invitations/received' }, // ✅ Only this remains
    { text: 'Contacts', icon: <People />, path: '/dashboard2/contacts' },
    { text: 'Profile', icon: <AccountCircle />, path: '/dashboard2/profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 260,
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          color: '#fff',
          borderRight: 'none',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: '#3b82f6', width: 40, height: 40, fontWeight: 600 }}>TP</Avatar>
          <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}>
            TwoPresents
          </Typography>
        </Box>
      </Toolbar>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? '#3b82f6' : '#e5e7eb',
                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                width: '100%',
                borderLeft: isActive ? '4px solid #3b82f6' : '4px solid transparent',
                fontWeight: isActive ? 'bold' : 'normal'
              })}
            >
              <ListItemButton sx={{ py: 1.5, px: 3 }}>
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </NavLink>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Tooltip title="Logout">
          <IconButton onClick={handleLogout} sx={{ color: '#f87171' }}>
            <Logout />
          </IconButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
