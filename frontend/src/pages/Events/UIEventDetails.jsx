import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Box, Typography, Paper, Divider, Chip
} from '@mui/material';

const UIEventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvent(res.data);
            } catch (err) {
                console.error("Error fetching event:", err);
            }
        };
        fetchEvent();
    }, [id]);

    if (!event) return <Typography>Loading...</Typography>;

    return (
        <Paper elevation={3} sx={{ p: 4, m: 3 }}>
            <Typography variant="h4" gutterBottom>{event.eventTitle}</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography><strong>Child Name:</strong> {event.childName}</Typography>
            <Typography><strong>Description:</strong> {event.eventDescription}</Typography>
            <Typography><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</Typography>
            <Typography><strong>Time:</strong> {event.time}</Typography>
            <Typography><strong>Venue:</strong> {event.venue}</Typography>
            <Typography><strong>Gift:</strong> {event.giftName}</Typography>
            <Typography><strong>Target Amount:</strong> ₹{event.totalTargetAmount}</Typography>
            <Typography><strong>Split:</strong> 🎁 {event.splitPercentage.gift}% &nbsp;| ❤️ {event.splitPercentage.charity}%</Typography>

            <Box sx={{ mt: 2 }}>
                <Chip label={event.status.toUpperCase()} color="primary" />
            </Box>

            {event.charity?.name && (
                <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6">Charity Information</Typography>
                    <Typography><strong>Name:</strong> {event.charity.name}</Typography>
                    <Typography><strong>Description:</strong> {event.charity.description}</Typography>
                </>
            )}
        </Paper>
    );
};

export default UIEventDetails;
