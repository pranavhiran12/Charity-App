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

    const handleSubmit = async () => {
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('website', formData.website);
            data.append('logoUrl', formData.logoUrl);
            if (formData.image) data.append('image', formData.image);

            if (editMode) {
                await axios.put(`http://localhost:5000/api/admin/charity/${formData._id}`, data);
            } else {
                await axios.post(`http://localhost:5000/api/admin/charity`, data);
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
                                            {charity.image || charity.logoUrl ? (
                                                <Avatar
                                                    alt={charity.name}
                                                    src={charity.image ? `/uploads/${charity.image}` : charity.logoUrl}
                                                />
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
                <DialogTitle>{editMode ? "Edit Charity" : "Add Charity"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <TextField
                            label="Website"
                            fullWidth
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />
                        <TextField
                            label="Logo URL"
                            fullWidth
                            value={formData.logoUrl}
                            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        />
                        <Button variant="outlined" component="label">
                            Upload Image
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                            />
                        </Button>
                        {formData.image && <Typography variant="caption">{formData.image.name}</Typography>}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {editMode ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminCharities;
