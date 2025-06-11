import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    CardActions,
    Button
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
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/events', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(res.data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (eventId) => {
        const confirm = window.confirm("Are you sure you want to delete this event?");
        if (!confirm) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh events list
            setEvents(prev => prev.filter(e => e._id !== eventId));
            alert("Event deleted successfully.");
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Failed to delete event.");
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    My Events
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/dashboard2/create-template-event')}
                >
                    + Create New Event
                </Button>
            </Box>

            <Grid container spacing={3}>
                {events.map((event, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                        <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Avatar sx={{ bgcolor: '#3b82f6', mr: 1 }}>
                                        <EventIcon />
                                    </Avatar>
                                    <Typography variant="h6" component="div">
                                        {event.eventTitle}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {event.eventDescription}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="body2">
                                        {new Date(event.eventDate).toLocaleDateString()} at {event.time}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="body2">
                                        {event.venue}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <PeopleAltIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="body2">
                                        Invited: {event.guestsInvited?.length || 0}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <DoneAllIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="body2">
                                        Accepted: {
                                            event.guestsInvited?.filter(g => g.status === 'accepted').length || 0
                                        }
                                    </Typography>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    onClick={() => navigate(`/dashboard2/event/${event._id}`)}
                                >
                                    View
                                </Button>
                                <Button size="small" color="primary">
                                    Manage
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDelete(event._id)}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default UIEvent1;
