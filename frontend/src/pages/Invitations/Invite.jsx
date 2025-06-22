// src/pages/Invite.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Button, Typography, Paper, CircularProgress, Divider,
    Grid, Chip, Stack, TextField
} from '@mui/material';
import axios from 'axios';

import {
    fetchInvitationByCode,
    respondToInvitation,
    addToContactList,
    addGuest,
    updateInvitationWithGuest
    // createRazorpayOrder
} from '../../api/eventDetailsApi';

const Invite = () => {
    const { invitationCode } = useParams();
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', email: '', mobile: '' });
    const [contribution, setContribution] = useState({ amount: '', message: '' });
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

            await addToContactList({
                name: cleanedName,
                email: cleanedEmail,
                mobile: cleanedMobile,
            });

            const response = await addGuest({
                name: cleanedName,
                email: cleanedEmail,
                mobile: cleanedMobile,
                eventId: invitation.eventId._id
            });

            const newGuest = response.guest;
            if (!newGuest || !newGuest._id) {
                setError('Guest could not be verified after creation.');
                return;
            }

            await updateInvitationWithGuest(invitationCode, newGuest._id);

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

    /* const handleContribute = () => {
         alert(`Contribution of ₹${contribution.amount} with message: "${contribution.message}" will be processed via Razorpay.`);
     };*/

    const handleContribute = async () => {
        try {
            const amount = parseInt(contribution.amount);
            if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid amount');
                return;
            }

            // 1. Create Razorpay Order
            const { data: order } = await axios.post('http://localhost:5000/api/payments/create-order', {
                amount,
                message: contribution.message,
                eventId: invitation?.eventId?._id,
                guestId: invitation?.guestId?._id
            });

            // 2. Setup Razorpay Options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: invitation?.eventId?.eventTitle || "Event",
                description: contribution.message || 'Gift Contribution',
                order_id: order.id,
                handler: async function (response) {
                    try {
                        await axios.post('http://localhost:5000/api/payments/save', {
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                            amount,
                            message: contribution.message,
                            eventId: invitation?.eventId?._id,
                            guestId: invitation?.guestId?._id
                        });

                        window.location.assign(`/thankyou?amount=${amount}`);
                    } catch (err) {
                        console.error("❌ Failed to save payment:", err);
                        alert("Payment succeeded, but we couldn't save your contribution.");
                    }
                },
                prefill: {
                    name: invitation.guestId?.name || '',
                    email: invitation.guestId?.email || '',
                    contact: invitation.guestId?.mobile || ''
                },
                theme: {
                    color: '#1976d2'
                },
                method: {
                    upi: true,
                    card: true,
                    wallet: true,
                    netbanking: true,
                    emi: true
                },
                modal: {
                    ondismiss: () => {
                        alert("Payment popup closed");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("❌ Contribution error:", err);
            alert('Failed to initiate payment.');
        }
    };


    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error && !invitation) {
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

                    {!invitation.guestId ? (
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
                        <Box mt={3}>
                            <Typography variant="h6">Contribute to this event:</Typography>
                            <TextField
                                fullWidth
                                label="Amount (₹)"
                                value={contribution.amount}
                                onChange={(e) => setContribution({ ...contribution, amount: e.target.value })}
                                sx={{ my: 1 }}
                            />
                            <TextField
                                fullWidth
                                label="Message"
                                value={contribution.message}
                                onChange={(e) => setContribution({ ...contribution, message: e.target.value })}
                                sx={{ my: 1 }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleContribute}
                            >
                                Contribute
                            </Button>
                        </Box>
                    )}

                    <Box textAlign="center">
                        <Typography variant="subtitle1" fontWeight={500}>
                            👤 Guest: {invitation.guestId?.name || 'Anonymous'}
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
                </Stack>
            </Paper>
        </Box>
    );
};

export default Invite;
