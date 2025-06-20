// src/pages/Invite.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Button, Typography, Paper, CircularProgress, Divider,
    Grid, Chip, Stack, TextField
} from '@mui/material';

import {
    fetchInvitationByCode,
    respondToInvitation,
    addToContactList,
    addGuest,
    updateInvitationWithGuest
} from '../../api/eventDetailsApi';

const Invite = () => {
    const { invitationCode } = useParams();
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', email: '', mobile: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const loadInvitation = async () => {
            try {
                const data = await fetchInvitationByCode(invitationCode);
                setInvitation(data);
            } catch (err) {
                console.error(err);
                setError('Invitation not found.');
            } finally {
                setLoading(false);
            }
        };
        loadInvitation();
    }, [invitationCode]);

    const handlePublicRegistration = async () => {
        try {
            if (!form.name || !form.email || !form.mobile) {
                setError('All fields are required');
                return;
            }

            const cleanedName = form.name.trim();
            const cleanedEmail = form.email.trim().toLowerCase();
            const cleanedMobile = form.mobile.trim();

            // Step 1: Save to Universal Contact List
            await addToContactList({
                name: cleanedName,
                email: cleanedEmail,
                mobile: cleanedMobile,
            });

            // Step 2: Add guest to this event (returns guest object now)
            const response = await addGuest({
                name: cleanedName,
                email: cleanedEmail,
                mobile: cleanedMobile,
                eventId: invitation.eventId._id
            });

            console.log("🧾 addGuest response from backend:", response); // <== add this
            const newGuest = response.guest;

            if (!newGuest || !newGuest._id) {
                setError('Guest could not be verified after creation.');
                return;
            }

            // Step 3: Update invitation with guestId
            await updateInvitationWithGuest(invitationCode, newGuest._id);

            // Step 4: Update invitation state and reset form
            setInvitation(prev => ({
                ...prev,
                guestId: newGuest,
            }));

            setForm({ name: '', email: '', mobile: '' });
            setError('');

        } catch (err) {
            console.error('❌ Registration failed:', err.response?.data || err.message || err);
            setError(err.response?.data?.message || 'Failed to register. Try again.');
        }
    };




    const handleResponse = async (status) => {
        try {
            const updated = await respondToInvitation(invitationCode, status);
            alert(`You have ${status === 'accepted' ? 'accepted' : 'declined'} the invitation.`);
            setInvitation(updated);
            navigate(`/dashboard2/event/${updated.eventId._id}`);
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

                    {invitation && !invitation.guestId ? (
                        <Box mt={3}>
                            <Typography variant="h6">Please enter your details to accept the invitation:</Typography>
                            <TextField
                                fullWidth
                                label="Full Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                sx={{ my: 1 }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                sx={{ my: 1 }}
                            />
                            <TextField
                                fullWidth
                                label="Mobile Number"
                                value={form.mobile}
                                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                                sx={{ my: 1 }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handlePublicRegistration}
                            >
                                Register & Continue
                            </Button>
                            {error && (
                                <Typography color="error" mt={1}>{error}</Typography>
                            )}
                        </Box>
                    ) : (
                        <Box textAlign="center">
                            <Typography variant="subtitle1" fontWeight={500}>
                                👤 Guest: {invitation.guestId?.name}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                                Hosted by: {event.host.name}
                            </Typography>

                            <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleResponse('accepted')}
                                >
                                    ✅ Accept
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleResponse('declined')}
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
                    )}
                </Stack>
            </Paper>
        </Box>
    );
};

export default Invite;
