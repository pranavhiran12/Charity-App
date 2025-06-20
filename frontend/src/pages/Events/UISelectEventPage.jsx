// src/pages/UISelectEventPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { fetchEventsWithAuth } from '../api/eventDetailsApi'; // ✅ Adjust path if needed

const UISelectEventPage = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await fetchEventsWithAuth(); // ✅ Use the separated API call
                setEvents(data);
            } catch (err) {
                console.error('Failed to fetch events:', err);
            }
        };

        loadEvents();
    }, []);

    return (
        <Box sx={{ p: 4, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Select an Event to Manage Contacts
            </Typography>

            {events.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                    No events found.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {events.map((event) => (
                        <Grid item xs={12} sm={6} md={4} key={event._id}>
                            <Card sx={{ height: '100%' }}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={event.imageUrl || '/placeholder.jpg'}
                                    alt={event.title || 'Event'}
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {event.title || 'Untitled Event'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Date:</strong> {event.date || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Location:</strong> {event.location || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Type:</strong> {event.type || 'General'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Owner:</strong> {event.owner?.name || 'You'}
                                    </Typography>

                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        component={Link}
                                        to={`/dashboard2/contacts/${event._id}`}
                                        startIcon={<EventIcon />}
                                    >
                                        Manage Contacts
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default UISelectEventPage;
