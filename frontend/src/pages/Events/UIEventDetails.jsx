import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Divider, Chip, TextField, Grid, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton, Stack, Dialog,
    DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert, InputAdornment
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import SearchIcon from '@mui/icons-material/Search';
import { useParams, useNavigate } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

import {
    fetchEventById,
    fetchEventGuests,
    addGuest,
    addToContactList,
    deleteGuestById,
    sendBulkInvitations,
    generateInvitationLink,
    fetchUniversalContacts
} from '../../api/eventDetailsApi';

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
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [inviteGuestForm, setInviteGuestForm] = useState({ name: '', email: '', mobile: '' });
    const [universalContactsDialog, setUniversalContactsDialog] = useState(false);
    const [universalContacts, setUniversalContacts] = useState([]);
    const [searchUniversal, setSearchUniversal] = useState('');
    const [whatsAppLink, setWhatsAppLink] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchEventAndContacts = async () => {
            try {
                const eventData = await fetchEventById(eventId);
                setEvent(eventData);
            } catch (err) {
                console.error("Error fetching event:", err);
            }
            fetchContacts();
        };

        fetchEventAndContacts();
        const interval = setInterval(fetchContacts, 5000);
        return () => clearInterval(interval);
    }, [eventId, navigate]);

    const fetchContacts = async () => {
        try {
            const data = await fetchEventGuests(eventId);
            setContacts(data);
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
            await addGuest({ ...form, eventId });
            await addToContactList({ name, email, mobile });
            setSuccessMessage(`${name} added to event and your contact list.`);
            setForm({ name: '', email: '', mobile: '' });
        } catch (err) {
            console.error('Error adding contact:', err);
            setErrorMessage("Failed to save contact.");
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
            await deleteGuestById(deleteId);
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
            const links = await sendBulkInvitations(eventId);
            await navigator.clipboard.writeText(links.join('\n'));
            setSuccessMessage("Invitations sent & links copied to clipboard!");
        } catch (err) {
            console.error("Invitation error:", err);
            setErrorMessage("Failed to send invitations.");
        }
    };

    const sendWhatsAppMessage = async (contact) => {
        try {
            const inviteCode = await generateInvitationLink(contact._id, eventId);
            const displayUrl = `http://localhost:5173/invite/${inviteCode}`;
            const msg = encodeURIComponent(`Hi ${contact.name}, you're invited to ${event.eventTitle}! Join here: ${displayUrl}`);
            const phone = contact.mobile.replace(/[^0-9]/g, '');
            const link = `https://wa.me/${phone}?text=${msg}`;
            window.open(link, '_blank');
            setWhatsAppLink(displayUrl);
        } catch (err) {
            console.error("WhatsApp invite failed:", err);
        }
    };

    const sendEmailInvite = async (contact) => {
        try {
            const inviteCode = await generateInvitationLink(contact._id, eventId);
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
            const guest = await addGuest({ ...inviteGuestForm, eventId });
            await generateInvitationLink(guest._id, eventId);
            setSuccessMessage('Invitation sent successfully!');
            setInviteGuestForm({ name: '', email: '', mobile: '' });
            setTimeout(() => setShowInviteForm(false), 2000);
        } catch (err) {
            console.error('Error:', err);
            setErrorMessage('Failed to send invitation.');
        }
    };

    const loadUniversalContacts = async (query = '') => {
        try {
            const data = await fetchUniversalContacts(query);
            setUniversalContacts(data);
        } catch (err) {
            console.error("Failed to load universal contacts:", err);
        }
    };

    const handleAddFromUniversal = async (contact) => {
        try {
            await addGuest({ name: contact.name, email: contact.email, mobile: contact.mobile, eventId });
            setSuccessMessage(`${contact.name} added to event.`);
            setUniversalContactsDialog(false);
        } catch (err) {
            console.error("Error adding from universal:", err);
            setErrorMessage("Failed to add contact from universal list.");
        }
    };

    if (!event || !event.eventTitle) {
        return <Typography variant="h6">Loading event data...</Typography>;
    }

    return (
        <Box sx={{ p: { xs: 2, sm: 4, md: 6 }, maxWidth: 1000, mx: 'auto' }}>
            <Paper elevation={6} sx={{ p: { xs: 3, sm: 4 }, mb: 5, borderRadius: 4, backgroundColor: '#fefefe' }}>
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
                            🎉 {event.eventTitle}
                        </Typography>
                        <Divider />
                    </Box>

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
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                {event.eventDescription}
                            </Typography>
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
                                🎁 {event.splitPercentage?.gift || 0}% &nbsp;| ❤️ {event.splitPercentage?.charity || 0}%
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">📌 Status</Typography>
                            <Chip label={event.status?.toUpperCase()} color="primary" variant="filled" />
                        </Grid>
                    </Grid>

                    {event.charity?.name && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Box>
                                <Typography variant="h6" color="secondary" gutterBottom>💖 Charity Information</Typography>
                                <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                                <Typography variant="body1">{event.charity.name}</Typography>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Description</Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{event.charity.description}</Typography>
                            </Box>
                        </>
                    )}
                </Stack>
            </Paper>


            {/* --- Contacts & Invitations Section --- */}
            <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h5" gutterBottom>📇 Manage Invitations</Typography>

                {/* --- Action Buttons --- */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4}>
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

                {/* --- One-Invite Form --- */}
                {showInviteForm && (
                    <Box sx={{ mb: 4, p: 3, backgroundColor: '#f9f9f9', borderRadius: 3, border: '1px solid #ccc' }}>
                        <Typography variant="h6" gutterBottom>Send One Invitation</Typography>
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

                {/* --- Guest List Table --- */}
                <Typography variant="h6" sx={{ mb: 2 }}>🎟️ Guest List</Typography>
                <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 3 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Mobile</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell align="center"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contacts.map(contact => (
                                <TableRow key={contact._id} hover>
                                    <TableCell>{contact.name}</TableCell>
                                    <TableCell>{contact.email}</TableCell>
                                    <TableCell>{contact.mobile}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={contact.status || "Pending"}
                                            color={
                                                contact.status === 'Accepted'
                                                    ? 'success'
                                                    : contact.status === 'Declined'
                                                        ? 'error'
                                                        : 'warning'
                                            }
                                            variant="outlined"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <IconButton color="success" onClick={() => sendWhatsAppMessage(contact)}>
                                                <WhatsAppIcon />
                                            </IconButton>
                                            <IconButton color="primary" onClick={() => sendEmailInvite(contact)}>
                                                <EmailIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => confirmDelete(contact._id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {contacts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No contacts found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* --- Add New Contact Manually --- */}
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>➕ Add New Contact</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                    <TextField name="name" value={form.name} onChange={handleChange} label="Name" fullWidth />
                    <TextField name="email" value={form.email} onChange={handleChange} label="Email" fullWidth />
                    <TextField name="mobile" value={form.mobile} onChange={handleChange} label="Mobile" fullWidth />
                </Stack>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleAdd}
                    disabled={loading}
                >
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
