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
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const UIEventDetails1 = () => {
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
            await axios.post('http://localhost:5000/api/guests', { ...form, eventId }, getAuthHeaders());
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

    const sendWhatsAppMessage = async (contact) => {
        try {
            const res = await axios.post(`http://localhost:5000/invitations/autolink`, {
                guestId: contact._id,
                eventId
            }, getAuthHeaders());
            const inviteCode = res.data?.invitationCode || contact._id.slice(-6);
            const msg = encodeURIComponent(`Hi ${contact.name}, you're invited to ${event.eventTitle}! Join here: http://localhost:5173/invite/${inviteCode}`);
            const phone = contact.mobile.replace(/[^0-9]/g, '');
            window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
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

    return (
        <Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Mobile</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.map(contact => (
                            <TableRow key={contact._id}>
                                <TableCell>{contact.name}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.mobile}</TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <IconButton color="primary" onClick={() => sendWhatsAppMessage(contact)}>
                                            <WhatsAppIcon />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => sendEmailInvite(contact)}>
                                            <EmailIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => confirmDelete(contact._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6">Add Contact</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} my={2}>
                    <TextField name="name" value={form.name} onChange={handleChange} label="Name" fullWidth />
                    <TextField name="email" value={form.email} onChange={handleChange} label="Email" fullWidth />
                    <TextField name="mobile" value={form.mobile} onChange={handleChange} label="Mobile" fullWidth />
                </Stack>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleAdd} disabled={loading}>
                    Save Contact
                </Button>
            </Box>

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

            <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="success" onClose={() => setSuccessMessage('')}>{successMessage}</Alert>
            </Snackbar>

            <Snackbar open={!!errorMessage} autoHideDuration={3000} onClose={() => setErrorMessage('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="error" onClose={() => setErrorMessage('')}>{errorMessage}</Alert>
            </Snackbar>
        </Box>
    );
};

export default UIEventDetails1;
