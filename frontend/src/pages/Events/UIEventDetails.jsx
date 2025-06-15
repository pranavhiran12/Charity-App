import React, { useEffect, useState, useRef } from 'react';
import {
    Box, Typography, Paper, Divider, Chip, TextField, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton, Stack, Dialog,
    DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert, InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import SearchIcon from '@mui/icons-material/Search';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

const UIEventDetails = () => {
    const { id: eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
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

    const [universalContactsDialog, setUniversalContactsDialog] = useState(false);
    const [universalContacts, setUniversalContacts] = useState([]);
    const [searchUniversal, setSearchUniversal] = useState('');

    const [whatsAppLink, setWhatsAppLink] = useState('');


    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await axios.get(`http://localhost:5000/api/events/${eventId}`, getAuthHeaders());
                setEvent(res.data);
            } catch (err) {
                console.error("Error fetching event:", err);
            }

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
                console.warn('Socket connection failed, fallback to manual fetch.');
                fetchContacts(token);
            });

            return () => {
                socket.emit('leaveEventRoom', eventId);
                socket.disconnect();
            };
        };

        fetchData();
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
            // 1. Add contact to event
            await axios.post('http://localhost:5000/api/guests', { ...form, eventId }, getAuthHeaders());

            // 2. Add to universal contact list
            await axios.post('http://localhost:5000/api/contacts', { name, email, mobile }, getAuthHeaders());

            setSuccessMessage(`${name} added to event and your contact list.`);
            setForm({ name: '', email: '', mobile: '' });
        } catch (err) {
            if (err.response?.status === 400) {
                alert("This contact already exists.");
            } else {
                console.error('Error adding contact:', err);
                setErrorMessage("Failed to save contact.");
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
            await axios.delete(`http://localhost:5000/api/guests/${deleteId}`, getAuthHeaders());
            setContacts(prev => prev.filter(contact => contact._id !== deleteId));
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

            await navigator.clipboard.writeText(links.join('\n'));
            setSuccessMessage("Invitations sent & links copied to clipboard!");
        } catch (err) {
            console.error("Invitation error:", err?.response?.data || err.message);
            setErrorMessage("Failed to send invitations.");
        }
    };

    const sendWhatsAppMessage = async (contact) => {
        try {
            const res = await axios.post(`http://localhost:5000/invitations/autolink`, {
                guestId: contact._id,
                eventId
            }, getAuthHeaders());

            const inviteCode = res.data?.invitationCode || contact._id.slice(-6);

            // What is shown in WhatsApp message (for display only)
            const displayUrl = `http://localhost:5173/invite/${inviteCode}`;
            // What actually works on mobile (local IP)
            const actualUrl = `http://192.168.1.7:5173/invite/${inviteCode}`;

            const msg = encodeURIComponent(
                `Hi ${contact.name}, you're invited to ${event.eventTitle}! Join here: ${displayUrl}`
            );

            const phone = contact.mobile.replace(/[^0-9]/g, '');
            const link = `https://wa.me/${phone}?text=${msg}`;

            // Open actual working link in new tab
            window.open(link, '_blank');

            // Show the actual working link in Snackbar
            setWhatsAppLink(displayUrl);
        } catch (err) {
            console.error("WhatsApp invite failed:", err);
        }
    };



    const sendEmailInvite = async (contact) => {
        try {
            const res = await axios.post(`http://localhost:5000/invitations/autolink`, {
                guestId: contact._id,
                eventId
            }, getAuthHeaders());
            const inviteCode = res.data?.invitationCode || contact._id.slice(-6);
            const subject = encodeURIComponent(`You're Invited to ${event.eventTitle}`);
            const body = encodeURIComponent(`Hi ${contact.name},\n\nYou're invited to ${event.eventTitle}! Click the link to view: http://localhost:5173/invite/${inviteCode}`);
            window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
        } catch (err) {
            console.error("Email invite failed:", err);
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

    const fetchUniversalContacts = async (query = '') => {
        try {
            const res = await axios.get(`http://localhost:5000/api/contacts?q=${query}`, getAuthHeaders());
            setUniversalContacts(Array.isArray(res.data.contacts) ? res.data.contacts : res.data);
        } catch (err) {
            console.error("Failed to load universal contacts:", err);
        }
    };

    const handleAddFromUniversal = async (contact) => {
        try {
            await axios.post('http://localhost:5000/api/guests', {
                name: contact.name,
                email: contact.email,
                mobile: contact.mobile,
                eventId
            }, getAuthHeaders());

            setSuccessMessage(`${contact.name} added to event.`);
            setUniversalContactsDialog(false);
        } catch (err) {
            console.error("Error adding from universal:", err?.response?.data || err.message);
            setErrorMessage("Failed to add contact from universal list.");
        }
    };

    if (!event) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ p: { xs: 2, sm: 4, md: 6 }, maxWidth: 1000, mx: 'auto' }}>
            <Paper elevation={4} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>{event.eventTitle}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography><strong>Child Name:</strong> {event.childName}</Typography>
                <Typography><strong>Description:</strong> {event.eventDescription}</Typography>
                <Typography><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</Typography>
                <Typography><strong>Time:</strong> {event.time}</Typography>
                <Typography><strong>Venue:</strong> {event.venue}</Typography>
                <Typography><strong>Gift:</strong> {event.giftName}</Typography>
                <Typography><strong>Target Amount:</strong> ₹{event.totalTargetAmount}</Typography>
                <Typography><strong>Split:</strong> 🎁 {event.splitPercentage?.gift || 0}% &nbsp;| ❤️ {event.splitPercentage?.charity || 0}%</Typography>
                <Box sx={{ mt: 2 }}>
                    <Chip label={event.status.toUpperCase()} color="primary" />
                </Box>
                {event.charity?.name && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6">Charity Information</Typography>
                        <Typography><strong>Name:</strong> {event.charity.name}</Typography>
                        <Typography sx={{ whiteSpace: 'pre-line' }}><strong>Description:</strong> {event.charity.description}</Typography>
                    </>
                )}
            </Paper>

            {/* --- Contacts & Invitations Section --- */}
            <Paper elevation={6} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>📇 Manage Invitations</Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                    <Button variant="contained" color="success" onClick={handleInvite} fullWidth>
                        📤 Send Bulk Invitations
                    </Button>
                    <Button variant="outlined" color="info" onClick={() => setShowInviteForm(prev => !prev)} fullWidth>
                        ✉️ Send Single Invitation
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => {
                        fetchUniversalContacts();
                        setUniversalContactsDialog(true);
                    }} fullWidth startIcon={<PersonAddAltIcon />}>
                        Add from Contact List
                    </Button>
                </Stack>

                {showInviteForm && (
                    <Box sx={{ mb: 3, p: 3, backgroundColor: '#f0f4ff', borderRadius: 3 }}>
                        <Typography variant="h6">Send One Invitation</Typography>
                        <Stack spacing={2}>
                            <TextField name="name" label="Name" value={inviteGuestForm.name} onChange={handleInviteInputChange} fullWidth />
                            <TextField name="email" label="Email" value={inviteGuestForm.email} onChange={handleInviteInputChange} fullWidth />
                            <TextField name="mobile" label="Mobile" value={inviteGuestForm.mobile} onChange={handleInviteInputChange} fullWidth />
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button variant="contained" onClick={submitInviteGuest}>Send</Button>
                                <Button variant="outlined" onClick={() => setShowInviteForm(false)}>Cancel</Button>
                            </Stack>
                        </Stack>
                    </Box>
                )}



                <TableContainer component={Paper} sx={{ mb: 4 }}>
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
                                <TableRow key={contact._id}>
                                    <TableCell>{contact.name}</TableCell>
                                    <TableCell>{contact.email}</TableCell>
                                    <TableCell>{contact.mobile}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="success" onClick={() => sendWhatsAppMessage(contact)}>
                                            <WhatsAppIcon />

                                        </IconButton>
                                        <IconButton color="primary" onClick={() => sendEmailInvite(contact)}>
                                            <EmailIcon />
                                        </IconButton>

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


                <Typography variant="h6" gutterBottom>➕ Add Contact</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
                    <TextField name="name" value={form.name} onChange={handleChange} label="Name" fullWidth />
                    <TextField name="email" value={form.email} onChange={handleChange} label="Email" fullWidth />
                    <TextField name="mobile" value={form.mobile} onChange={handleChange} label="Mobile" fullWidth />
                </Stack>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleAdd} disabled={loading}>
                    Save Contact
                </Button>
            </Paper>

            {/* Dialogs & Snackbar */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this contact?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirmed} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Universal Contacts Dialog */}
            <Dialog open={universalContactsDialog} onClose={() => setUniversalContactsDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Select from Your Universal Contacts</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search contacts..."
                        value={searchUniversal}
                        onChange={(e) => {
                            setSearchUniversal(e.target.value);
                            fetchUniversalContacts(e.target.value);
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            )
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Mobile</TableCell>
                                    <TableCell align="center">Add</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {universalContacts.map(contact => (
                                    <TableRow key={contact._id}>
                                        <TableCell>{contact.name}</TableCell>
                                        <TableCell>{contact.email}</TableCell>
                                        <TableCell>{contact.mobile}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleAddFromUniversal(contact)}
                                            >
                                                Add
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {universalContacts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">No contacts found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUniversalContactsDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="success" onClose={() => setSuccessMessage('')}>{successMessage}</Alert>
            </Snackbar>

            <Snackbar open={!!errorMessage} autoHideDuration={3000} onClose={() => setErrorMessage('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="error" onClose={() => setErrorMessage('')}>{errorMessage}</Alert>
            </Snackbar>

            <Snackbar
                open={!!whatsAppLink}
                autoHideDuration={6000}
                onClose={() => setWhatsAppLink('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="info" onClose={() => setWhatsAppLink('')}>
                    WhatsApp link:&nbsp;
                    <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                        {whatsAppLink}
                    </a>
                </Alert>
            </Snackbar>





        </Box>





    );
};

export default UIEventDetails;
