import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Grid, Card, CardContent, Typography, Avatar,
    CardActions, Button, IconButton, Tooltip
} from '@mui/material';

import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete';

import {
    fetchAllEvents,
    deleteEventById,
} from '../api/eventApi';

const UIEvent1 = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await fetchAllEvents();
                setEvents(data);
            } catch (err) {
                console.error("Error fetching events:", err);
            }
        };
        fetchEvents();
    }, []);

    const handleDelete = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteEventById(eventId);
            setEvents(prev => prev.filter(e => e._id !== eventId));
            alert("Event deleted successfully.");
        } catch (err) {
            console.error("Error deleting event:", err);
            alert("Failed to delete event.");
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
            {/* Page Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 6
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
                    🎉 My Events
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/dashboard2/create-template-event')}
                    sx={{
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        color: '#fff',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        borderRadius: '24px',
                        px: 4,
                        py: 1.5,
                        boxShadow: 4,
                        '&:hover': {
                            background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                            boxShadow: 6,
                        }
                    }}
                >
                    + Create New Event
                </Button>
            </Box>

            {/* Event Cards Grid */}
            <Grid container spacing={4}>
                {events.map((event, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                        <Card
                            sx={{
                                backdropFilter: 'blur(6px)',
                                background: 'rgba(255, 255, 255, 0.85)',
                                borderRadius: '24px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease-in-out',
                                height: '100%',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 20px 30px rgba(0,0,0,0.15)',
                                }
                            }}
                        >
                            <CardContent>
                                {/* Event Icon + Title */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            mr: 2,
                                            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                            color: '#fff',
                                            boxShadow: 3
                                        }}
                                    >
                                        <EventIcon />
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {event.eventTitle}
                                    </Typography>
                                </Box>

                                {/* Description */}
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 2,
                                        lineHeight: 1.5,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {event.eventDescription}
                                </Typography>

                                {/* Info Rows */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
                                    <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: '#6b7280' }} />
                                    <Typography variant="body2">
                                        {new Date(event.eventDate).toLocaleDateString()} at {event.time}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
                                    <LocationOnIcon fontSize="small" sx={{ mr: 1, color: '#6b7280' }} />
                                    <Typography variant="body2">{event.venue}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
                                    <PeopleAltIcon fontSize="small" sx={{ mr: 1, color: '#6b7280' }} />
                                    <Typography variant="body2">Invited: {event.guestsInvited?.length || 0}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <DoneAllIcon fontSize="small" sx={{ mr: 1, color: '#10b981' }} />
                                    <Typography variant="body2" sx={{ color: '#10b981' }}>
                                        Accepted: {event.guestsInvited?.filter(g => g.status === 'accepted').length || 0}
                                    </Typography>
                                </Box>
                            </CardContent>

                            {/* Actions */}
                            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => navigate(`/dashboard2/event/${event._id}`)}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '16px',
                                        fontWeight: 600,
                                        px: 3
                                    }}
                                >
                                    View
                                </Button>
                                <Tooltip title="Delete this event">
                                    <IconButton onClick={() => handleDelete(event._id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default UIEvent1;
