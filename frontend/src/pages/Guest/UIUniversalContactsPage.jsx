import React, { useEffect, useState } from 'react';
import {
    Box, Typography, TextField, IconButton, Paper, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Snackbar, Alert, Button, Stack, Pagination, Chip, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import axios from 'axios';

const UIUniversalContactsPage = () => {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [newContact, setNewContact] = useState({ name: '', email: '', mobile: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedTags, setSelectedTags] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, contactId: null });

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const fetchContacts = async (query = '', pageNum = 1, tags = []) => {
        try {
            const tagQuery = tags.map(t => `tags=${t}`).join('&');
            const res = await axios.get(`http://localhost:5000/api/contacts?q=${query}&page=${pageNum}&${tagQuery}`, getAuthHeaders());
            const data = res.data;
            const list = Array.isArray(data.contacts) ? data.contacts : Array.isArray(data) ? data : [];
            setContacts(list);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error('Fetch error:', err);
            setErrorMessage('Failed to load contacts.');
        }
    };

    useEffect(() => {
        fetchContacts(search, page, selectedTags);
    }, [page, selectedTags]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        fetchContacts(value, 1, selectedTags);
        setPage(1);
    };

    const handleDeleteConfirm = async () => {
        const id = deleteDialog.contactId;
        try {
            await axios.delete(`http://localhost:5000/api/contacts/${id}`, getAuthHeaders());
            setContacts((prev) => prev.filter((c) => c._id !== id));
            setSuccessMessage('Contact deleted successfully.');
        } catch (err) {
            console.error(err);
            setErrorMessage('Failed to delete contact.');
        } finally {
            setDeleteDialog({ open: false, contactId: null });
        }
    };

    const handleInputChange = (e) => {
        setNewContact({ ...newContact, [e.target.name]: e.target.value });
    };

    const handleAddContact = async () => {
        const { name, email, mobile } = newContact;
        if (!name || !email || !mobile) return setErrorMessage('All fields are required.');
        try {
            await axios.post('http://localhost:5000/api/contacts', newContact, getAuthHeaders());
            setNewContact({ name: '', email: '', mobile: '' });
            fetchContacts(search, page, selectedTags);
            setSuccessMessage('Contact added successfully.');
        } catch (err) {
            console.error(err);
            setErrorMessage('Failed to add contact.');
        }
    };

    const handleTagToggle = (tag) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 4, md: 6 } }}>
            <Paper elevation={5} sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h4" gutterBottom textAlign="center" color="primary">
                    📇 My Universal Contacts
                </Typography>

                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name, email, or mobile..."
                    value={search}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 4 }}
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                    <TextField name="name" label="Name" value={newContact.name} onChange={handleInputChange} fullWidth />
                    <TextField name="email" label="Email" value={newContact.email} onChange={handleInputChange} fullWidth />
                    <TextField name="mobile" label="Mobile" value={newContact.mobile} onChange={handleInputChange} fullWidth />
                    <Button variant="contained" color="primary" onClick={handleAddContact} startIcon={<PersonAddAltIcon />}>
                        Add
                    </Button>
                </Stack>

                <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                    {["Friends", "Family", "Work", "School"].map(tag => (
                        <Chip
                            key={tag}
                            label={tag}
                            variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                            color="primary"
                            onClick={() => handleTagToggle(tag)}
                            sx={{ cursor: 'pointer' }}
                        />
                    ))}
                </Stack>

                <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Mobile</strong></TableCell>
                                <TableCell align="center"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(contacts) && contacts.map(contact => (
                                <TableRow key={contact._id} hover>
                                    <TableCell>{contact.name}</TableCell>
                                    <TableCell>{contact.email}</TableCell>
                                    <TableCell>{contact.mobile}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="error" onClick={() => setDeleteDialog({ open: true, contactId: contact._id })}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {Array.isArray(contacts) && contacts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No contacts found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Stack direction="row" justifyContent="center" mt={4}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        color="primary"
                    />
                </Stack>
            </Paper>

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, contactId: null })}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this contact? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, contactId: null })}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* FEEDBACK SNACKBARS */}
            <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage('')}>
                <Alert severity="success" onClose={() => setSuccessMessage('')}>
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={!!errorMessage} autoHideDuration={3000} onClose={() => setErrorMessage('')}>
                <Alert severity="error" onClose={() => setErrorMessage('')}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UIUniversalContactsPage;
