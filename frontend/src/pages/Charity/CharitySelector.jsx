import React, { useEffect, useState } from 'react';
import {
    Box, Card, CardContent, CardMedia, Typography, Grid,
    TextField, Pagination, Button, Dialog, DialogTitle, IconButton, InputAdornment
} from '@mui/material';
import { Search } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const rowsPerPage = 6;

const CharitySelectorModal = ({ onSelect }) => {
    const [charities, setCharities] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const fetchCharities = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/charities');
                setCharities(res.data.charities || []);
            } catch (err) {
                console.error('Failed to fetch charities:', err);
            }
        };
        fetchCharities();
    }, [open]);

    useEffect(() => {
        const lower = search.toLowerCase();
        const filtered = charities.filter(c =>
            c.name.toLowerCase().includes(lower)
        );
        setFiltered(filtered);
        setPage(1);
    }, [search, charities]);

    const visibleCharities = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSelect = (charity) => {
        onSelect(charity);
        handleClose();
    };

    return (
        <>
            <Button
                variant="contained"
                onClick={handleOpen}
                sx={{
                    mb: 2,
                    textTransform: 'none',
                    borderRadius: 2,
                    fontWeight: 'bold',
                    px: 3,
                    py: 1.2,
                    background: 'linear-gradient(to right, #4caf50, #81c784)',
                    '&:hover': {
                        background: 'linear-gradient(to right, #388e3c, #66bb6a)'
                    }
                }}
            >
                Select Charity
            </Button>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="bold">Select a Charity</Typography>
                    <IconButton aria-label="close" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Box p={3} bgcolor="#f5f5f5">
                    <TextField
                        fullWidth
                        placeholder="Search for a charity..."
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            )
                        }}
                        sx={{ mb: 3, bgcolor: 'white', borderRadius: 1 }}
                    />

                    <Grid container spacing={3}>
                        {visibleCharities.map(charity => (
                            <Grid item xs={12} sm={6} md={4} key={charity._id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 4 }}>
                                    {charity.logoUrl && (
                                        <CardMedia
                                            component="img"
                                            height="160"
                                            image={charity.logoUrl}
                                            alt={charity.name}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                    )}
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>{charity.name}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 60 }}>
                                            {charity.description}
                                        </Typography>
                                    </CardContent>
                                    <Box px={2} pb={2} textAlign="center">
                                        <Button
                                            variant="contained"
                                            size="medium"
                                            fullWidth
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                backgroundColor: '#4caf50',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: '#388e3c'
                                                }
                                            }}
                                            onClick={() => handleSelect(charity)}
                                        >
                                            Select Charity
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box mt={4} display="flex" justifyContent="center">
                        <Pagination
                            count={Math.ceil(filtered.length / rowsPerPage)}
                            page={page}
                            onChange={(e, val) => setPage(val)}
                            color="primary"
                            shape="rounded"
                        />
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};

export default CharitySelectorModal;
