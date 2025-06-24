import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import {
    Box,
    Typography,
    Grid,
    Paper,
    CircularProgress,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Alert,
    Divider
} from '@mui/material';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            const [userRes, eventRes, contribRes] = await Promise.all([
                axios.get('/api/admin/users'),
                axios.get('/api/admin/events'),
                axios.get('/api/admin/contributions'),
            ]);
            setUsers(Array.isArray(userRes.data) ? userRes.data : []);
            setEvents(Array.isArray(eventRes.data) ? eventRes.data : []);
            setContributions(Array.isArray(contribRes.data) ? contribRes.data : []);
        } catch (err) {
            console.error('❌ Error fetching admin data:', err);
            setError('Failed to load admin dashboard data.');
            setUsers([]);
            setEvents([]);
            setContributions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress size={60} color="primary" />
            </Box>
        );
    }

    return (
        <>
            <AdminNavbar />
            <Box
                sx={{
                    width: '100%',
                    minHeight: '100vh',
                    backgroundColor: '#f3f4f6',
                    padding: { xs: 2, sm: 4, md: 6 }
                }}
            >
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>
                    Admin Dashboard
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Grid container spacing={3} sx={{ mb: 6 }}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, textAlign: 'center', backgroundColor: '#e2e8f0' }}>
                            <Typography variant="h6" color="text.secondary">Total Users</Typography>
                            <Typography variant="h3" color="#1e40af" fontWeight="bold">{users.length}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, textAlign: 'center', backgroundColor: '#e2e8f0' }}>
                            <Typography variant="h6" color="text.secondary">Total Events</Typography>
                            <Typography variant="h3" color="#0369a1" fontWeight="bold">{events.length}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, textAlign: 'center', backgroundColor: '#e2e8f0' }}>
                            <Typography variant="h6" color="text.secondary">Total Contributions</Typography>
                            <Typography variant="h3" color="#b45309" fontWeight="bold">{contributions.length}</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>
                    Recent Users
                </Typography>

                <Paper elevation={1} sx={{ borderRadius: 4, overflowX: 'auto', backgroundColor: '#e2e8f0' }}>
                    <Table sx={{ minWidth: 800 }}>
                        <TableHead sx={{ backgroundColor: '#cbd5e1' }}>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Verified</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(users || []).slice(0, 5).map(user => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Typography sx={{ color: user.isVerified ? '#15803d' : '#b91c1c', fontWeight: 500 }}>
                                            {user.isVerified ? 'Yes' : 'No'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>
        </>
    );
};

export default AdminDashboard;
