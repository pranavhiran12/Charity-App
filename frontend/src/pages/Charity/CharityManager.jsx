import React, { useEffect, useState } from 'react';
import {
    Box, Button, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent,
    DialogTitle, Grid, IconButton, Pagination, Stack, TextField, Typography
} from '@mui/material';
import { Add, Delete, Edit, Search } from '@mui/icons-material';
import axios from 'axios';

const rowsPerPage = 6;

const CharityManager = () => {
    const [charities, setCharities] = useState([]);
    const [filteredCharities, setFilteredCharities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCharity, setSelectedCharity] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', image: null });
    const [page, setPage] = useState(1);

    const fetchCharities = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/charities`);
            setCharities(res.data.charities);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCharities();
    }, []);

    useEffect(() => {
        const filtered = charities.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCharities(filtered);
        setPage(1);
    }, [searchTerm, charities]);

    const handleOpenDialog = (charity = null) => {
        setSelectedCharity(charity);
        setFormData({
            name: charity?.name || '',
            description: charity?.description || '',
            image: null,
        });
        setOpenDialog(true);
    };

    const handleSave = async () => {
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            if (formData.image) data.append('image', formData.image);

            if (selectedCharity) {
                await axios.put(`http://localhost:5000/api/charities/${selectedCharity._id}`, data);
            } else {
                await axios.post(`http://localhost:5000/api/charities`, data);
            }

            fetchCharities();
            setOpenDialog(false);
        } catch (err) {
            console.error('Error saving charity:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this charity?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/charities/${id}`);
            fetchCharities();
        } catch (err) {
            console.error(err);
        }
    };

    const displayedCharities = filteredCharities.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <Box p={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search charities"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <Search sx={{ mr: 1 }} />
                    }}
                />
                <Button startIcon={<Add />} variant="contained" onClick={() => handleOpenDialog()}>
                    Add Charity
                </Button>
            </Stack>

            <Grid container spacing={2}>
                {displayedCharities.map(charity => (
                    <Grid item xs={12} sm={6} md={4} key={charity._id}>
                        <Card>
                            {charity.logoUrl && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={charity.logoUrl}
                                    alt={charity.name}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6">{charity.name}</Typography>
                                <Typography variant="body2">{charity.description}</Typography>
                            </CardContent>
                            <Stack direction="row" spacing={1} justifyContent="flex-end" p={1}>
                                <IconButton onClick={() => handleOpenDialog(charity)}><Edit /></IconButton>
                                <IconButton onClick={() => handleDelete(charity._id)}><Delete /></IconButton>
                            </Stack>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box mt={3} display="flex" justifyContent="center">
                <Pagination
                    count={Math.ceil(filteredCharities.length / rowsPerPage)}
                    page={page}
                    onChange={(e, val) => setPage(val)}
                />
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{selectedCharity ? 'Edit Charity' : 'Add Charity'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <Button component="label" variant="outlined">
                        Upload Logo
                        <input
                            hidden
                            accept="image/*"
                            type="file"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                        />
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CharityManager;
