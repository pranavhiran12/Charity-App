import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
    CircularProgress, TextField, InputAdornment, IconButton, Tooltip, Pagination, Stack, MenuItem, Select
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage, setEventsPerPage] = useState(5);

    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem("token");

            try {
                const res = await axios.get('http://localhost:5000/api/admin/events', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = Array.isArray(res.data) ? res.data : [];
                setEvents(data);
                setFilteredEvents(data);
            } catch (err) {
                console.error("❌ Failed to fetch events:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);


    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = events.filter(e =>
            (e.eventTitle?.toLowerCase().includes(lowerSearch) || '') ||
            (e.childName?.toLowerCase().includes(lowerSearch) || '')
        );
        setFilteredEvents(filtered);
        setCurrentPage(1);
    }, [searchTerm, events]);

    const handleDelete = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/admin/event/${eventId}`);
            setEvents(prev => prev.filter(e => e._id !== eventId));
        } catch (err) {
            console.error("Error deleting event:", err);
        }
    };

    const indexOfLast = currentPage * eventsPerPage;
    const indexOfFirst = indexOfLast - eventsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={4} sx={{ width: '100%', bgcolor: '#f0f4f8', minHeight: '100vh' }}>
            <Typography variant="h4" fontWeight="bold" mb={3} color="primary.main">
                🎉 Admin Event Management
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} alignItems={{ sm: 'center' }}>
                <TextField
                    placeholder="Search events by title or child name..."
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
                    value={eventsPerPage}
                    onChange={(e) => setEventsPerPage(Number(e.target.value))}
                    sx={{ width: 120, bgcolor: 'white', boxShadow: 1 }}
                >
                    {[5, 10, 20, 50].map(num => (
                        <MenuItem key={num} value={num}>{num}/page</MenuItem>
                    ))}
                </Select>
            </Stack>

            <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#dbeafe' }}>
                        <TableRow>
                            <TableCell><strong>Title</strong></TableCell>
                            <TableCell><strong>Child</strong></TableCell>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentEvents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4, fontStyle: 'italic' }}>
                                    No events found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentEvents.map(event => (
                                <TableRow key={event._id} hover sx={{ transition: 'all 0.2s', '&:hover': { backgroundColor: '#f1f5f9' } }}>
                                    <TableCell>{event.eventTitle || 'Untitled Event'}</TableCell>
                                    <TableCell>{event.childName || '-'}</TableCell>
                                    <TableCell>{new Date(event.eventDate).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Delete event">
                                            <IconButton onClick={() => handleDelete(event._id)} color="error">
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

            <Stack mt={4} spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                    Showing {indexOfFirst + 1}-{Math.min(indexOfLast, filteredEvents.length)} of {filteredEvents.length} events
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
        </Box>
    );
};

export default AdminEvents;
