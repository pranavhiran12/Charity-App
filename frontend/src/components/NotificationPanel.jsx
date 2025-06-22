import React, { useEffect, useState } from 'react';
import {
    IconButton, Badge, Menu, MenuItem, Typography,
    CircularProgress, Box, Divider, Button
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api'; // Your axios instance

const NotificationPanel = ({ token: propToken }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [prevIds, setPrevIds] = useState([]); // For toast detection
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);
    const token = propToken || localStorage.getItem('token');

    const fetchNotifications = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await API.get('/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const newData = res.data;
            setNotifications(newData);

            // Detect new unseen notifications

            const currentIds = newData.map(n => n._id);
            const newUnseen = newData.filter(n => !prevIds.includes(n._id) && !n.isRead);


            // ✅ Show toast for each new unread notification

            newUnseen.forEach(n =>
                toast.info(n.message, {
                    onClick: () => {
                        if (n.link) navigate(n.link);
                    },
                    closeOnClick: true
                })
            );

            setPrevIds(currentIds);
        } catch (err) {
            console.error("❌ Error fetching notifications:", err);
        }
        setLoading(false);
    };

    const handleOpen = (e) => {
        setAnchorEl(e.currentTarget);
        fetchNotifications();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickNotification = async (notification) => {
        try {
            await API.put(`/notifications/${notification._id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (notification.link) {
                navigate(notification.link);
                handleClose();
            }
        } catch (err) {
            console.error("❌ Error marking as read:", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await API.put(`/notifications/mark-all-read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (err) {
            console.error("❌ Failed to mark all as read:", err);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // ✅ Auto-fetch every 30 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <IconButton color="inherit" onClick={handleOpen}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{ sx: { width: 320, maxHeight: 400 } }}
            >
                <Box p={1} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">Notifications</Typography>
                    {unreadCount > 0 && (
                        <Button size="small" onClick={handleMarkAllAsRead}>
                            Mark all as read
                        </Button>
                    )}
                </Box>
                <Divider />

                {loading ? (
                    <Box p={2} textAlign="center"><CircularProgress size={24} /></Box>
                ) : notifications.length === 0 ? (
                    <MenuItem disabled>No notifications</MenuItem>
                ) : (
                    notifications.map((notif) => (
                        <MenuItem
                            key={notif._id}
                            onClick={() => handleClickNotification(notif)}
                            sx={{ backgroundColor: notif.isRead ? 'white' : '#f0f8ff' }}
                        >
                            <Typography variant="body2">{notif.message}</Typography>
                        </MenuItem>
                    ))
                )}
            </Menu>
        </>
    );
};

export default NotificationPanel;
