import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';

const TestSendInvitationForm = () => {
    const [eventId, setEventId] = useState('');
    const [loading, setLoading] = useState(false);
    const [log, setLog] = useState('');

    /* const appendLog = (msg) => {
         setLog(prev => prev + `\n${msg}`);
     };*/

    const handleTestInvite = async () => {
        setLoading(true);
        setLog('🟡 Starting test...\n');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLog(prev => prev + '❌ No token found. Please login first.\n🏁 Test finished.');
                return;
            }

            setLog(prev => prev + '🔑 Token found in localStorage.\n');

            // ✅ Fetch user info
            const userRes = await axios.get('http://localhost:5000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("✅ userRes.data:", userRes.data);
            const name = userRes.data.name;
            const email = userRes.data.email;

            if (!email) {
                setLog(prev => prev + '❌ Logged-in user has no email.\n🏁 Test finished.');
                return;
            }

            setLog(prev => prev + `👤 Logged-in as: ${name} (${email})\n`);
            setLog(prev => prev + `👤 User ID: ${userRes.data._id}\n`);

            // ✅ Create guest or get existing guest
            let guestId;
            try {
                const guestRes = await axios.post('http://localhost:5000/api/guests', {
                    name,
                    email,
                    mobile: "9999999999",
                    eventId
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                guestId = guestRes.data?._id || guestRes.data?.guest?._id;
                setLog(prev => prev + `✅ Guest created with ID: ${guestId}\n`);
            } catch (err) {
                if (err.response?.data?.message?.includes('already exists')) {
                    // Guest already exists, try to find them
                    setLog(prev => prev + `⚠️ Guest already exists, trying to find existing guest...\n`);
                    try {
                        const existingGuestRes = await axios.get(`http://localhost:5000/api/guests?eventId=${eventId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const existingGuest = existingGuestRes.data.find(g => g.email === email);
                        if (existingGuest) {
                            guestId = existingGuest._id;
                            setLog(prev => prev + `✅ Found existing guest with ID: ${guestId}\n`);
                        } else {
                            throw new Error('Could not find existing guest');
                        }
                    } catch (findErr) {
                        setLog(prev => prev + `❌ Could not find existing guest: ${findErr.message}\n🏁 Test finished.`);
                        return;
                    }
                } else {
                    setLog(prev => prev + `❌ Error creating guest: ${err.response?.data?.message || err.message}\n🏁 Test finished.`);
                    return;
                }
            }

            // ✅ Create invitation directly in database (simulating invitation from another user)
            const invitationCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const testInvitation = {
                eventId,
                guestId,
                invitationCode,
                status: "pending",
                sender: "507f1f77bcf86cd799439011", // Fake user ID (different from current user)
                email: email
            };

            // ✅ Insert invitation directly into database
            setLog(prev => prev + `📩 Attempting to create test invitation...\n`);
            setLog(prev => prev + `📩 Test invitation data: ${JSON.stringify(testInvitation)}\n`);

            // ✅ Test if the route exists
            try {
                const testRouteRes = await axios.get('http://localhost:5000/api/invitations/test', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLog(prev => prev + `✅ Test route works: ${testRouteRes.data}\n`);
            } catch (testRouteErr) {
                setLog(prev => prev + `❌ Test route failed: ${testRouteErr.message}\n`);
            }

            try {
                const createRes = await axios.post('http://localhost:5000/api/invitations/create-test', testInvitation, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setLog(prev => prev + `📩 Test invitation created: ${invitationCode}\n`);
                setLog(prev => prev + `📩 Sender ID: 507f1f77bcf86cd799439011 (fake user)\n`);
                setLog(prev => prev + `📩 Current user ID: ${userRes.data._id}\n`);
                setLog(prev => prev + `📩 Database response: ${JSON.stringify(createRes.data)}\n`);
            } catch (createErr) {
                setLog(prev => prev + `❌ Error creating test invitation: ${createErr.message}\n`);
                setLog(prev => prev + `❌ Error response: ${JSON.stringify(createErr.response?.data)}\n`);
                setLog(prev => prev + `❌ Error status: ${createErr.response?.status}\n`);
                setLog(prev => prev + `🏁 Test finished with error.\n`);
                return;
            }

            // ✅ Check if there's already an invitation for this guest and delete it
            try {
                const existingInviteRes = await axios.get(`http://localhost:5000/api/invitations/received`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const existingInvite = existingInviteRes.data.find(inv => inv.guestId?._id === guestId);
                if (existingInvite) {
                    setLog(prev => prev + `⚠️ Found existing invitation, will create new test invitation...\n`);
                }
            } catch (err) {
                setLog(prev => prev + `⚠️ Could not check existing invitations: ${err.message}\n`);
            }

            // ✅ Check if invitation appears in received invitations
            setLog(prev => prev + `⏳ Waiting 2 seconds for database to update...\n`);
            await new Promise(resolve => setTimeout(resolve, 2000));

            const receivedRes = await axios.get('http://localhost:5000/api/invitations/received', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setLog(prev => prev + `📨 Received invitations count: ${receivedRes.data.length}\n`);
            setLog(prev => prev + `📨 Received invitations: ${JSON.stringify(receivedRes.data, null, 2)}\n`);

            // ✅ Debug: Check all invitations in database
            try {
                const debugRes = await axios.get('http://localhost:5000/api/invitations/debug', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLog(prev => prev + `🔍 Debug - All invitations in DB: ${debugRes.data.count}\n`);
                setLog(prev => prev + `🔍 Debug - User email: ${debugRes.data.userEmail}\n`);
                setLog(prev => prev + `🔍 Debug - User ID: ${debugRes.data.userId}\n`);
            } catch (debugErr) {
                setLog(prev => prev + `❌ Debug error: ${debugErr.message}\n`);
            }

            setLog(prev => prev + `🔄 Please click the refresh button on the Invitations Received page to see the new invitation!\n🏁 Test finished.`);

        } catch (err) {
            console.error("❌ Error:", err);
            setLog(prev => prev + `❌ ${err.response?.data?.message || err.message}\n🏁 Test finished.`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Box sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                🚀 Test Send Invitation to Current User
            </Typography>

            <TextField
                fullWidth
                label="Event ID"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                margin="normal"
                disabled={loading}
            />

            <Button
                variant="contained"
                fullWidth
                onClick={handleTestInvite}
                disabled={loading || !eventId.trim()}
            >
                {loading ? <CircularProgress size={24} /> : "Send Test Invitation"}
            </Button>

            <Box mt={2} sx={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: '#1e293b' }}>
                {log}
            </Box>
        </Box>
    );
};

export default TestSendInvitationForm;
