import React, { useEffect, useState, useRef } from 'react';
import {
    Box, Typography, TextField, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton, Stack, Dialog,
    DialogTitle, DialogContent, DialogContentText, DialogActions
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
    const socketRef = useRef(null);

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
            setForm({ name: '', email: '', mobile: '' }); // ✅ move reset here

        });

        return () => {
            socket.emit('leaveEventRoom', eventId);
            socket.disconnect();
        };
    }, [eventId, navigate]);

    const fetchContacts = async (token = localStorage.getItem('token')) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/guests?eventId=${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
            await axios.post('http://localhost:5000/api/guests', {
                ...form, eventId
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            //setForm({ name: '', email: '', mobile: '' });
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
            await axios.delete(`http://localhost:5000/api/guests/${deleteId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setContacts(prev => prev.filter(contact => contact._id !== deleteId)); // ✅ instant feedback
        } catch (err) {
            console.error('Error deleting contact:', err);
        } finally {
            setOpenDialog(false);
            setDeleteId(null);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Contacts for Event #{eventId}
                </Typography>

                <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Mobile</strong></TableCell>
                                <TableCell align="center"><strong>Delete</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contacts.map(contact => (
                                <TableRow key={contact._id}>
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

                <Typography variant="h6" gutterBottom>Add New Contact</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
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
        </Box>
    );
};

export default UIContactsPage;
