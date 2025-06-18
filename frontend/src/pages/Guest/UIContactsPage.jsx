import React, { useEffect, useState, useRef } from 'react';
import {
    Box, Typography, TextField, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton, Stack, Dialog,
    DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert,
    Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const UIContactsPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', mobile: '' });
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const socketRef = useRef(null);
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [inviteGuestForm, setInviteGuestForm] = useState({ name: '', email: '', mobile: '' });

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        if (!eventId) return;

        fetchContacts(token);

        socketRef.current = io('http://localhost:5000', {
            auth: { token },
            transports: ['websocket']
        });

        const socket = socketRef.current;

        socket.emit('joinEventRoom', eventId);

        socket.on('guestListUpdated', updatedList => {
            setContacts(updatedList);
            setForm({ name: '', email: '', mobile: '' });
        });

        socket.on('connect_error', () => {
            console.warn('Socket connection failed, falling back to manual fetch.');
            fetchContacts(token);
        });

        return () => {
            socket.emit('leaveEventRoom', eventId);
            socket.disconnect();
        };
    }, [eventId, navigate]);

    const fetchContacts = async (token = localStorage.getItem('token')) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/guests?eventId=${eventId}`, getAuthHeaders());
            setContacts(res.data);
        } catch (err) {
            console.error('Error fetching contacts:', err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAdd = async () => {
        const { name, email, mobile } = form;
        if (!name.trim() || !email.trim() || !mobile.trim()) {
            alert("All fields are required.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                'http://localhost:5000/api/guests',
                { ...form, eventId },
                getAuthHeaders()
            );

            setContacts(res.data); // 👈 Use updated guest list from server
            setForm({ name: '', email: '', mobile: '' }); // Reset form
        } catch (err) {
            if (err.response?.status === 400) {
                alert("This contact already exists for this event.");
            } else {
                console.error('Error adding contact:', err);
            }
        } finally {
            setLoading(false);
        }
    };


    const confirmDelete = (id) => {
        setDeleteId(id);
        setOpenDialog(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            const res = await axios.delete(
                `http://localhost:5000/api/guests/${deleteId}`,
                getAuthHeaders()
            );

            setContacts(res.data); // ✅ Set updated guest list from server
        } catch (err) {
            console.error('Error deleting contact:', err);
        } finally {
            setOpenDialog(false);
            setDeleteId(null);
        }
    };


    const handleInvite = async () => {
        try {
            const res = await axios.post(`http://localhost:5000/invitations/send/${eventId}`, {}, getAuthHeaders());
            const baseUrl = "http://localhost:5173/invite";
            const links = res.data.map(invite => `${baseUrl}/${invite.invitationCode}`);

            if (!links.length) {
                setErrorMessage("No invitation links generated.");
                return;
            }

            console.log("Invitation Links:", links); // ✅ Debug Output

            try {
                await navigator.clipboard.writeText(links.join('\n'));
                setSuccessMessage("Invitations sent & links copied to clipboard!");
            } catch (clipboardErr) {
                console.error("Clipboard write failed:", clipboardErr);
                setSuccessMessage("Invitations sent, but failed to copy to clipboard.");
            }
        } catch (err) {
            console.error("Invitation error:", err.response?.data || err.message);
            setErrorMessage("Failed to send invitations.");
        }
    };


    const handleInviteInputChange = (e) => {
        const { name, value } = e.target;
        setInviteGuestForm(prev => ({ ...prev, [name]: value }));
    };

    const submitInviteGuest = async () => {
        try {
            const guestRes = await axios.post('http://localhost:5000/api/guests', {
                ...inviteGuestForm,
                eventId
            }, getAuthHeaders());

            const guestId = guestRes.data._id;

            await axios.post('http://localhost:5000/invitations/autolink', {
                guestId,
                eventId
            }, getAuthHeaders());

            setSuccessMessage('Invitation sent successfully!');
            setInviteGuestForm({ name: '', email: '', mobile: '' });
            setTimeout(() => setShowInviteForm(false), 2000);
        } catch (err) {
            console.error('Error:', err?.response?.data || err.message);
            setErrorMessage('Failed to send invitation.');
        }
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 4, md: 6 }, maxWidth: 1000, mx: 'auto' }}>
            <Paper elevation={6} sx={{ p: 5, borderRadius: 4, backgroundColor: '#ffffff' }}>
                <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
                    📇 Contacts for Event #{eventId}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                    <Button variant="contained" color="success" fullWidth onClick={handleInvite}>
                        📤 Send Bulk Invitations
                    </Button>
                    <Button variant="outlined" color="info" fullWidth onClick={() => setShowInviteForm(prev => !prev)}>
                        ✉️ Send Single Invitation
                    </Button>
                </Stack>

                {showInviteForm && (
                    <Box sx={{ mt: 2, mb: 4, p: 3, backgroundColor: '#f0f4ff', borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Send Invitation to One Guest
                        </Typography>
                        <Stack spacing={2}>
                            <TextField name="name" label="Guest Name" value={inviteGuestForm.name} onChange={handleInviteInputChange} fullWidth />
                            <TextField name="email" label="Guest Email" value={inviteGuestForm.email} onChange={handleInviteInputChange} fullWidth />
                            <TextField name="mobile" label="Mobile Number" value={inviteGuestForm.mobile} onChange={handleInviteInputChange} fullWidth />
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button variant="contained" color="primary" onClick={submitInviteGuest}>Send</Button>
                                <Button variant="outlined" onClick={() => setShowInviteForm(false)}>Cancel</Button>
                            </Stack>
                        </Stack>
                    </Box>
                )}

                <TableContainer component={Paper} sx={{ borderRadius: 3, mb: 4, boxShadow: 3 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Mobile</strong></TableCell>
                                <TableCell align="center"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contacts.map(contact => (
                                <TableRow key={contact._id} hover>
                                    <TableCell>{contact.name}</TableCell>
                                    <TableCell>{contact.email}</TableCell>
                                    <TableCell>{contact.mobile}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="error" onClick={() => confirmDelete(contact._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {contacts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No contacts found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h6" fontWeight={600} gutterBottom>
                    ➕ Add New Contact
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                    <TextField name="name" value={form.name} onChange={handleChange} label="Name" fullWidth />
                    <TextField name="email" value={form.email} onChange={handleChange} label="Email" fullWidth />
                    <TextField name="mobile" value={form.mobile} onChange={handleChange} label="Mobile" fullWidth />
                </Stack>
                <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleAdd} disabled={loading}>
                    Save Contact
                </Button>
            </Paper>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this contact?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirmed} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="success" onClose={() => setSuccessMessage('')}>
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={!!errorMessage} autoHideDuration={3000} onClose={() => setErrorMessage('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="error" onClose={() => setErrorMessage('')}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UIContactsPage;
