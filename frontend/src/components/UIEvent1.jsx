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

import axios from 'axios';
import EventCard from './EventDetails/EventCard';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import './UIEvent1.css';

const UIEvent1 = () => {
    const [events, setEvents] = useState([]);
    const [invitationStats, setInvitationStats] = useState({});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get current user info
    const currentUser = JSON.parse(localStorage.getItem('user')) || { name: 'User' };

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchAllEvents();
                setEvents(data);

                const statsMap = {};
                for (const event of data) {
                    try {
                        const res = await axios.get(`/api/invitations/stats/${event._id}`);
                        const stats = res.data;
                        statsMap[event._id] = {
                            invited: stats.accepted + stats.declined + stats.pending,
                            accepted: stats.accepted
                        };
                    } catch (err) {
                        console.warn(`Failed to fetch stats for event ${event._id}`, err);
                        statsMap[event._id] = { invited: 0, accepted: 0 };
                    }
                }
                setInvitationStats(statsMap);
            } catch (err) {
                setError('Error fetching your events.');
                console.error("Error fetching events:", err);
            } finally {
                setLoading(false);
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

    // Helper to get event status
    function getEventStatus(eventDate) {
        const today = new Date();
        const eventDay = new Date(eventDate);
        if (
            eventDay.toDateString() === today.toDateString()
        ) return 'today';
        if (eventDay > today) return 'upcoming';
        return 'past';
    }

    return (
        <Box className="ui-event1-bg">
            <Box className="ui-event1-header">
                <Typography variant="h4" className="ui-event1-title">
                    🎉 My Events
                </Typography>
                <Typography variant="body1" sx={{ color: '#6b7280', mb: 2 }}>
                    Welcome back, {currentUser.name}! Here are your events.
                </Typography>
                <Button
                    variant="contained"
                    className="ui-event1-create-btn"
                    onClick={() => navigate('/dashboard2/create-template-event')}
                >
                    + Create New Event
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                    <CircularProgress size={48} thickness={4} />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
            ) : events.length === 0 ? (
                <Box className="ui-event1-empty">
                    <svg className="ui-event1-empty-illustration" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="90" cy="100" rx="70" ry="12" fill="#e0e7ff" />
                        <rect x="40" y="40" width="100" height="40" rx="12" fill="#6366f1" fillOpacity="0.13" />
                        <rect x="60" y="50" width="60" height="20" rx="6" fill="#6366f1" fillOpacity="0.18" />
                        <circle cx="90" cy="60" r="8" fill="#6366f1" fillOpacity="0.22" />
                    </svg>
                    <Typography variant="h6" className="ui-event1-empty-title">
                        You haven't created any events yet. Start by creating your first event!
                    </Typography>
                    <Button
                        variant="contained"
                        className="ui-event1-create-btn"
                        onClick={() => navigate('/dashboard2/create-template-event')}
                    >
                        + Create Your First Event
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {events.map((event, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={event._id}>
                            <div
                                className={`ui-event1-card ui-event1-card-animate`}
                                style={{ animationDelay: `${idx * 0.08 + 0.1}s` }}
                            >
                                {/* Event Status Badge */}
                                <span className={`ui-event1-badge ${getEventStatus(event.eventDate)}`}>
                                    {getEventStatus(event.eventDate) === 'today' ? 'Today' : getEventStatus(event.eventDate) === 'upcoming' ? 'Upcoming' : 'Past'}
                                </span>
                                <EventCard
                                    event={event}
                                    stats={invitationStats[event._id]}
                                    onView={() => navigate(`/dashboard2/event/${event._id}`)}
                                    onDelete={() => handleDelete(event._id)}
                                />
                            </div>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default UIEvent1;

