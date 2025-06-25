import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, CardActions, Button,
    TextField, CircularProgress, InputAdornment, Pagination, Chip, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

const ReceivedInvitations = () => {
    const [invitations, setInvitations] = useState([]);
    const [filteredInvitations, setFilteredInvitations] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const itemsPerPage = 6;

    const fetchReceivedInvitations = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const res = await axios.get('/api/invitations/received', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = Array.isArray(res.data) ? res.data : [];
            setInvitations(data);
            setFilteredInvitations(data);
        } catch (err) {
            console.error('❌ Error fetching invitations:', err);
            setInvitations([]);
            setFilteredInvitations([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReceivedInvitations();
    }, []);

    useEffect(() => {
        const filtered = invitations.filter(invite =>
            (invite?.eventId?.eventTitle || '').toLowerCase().includes(search.toLowerCase()) ||
            (invite?.eventId?.venue || '').toLowerCase().includes(search.toLowerCase()) ||
            (invite?.guestId?.name || '').toLowerCase().includes(search.toLowerCase())
        );
        setFilteredInvitations(filtered);
        setPage(1);
    }, [search, invitations]);

    const paginatedData = filteredInvitations.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <Box px={3} py={4}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                🎁 Invitations Received
            </Typography>

            <TextField
                placeholder="Search by event, venue, or name"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                margin="normal"
                sx={{ mb: 4 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {paginatedData.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography align="center" variant="body1">
                                No invitations found.
                            </Typography>
                        </Grid>
                    ) : (
                        paginatedData.map((inv, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Card sx={{ borderRadius: 4, boxShadow: 4 }}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" mb={1}>
                                            <Avatar
                                                src={inv.eventId?.eventImage}
                                                alt="Event"
                                                sx={{ width: 48, height: 48, mr: 2 }}
                                            />
                                            <Typography variant="h6">
                                                {inv.eventId?.eventTitle || 'Untitled Event'}
                                            </Typography>
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" mb={0.5}>
                                            <CalendarTodayIcon sx={{ fontSize: 18, mr: 1 }} />
                                            {inv.eventId?.eventDate ? new Date(inv.eventId.eventDate).toLocaleDateString() : 'N/A'}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" mb={1}>
                                            <LocationOnIcon sx={{ fontSize: 18, mr: 1 }} />
                                            {inv.eventId?.venue || 'N/A'}
                                        </Typography>

                                        <Typography variant="body2">
                                            Guest: <strong>{inv.guestId?.name || 'N/A'}</strong>
                                        </Typography>

                                        <Chip
                                            label={`Status: ${inv.status || 'pending'}`}
                                            color={inv.status === 'accepted' ? 'success' : inv.status === 'declined' ? 'error' : 'warning'}
                                            variant="outlined"
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    </CardContent>

                                    <CardActions sx={{ p: 2 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            href={`/invite/${inv.invitationCode}`}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            View Invitation
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            )}

            {filteredInvitations.length > itemsPerPage && (
                <Box mt={4} display="flex" justifyContent="center">
                    <Pagination
                        count={Math.ceil(filteredInvitations.length / itemsPerPage)}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        color="primary"
                        shape="rounded"
                        size="large"
                    />
                </Box>
            )}
        </Box>
    );
};

export default ReceivedInvitations;
