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

            // ✅ Create guest
            const guestRes = await axios.post('http://localhost:5000/api/guests', {
                name,
                email,
                mobile: "9999999999",
                eventId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const guestId = guestRes.data?.guest?._id;
            setLog(prev => prev + `✅ Guest created with ID: ${guestId}\n`);

            // ✅ Send invitation
            const inviteRes = await axios.post(`http://localhost:5000/api/invitations/send/${eventId}`, {
                guests: [guestId]
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setLog(prev => prev + `📩 Invitation sent: ${inviteRes.data.message || 'Success'}\n🏁 Test finished.`);

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
