import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
    Box, Typography, TextField, Button, Grid, Card, CardContent, CardActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const UIGuestAddressBook = () => {
    const { eventId } = useParams();
    const [guests, setGuests] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', mobile: '' });

    useEffect(() => {
        fetchGuests();
    }, []);

    const fetchGuests = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/guests/${eventId}`);
            setGuests(res.data);
        } catch (err) {
            console.error('Error fetching guests:', err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAdd = async () => {
        try {
            const res = await axios.post(`http://localhost:5000/api/guests`, {
                ...form,
                eventId
            });
            setGuests([...guests, res.data]);
            setForm({ name: '', email: '', mobile: '' });
        } catch (err) {
            console.error('Error adding guest:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/guests/${id}`);
            setGuests(guests.filter(g => g._id !== id));
        } catch (err) {
            console.error('Error deleting guest:', err);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" mb={3}>Guest Address Book</Typography>

            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField fullWidth label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={1}>
                    <Button variant="contained" fullWidth onClick={handleAdd}>Add</Button>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                {guests.map(guest => (
                    <Grid item xs={12} sm={6} md={4} key={guest._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{guest.name}</Typography>
                                <Typography>{guest.email}</Typography>
                                <Typography>{guest.mobile}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button color="error" onClick={() => handleDelete(guest._id)} startIcon={<DeleteIcon />}>
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default UIGuestAddressBook;
