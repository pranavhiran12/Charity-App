// InviteeList.jsx
import React, { useEffect, useState } from 'react';
import {
    Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TextField, Chip, Box, Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import socket from '../socket';

const InviteeList = () => {
    const { eventId } = useParams();
    const [invitees, setInvitees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(10);

    useEffect(() => {
        const fetchInvitees = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/invitations/event/${eventId}`);
                setInvitees(res.data);
            } catch (err) {
                console.error('Error fetching invitees:', err);
            }
        };
        fetchInvitees();
    }, [eventId]);

    useEffect(() => {
        socket.emit('joinEventRoom', eventId);

        socket.on('inviteeStatusUpdated', (updatedGuest) => {
            setInvitees(prev =>
                prev.map(guest =>
                    guest._id === updatedGuest.guestId ? { ...guest, status: updatedGuest.status } : guest
                )
            );
        });

        return () => {
            socket.emit('leaveEventRoom', eventId);
            socket.off('inviteeStatusUpdated');
        };
    }, [eventId]);

    const filteredInvitees = invitees.filter(invitee =>
        invitee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitee.mobile?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedInvitees = filteredInvitees.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>📋 Invitees</Typography>
            <TextField
                label="Search by name or mobile"
                fullWidth
                variant="outlined"
                size="small"
                margin="normal"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    )
                }}
            />
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Mobile</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedInvitees.map(invitee => (
                            <TableRow key={invitee._id}>
                                <TableCell>{invitee.name}</TableCell>
                                <TableCell>{invitee.mobile || '-'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={invitee.status?.toUpperCase() || 'PENDING'}
                                        color={invitee.status === 'accepted' ? 'success' : invitee.status === 'declined' ? 'error' : 'warning'}
                                        size="small"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box mt={2} display="flex" justifyContent="center">
                <Pagination
                    count={Math.ceil(filteredInvitees.length / rowsPerPage)}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                />
            </Box>
        </Paper>
    );
};

export default InviteeList;
