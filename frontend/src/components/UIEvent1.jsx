import React, { useEffect, useState } from 'react';
import {
    fetchAllEvents,
    deleteEventById,
    // ...other functions
} from '../api/eventApi';
// adjust path as needed

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    CardActions,
    Button,
    Tooltip,
    IconButton,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const UIEvent1 = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const fetchEvents = async () => {
        try {
            const data = await fetchAllEvents();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            await deleteEventById(eventId);
            setEvents(prev => prev.filter(e => e._id !== eventId));
            alert("Event deleted successfully.");
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Failed to delete event.");
        }
    };

    return (
        <Box sx={{ flexGrow: 1, p: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>
                    My Events
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold' }}
                    onClick={() => navigate('/dashboard2/create-template-event')}
                >
                    + Create New Event
                </Button>
            </Box>

            <Grid container spacing={4}>
                {events.map((event, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                        <Card
                            sx={{
                                height: '100%',
                                borderRadius: 4,
                                boxShadow: 6,
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 10
                                },
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'linear-gradient(to right, #3b82f6, #6366f1)',
                                            mr: 2,
                                            width: 48,
                                            height: 48,
                                            background: 'linear-gradient(to right, #3b82f6, #6366f1)'
                                        }}
                                    >
                                        <EventIcon />
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {event.eventTitle}
                                    </Typography>
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {event.eventDescription}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: '#555' }} />
                                    <Typography variant="body2">
                                        {new Date(event.eventDate).toLocaleDateString()} at {event.time}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <LocationOnIcon fontSize="small" sx={{ mr: 1, color: '#555' }} />
                                    <Typography variant="body2">{event.venue}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <PeopleAltIcon fontSize="small" sx={{ mr: 1, color: '#555' }} />
                                    <Typography variant="body2">
                                        Invited: {event.guestsInvited?.length || 0}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <DoneAllIcon fontSize="small" sx={{ mr: 1, color: '#10b981' }} />
                                    <Typography variant="body2" color="success.main">
                                        Accepted: {event.guestsInvited?.filter(g => g.status === 'accepted').length || 0}
                                    </Typography>
                                </Box>
                            </CardContent>

                            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => navigate(`/dashboard2/event/${event._id}`)}
                                    sx={{
                                        borderRadius: 2,
                                        fontWeight: 'bold',
                                        textTransform: 'none'
                                    }}
                                >
                                    View
                                </Button>

                                <Tooltip title="Delete this event">
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(event._id)}
                                    >
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
