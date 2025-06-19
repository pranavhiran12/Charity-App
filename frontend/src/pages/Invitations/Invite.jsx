// src/pages/Invite.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
    Box,
    Button,
    Typography,
    Paper,
    CircularProgress,
    Divider,
    Grid,
    Chip,
    Stack,
} from '@mui/material';

const Invite = () => {
    const { invitationCode } = useParams();
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvitation = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/invitations/${invitationCode}`);
                setInvitation(res.data);
            } catch (err) {
                console.error(err);
                setError('Invitation not found.');
            } finally {
                setLoading(false);
            }
        };
        fetchInvitation();
    }, [invitationCode]);

    const respondToInvitation = async (response) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/invitations/${invitationCode}/respond`, {
                status: response
            });

            alert(`You have ${response === 'accepted' ? 'accepted' : 'declined'} the invitation.`);
            setInvitation(res.data.invitation); // ✅ Use updated invitation object
            navigate(`/dashboard2/event/${invitation.eventId._id}`);
        } catch (err) {
            console.error(err);
            alert('Error submitting RSVP.');
            navigate('/dashboard2');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" p={4}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    const event = invitation.eventId;

    return (
        <Box maxWidth="md" mx="auto" p={{ xs: 2, sm: 4 }}>
            <Paper elevation={6} sx={{ borderRadius: 4, p: { xs: 3, sm: 4 }, backgroundColor: '#fafafa' }}>
                <Stack spacing={3}>
                    <Typography variant="h4" color="primary" fontWeight={700}>
                        🎉 You're Invited to {event.eventTitle}
                    </Typography>

                    <Divider />

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">👶 Child Name</Typography>
                            <Typography variant="body1">{event.childName}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">📅 Date</Typography>
                            <Typography variant="body1">{new Date(event.eventDate).toLocaleDateString()}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">⏰ Time</Typography>
                            <Typography variant="body1">{event.time}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">📍 Venue</Typography>
                            <Typography variant="body1">{event.venue}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">📝 Description</Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{event.eventDescription}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">🎁 Gift</Typography>
                            <Typography variant="body1">{event.giftName}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">💰 Target Amount</Typography>
                            <Typography variant="body1">₹{event.totalTargetAmount}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">🔀 Split</Typography>
                            <Typography variant="body1">
                                🎁 {event.splitPercentage?.gift || 0}% | ❤️ {event.splitPercentage?.charity || 0}%
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">📌 Status</Typography>
                            <Chip label={event.status?.toUpperCase()} color="primary" />
                        </Grid>
                    </Grid>

                    {event.charity?.name && (
                        <Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" color="secondary" gutterBottom>
                                💖 Charity Information
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                            <Typography variant="body1">{event.charity.name}</Typography>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Description</Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{event.charity.description}</Typography>
                        </Box>
                    )}

                    <Divider />

                    <Box textAlign="center">
                        <Typography variant="subtitle1" fontWeight={500}>
                            👤 Guest: {invitation.guestId.name}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                            Hosted by: {event.host.name}
                        </Typography>

                        <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => respondToInvitation('accepted')}
                            >
                                ✅ Accept
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => respondToInvitation('declined')}
                            >
                                ❌ Decline
                            </Button>
                        </Stack>

                        {invitation.status && (
                            <Typography variant="body2" color="text.secondary" mt={2}>
                                You have <strong>{invitation.status}</strong> this invitation.
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
};

export default Invite;
