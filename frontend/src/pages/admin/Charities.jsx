import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
    CircularProgress, TextField, InputAdornment, IconButton, Tooltip, Pagination, Stack,
    MenuItem, Select, Button, Dialog, DialogTitle, DialogContent, DialogActions, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const AdminCharities = () => {
    const [charities, setCharities] = useState([]);
    const [filteredCharities, setFilteredCharities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', website: '', logoUrl: '', image: null });

    const fetchCharities = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get('http://localhost:5000/api/admin/charities', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = Array.isArray(res.data) ? res.data : [];
            setCharities(data);
            setFilteredCharities(data);
        } catch (err) {
            console.error("❌ Failed to fetch charities:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCharities();
    }, []);

    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = charities.filter(c =>
            (c.name?.toLowerCase().includes(lowerSearch) || '') ||
            (c.description?.toLowerCase().includes(lowerSearch) || '')
        );
        setFilteredCharities(filtered);
        setCurrentPage(1);
    }, [searchTerm, charities]);

    const handleDelete = async (charityId) => {
        if (!window.confirm("Are you sure you want to delete this charity?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/charity/${charityId}`);
            setCharities(prev => prev.filter(c => c._id !== charityId));
        } catch (err) {
            console.error("Error deleting charity:", err);
        }
    };

    const handleOpenDialog = (charity = null) => {
        setEditMode(!!charity);
        setFormData(charity || { name: '', description: '', website: '', logoUrl: '', image: null });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleFileUpload = async (file) => {
        const form = new FormData();
        form.append('file', file);

        const res = await axios.post('http://localhost:5000/api/upload', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return res.data.url;
    };

    const handleSubmit = async () => {
        try {
            let uploadedUrl = formData.logoUrl;

            if (formData.image instanceof File) {
                uploadedUrl = await handleFileUpload(formData.image);
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                website: formData.website,
                logoUrl: uploadedUrl,
            };

            const token = localStorage.getItem("token");

            if (editMode) {
                await axios.put(`http://localhost:5000/api/admin/charity/${formData._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(`http://localhost:5000/api/admin/charity`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            fetchCharities();
            handleCloseDialog();
        } catch (err) {
            console.error("Failed to save charity:", err);
        }
    };

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentCharities = filteredCharities.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredCharities.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Box p={4} sx={{ width: '100%', bgcolor: '#f0f4f8', minHeight: '100vh' }}>
            <Typography variant="h4" fontWeight="bold" mb={3} color="primary.main">
                ❤️ Admin Charity Management
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} alignItems={{ sm: 'center' }}>
                <TextField
                    placeholder="Search charities by name or description..."
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        )
                    }}
                />
                <Select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    sx={{ width: 120, bgcolor: 'white', boxShadow: 1 }}
                >
                    {[5, 10, 20, 50].map(num => (
                        <MenuItem key={num} value={num}>{num}/page</MenuItem>
                    ))}
                </Select>
                <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                    Add Charity
                </Button>
            </Stack>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#fce7f3' }}>
                            <TableRow>
                                <TableCell><strong>Image</strong></TableCell>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Description</strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentCharities.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4, fontStyle: 'italic' }}>
                                        No charities found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                currentCharities.map(charity => (
                                    <TableRow key={charity._id} hover sx={{ transition: '0.2s', '&:hover': { backgroundColor: '#fdf2f8' } }}>
                                        <TableCell>
                                            {charity.logoUrl ? (
                                                <Avatar alt={charity.name} src={charity.logoUrl} />
                                            ) : 'N/A'}
                                        </TableCell>
                                        <TableCell>{charity.name}</TableCell>
                                        <TableCell>{charity.description}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Edit charity">
                                                <IconButton onClick={() => handleOpenDialog(charity)} color="primary">
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete charity">
                                                <IconButton onClick={() => handleDelete(charity._id)} color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            )}

            <Stack mt={4} spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                    Showing {indexOfFirst + 1}-{Math.min(indexOfLast, filteredCharities.length)} of {filteredCharities.length} charities
                </Typography>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                />
            </Stack>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? 'Edit Charity' : 'Add New Charity'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Charity Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            fullWidth
                            multiline
                            rows={3}
                        />
                        <TextField
                            label="Website URL"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Logo URL"
                            value={formData.logoUrl}
                            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {editMode ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminCharities;
