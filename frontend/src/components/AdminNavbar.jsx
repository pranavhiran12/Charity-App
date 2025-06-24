import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Button,
    Avatar,
    useMediaQuery
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    Group,
    Event,
    Favorite,
    Logout
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const navigate = useNavigate();
    const location = useLocation();

    const toggleDrawer = () => setDrawerOpen(!drawerOpen);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const admin = JSON.parse(localStorage.getItem('user')) || { name: 'Admin' };

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
        { text: 'Users', icon: <Group />, path: '/admin/users' },
        { text: 'Events', icon: <Event />, path: '/admin/events' },
        { text: 'Charities', icon: <Favorite />, path: '/admin/charities' },
    ];

    const drawerContent = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
            <List>
                {menuItems.map(item => (
                    <ListItem
                        button
                        key={item.text}
                        selected={location.pathname === item.path}
                        onClick={() => navigate(item.path)}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
                <ListItem button onClick={handleLogout}>
                    <ListItemIcon><Logout /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#1e3a8a' }}>
                <Toolbar>
                    {isMobile && (
                        <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography
                        variant="h6"
                        onClick={() => navigate('/admin/dashboard')}
                        sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Admin Panel
                    </Typography>

                    {!isMobile && (
                        <>
                            {menuItems.map(item => (
                                <Button
                                    key={item.text}
                                    color="inherit"
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                                        textDecoration: location.pathname === item.path ? 'underline' : 'none'
                                    }}
                                >
                                    {item.text}
                                </Button>
                            ))}
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                            <Avatar sx={{ ml: 2, bgcolor: 'white', color: '#1e3a8a', fontWeight: 'bold' }}>
                                {admin.name?.charAt(0).toUpperCase()}
                            </Avatar>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                {drawerContent}
            </Drawer>
        </>
    );
};

export default AdminNavbar;
