import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
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
    Divider,
    Chip
} from '@mui/material';
import {
    People as PeopleIcon,
    Event as EventIcon,
    AttachMoney as MoneyIcon,
    Email as EmailIcon,
    Group as GroupIcon,
    Payment as PaymentIcon,
    VerifiedUser as VerifiedIcon,
    Pending as PendingIcon,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const fetchDashboardData = async () => {
        try {
            // First check if user is authenticated
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found. Please log in.');
                return;
            }

            // Try to decode token to get user info
            try {
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                console.log('👤 Token payload:', tokenPayload);
                setUserInfo({
                    id: tokenPayload.id,
                    email: tokenPayload.email,
                    role: tokenPayload.role || 'user'
                });
            } catch (tokenErr) {
                console.error('❌ Error decoding token:', tokenErr);
            }

            const response = await API.get('/admin/dashboard-stats');
            console.log('📊 Dashboard response:', response.data);
            setStats(response.data);
        } catch (err) {
            console.error('❌ Error fetching admin dashboard data:', err);
            console.error('❌ Error response:', err.response?.data);
            console.error('❌ Error status:', err.response?.status);
            console.error('❌ Error headers:', err.response?.headers);
            setError(`Failed to load admin dashboard data: ${err.response?.data?.message || err.message}`);
            // Set default stats to show something
            setStats({
                counts: {
                    totalUsers: 0,
                    totalEvents: 0,
                    totalContributions: 0,
                    totalCharities: 0,
                    totalGuests: 0,
                    totalInvitations: 0,
                    totalPayments: 0,
                    verifiedUsers: 0,
                    pendingInvitations: 0,
                    acceptedInvitations: 0,
                    declinedInvitations: 0,
                    totalAmount: 0
                },
                recent: {
                    users: [],
                    events: [],
                    contributions: []
                }
            });
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

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

                {userInfo && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Logged in as: {userInfo.name} ({userInfo.email}) - Role: {userInfo.role}
                    </Alert>
                )}

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {!stats && !loading && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        No dashboard data available. Please check your connection and try again.
                    </Alert>
                )}

                {stats && (
                    <>
                        {/* Main Statistics */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', backgroundColor: '#e2e8f0' }}>
                                    <PeopleIcon sx={{ fontSize: 40, color: '#1e40af', mb: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Total Users</Typography>
                                    <Typography variant="h3" color="#1e40af" fontWeight="bold">{stats.counts.totalUsers}</Typography>
                                    <Chip
                                        label={`${stats.counts.verifiedUsers} verified`}
                                        size="small"
                                        color="success"
                                        sx={{ mt: 1 }}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', backgroundColor: '#e2e8f0' }}>
                                    <EventIcon sx={{ fontSize: 40, color: '#0369a1', mb: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Total Events</Typography>
                                    <Typography variant="h3" color="#0369a1" fontWeight="bold">{stats.counts.totalEvents}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', backgroundColor: '#e2e8f0' }}>
                                    <GroupIcon sx={{ fontSize: 40, color: '#b45309', mb: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Total Guests</Typography>
                                    <Typography variant="h3" color="#b45309" fontWeight="bold">{stats.counts.totalGuests}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', backgroundColor: '#e2e8f0' }}>
                                    <MoneyIcon sx={{ fontSize: 40, color: '#059669', mb: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Total Revenue</Typography>
                                    <Typography variant="h3" color="#059669" fontWeight="bold">
                                        {formatCurrency(stats.counts.totalAmount)}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Secondary Statistics */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', backgroundColor: '#fef3c7' }}>
                                    <EmailIcon sx={{ fontSize: 30, color: '#d97706', mb: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Invitations</Typography>
                                    <Typography variant="h4" color="#d97706" fontWeight="bold">{stats.counts.totalInvitations}</Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <Chip
                                            icon={<PendingIcon />}
                                            label={`${stats.counts.pendingInvitations} pending`}
                                            size="small"
                                            color="warning"
                                            sx={{ mr: 0.5 }}
                                        />
                                        <Chip
                                            icon={<CheckIcon />}
                                            label={`${stats.counts.acceptedInvitations} accepted`}
                                            size="small"
                                            color="success"
                                            sx={{ mr: 0.5 }}
                                        />
                                        <Chip
                                            icon={<CancelIcon />}
                                            label={`${stats.counts.declinedInvitations} declined`}
                                            size="small"
                                            color="error"
                                        />
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', backgroundColor: '#dbeafe' }}>
                                    <PaymentIcon sx={{ fontSize: 30, color: '#2563eb', mb: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Payments</Typography>
                                    <Typography variant="h4" color="#2563eb" fontWeight="bold">{stats.counts.totalPayments}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', backgroundColor: '#dcfce7' }}>
                                    <MoneyIcon sx={{ fontSize: 30, color: '#16a34a', mb: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Contributions</Typography>
                                    <Typography variant="h4" color="#16a34a" fontWeight="bold">{stats.counts.totalContributions}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', backgroundColor: '#fef3c7' }}>
                                    <VerifiedIcon sx={{ fontSize: 30, color: '#d97706', mb: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Charities</Typography>
                                    <Typography variant="h4" color="#d97706" fontWeight="bold">{stats.counts.totalCharities}</Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 4 }} />

                        {/* Recent Activity */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>
                                    Recent Users
                                </Typography>
                                <Paper elevation={1} sx={{ borderRadius: 4, overflowX: 'auto', backgroundColor: '#e2e8f0' }}>
                                    <Table sx={{ minWidth: 400 }}>
                                        <TableHead sx={{ backgroundColor: '#cbd5e1' }}>
                                            <TableRow>
                                                <TableCell><strong>Name</strong></TableCell>
                                                <TableCell><strong>Email</strong></TableCell>
                                                <TableCell><strong>Status</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stats.recent.users.map(user => (
                                                <TableRow key={user._id}>
                                                    <TableCell>{user.name}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={user.isVerified ? 'Verified' : 'Pending'}
                                                            color={user.isVerified ? 'success' : 'warning'}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>
                                    Recent Events
                                </Typography>
                                <Paper elevation={1} sx={{ borderRadius: 4, overflowX: 'auto', backgroundColor: '#e2e8f0' }}>
                                    <Table sx={{ minWidth: 400 }}>
                                        <TableHead sx={{ backgroundColor: '#cbd5e1' }}>
                                            <TableRow>
                                                <TableCell><strong>Event Name</strong></TableCell>
                                                <TableCell><strong>Date</strong></TableCell>
                                                <TableCell><strong>Status</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stats.recent.events.map(event => (
                                                <TableRow key={event._id}>
                                                    <TableCell>{event.eventTitle}</TableCell>
                                                    <TableCell>
                                                        {new Date(event.eventDate).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={new Date(event.eventDate) > new Date() ? 'Upcoming' : 'Past'}
                                                            color={new Date(event.eventDate) > new Date() ? 'primary' : 'default'}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Box>
        </>
    );
};

export default AdminDashboard;
