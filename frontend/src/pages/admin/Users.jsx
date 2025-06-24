import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
    CircularProgress, TextField, InputAdornment, IconButton, Tooltip, Avatar, Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedIcon from '@mui/icons-material/CheckCircle';
import UnverifiedIcon from '@mui/icons-material/Cancel';

import {
    // ...
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';


const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(5);

    //const usersPerPage = 5;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get('http://localhost:5000/api/admin/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = Array.isArray(res.data) ? res.data : [];
                setUsers(data);
                setFilteredUsers(data);
            } catch (err) {
                console.error("❌ Failed to fetch users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = users.filter(u =>
            (u.name?.toLowerCase().includes(lowerSearch) || '') ||
            (u.email?.toLowerCase().includes(lowerSearch) || '')
        );
        setFilteredUsers(filtered);
        setCurrentPage(1); // Reset to first page on new search
    }, [searchTerm, users]);

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
            setUsers(prev => prev.filter(u => u._id !== userId));
        } catch (err) {
            console.error("Error deleting user:", err);
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
        <Box p={3} sx={{ width: '100%', bgcolor: '#f9fafb', minHeight: '100vh' }}>
            <Typography variant="h4" fontWeight="bold" mb={4} color="primary.dark">
                User Management
            </Typography>

            <TextField
                placeholder="Search users by name or email..."
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3, bgcolor: 'white', borderRadius: 2 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    )
                }}
            />

            <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'auto', p: 2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#e0f2fe' }}>
                        <TableRow>
                            <TableCell><strong>Avatar</strong></TableCell>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Verified</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentUsers.map(user => (
                                <TableRow key={user._id} hover>
                                    <TableCell>
                                        <Avatar>{user.name?.[0]?.toUpperCase() || '?'}</Avatar>
                                    </TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.isVerified ? (
                                            <Tooltip title="Verified">
                                                <VerifiedIcon sx={{ color: '#10b981' }} />
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Not Verified">
                                                <UnverifiedIcon sx={{ color: '#ef4444' }} />
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Delete user">
                                            <IconButton onClick={() => handleDelete(user._id)} color="error">
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

            <Box mt={4} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                <FormControl size="small">
                    <InputLabel id="users-per-page-label">Users per page</InputLabel>
                    <Select
                        labelId="users-per-page-label"
                        value={usersPerPage}
                        label="Users per page"
                        onChange={(e) => {
                            setCurrentPage(1); // reset to page 1 when perPage changes
                            setUsersPerPage(Number(e.target.value));
                        }}
                    >
                        {[5, 10, 25, 50].map((num) => (
                            <MenuItem key={num} value={num}>{num}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                />
            </Box>

        </Box>
    );
};

export default AdminUsers;
