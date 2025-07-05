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
    IconButton,
    Button
} from '@mui/material';
import {
    Dashboard,
    Group,
    Event,
    Favorite,
    Logout,
    Person,
    AdminPanelSettings
} from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useNavigation } from '../contexts/NavigationContext';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const { isUserMode, toggleMode } = useNavigation();

    const menuItems = isUserMode ? [
        { text: 'Events', icon: <Event />, path: '/dashboard2/UIEvent1' },
        { text: 'Invitations Received', icon: <Favorite />, path: '/dashboard2/invitations/received' },
        { text: 'Contacts', icon: <Group />, path: '/dashboard2/contacts' },
        { text: 'Profile', icon: <Person />, path: '/dashboard2/profile' },
    ] : [
        { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
        { text: 'Users', icon: <Group />, path: '/admin/users' },
        { text: 'Events', icon: <Event />, path: '/admin/events' },
        { text: 'Charities', icon: <Favorite />, path: '/admin/charities' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleToggleMode = () => {
        toggleMode();
        // Navigate to appropriate default page based on mode
        if (!isUserMode) {
            navigate('/dashboard2/UIEvent1'); // User mode - go to events
        } else {
            navigate('/admin'); // Admin mode - go to admin dashboard
        }
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
                    background: isUserMode
                        ? 'linear-gradient(135deg, #0f172a, #1e293b)'
                        : 'linear-gradient(135deg, #1e3a8a, #1e40af)',
                    color: '#fff',
                    borderRight: 'none',
                    boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
                },
            }}
        >
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                        className="sidebar-logo-avatar"
                        sx={{
                            bgcolor: isUserMode ? '#3b82f6' : '#fbbf24',
                            width: 40,
                            height: 40,
                            fontWeight: 600,
                            color: isUserMode ? '#fff' : '#1e3a8a'
                        }}
                    >
                        {isUserMode ? 'U' : 'A'}
                    </Avatar>
                    <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}>
                        {isUserMode ? 'User Panel' : 'Admin Panel'}
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
                                color: isActive
                                    ? (isUserMode ? '#3b82f6' : '#fbbf24')
                                    : '#e5e7eb',
                                backgroundColor: isActive
                                    ? (isUserMode ? 'rgba(59, 130, 246, 0.18)' : 'rgba(251, 191, 36, 0.18)')
                                    : 'transparent',
                                width: '100%',
                                borderLeft: isActive
                                    ? `4px solid ${isUserMode ? '#3b82f6' : '#fbbf24'}`
                                    : '4px solid transparent',
                                fontWeight: isActive ? 'bold' : 'normal',
                                boxShadow: isActive
                                    ? (isUserMode ? '0 0 12px 2px #3b82f655' : '0 0 12px 2px #fbbf2455')
                                    : 'none',
                                transition: 'all 0.25s cubic-bezier(.4,2,.6,1)'
                            })}
                        >
                            <ListItemButton className="sidebar-listitem-btn" sx={{ py: 1.5, px: 3 }}>
                                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </NavLink>
                    </ListItem>
                ))}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            {/* Mode Toggle Button */}
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={handleToggleMode}
                    startIcon={isUserMode ? <AdminPanelSettings /> : <Person />}
                    sx={{
                        color: '#fff',
                        borderColor: 'rgba(255,255,255,0.3)',
                        mb: 2,
                        '&:hover': {
                            borderColor: 'rgba(255,255,255,0.5)',
                            backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                    }}
                >
                    {isUserMode ? 'Switch to Admin' : 'Switch to User'}
                </Button>

                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, display: 'block' }}>
                    {isUserMode ? 'Logged in as User' : 'Logged in as Admin'}
                </Typography>
                <Tooltip title="Logout">
                    <IconButton onClick={handleLogout} sx={{ color: '#f87171' }}>
                        <Logout />
                    </IconButton>
                </Tooltip>
            </Box>
        </Drawer>
    );
};

export default AdminNavbar;
