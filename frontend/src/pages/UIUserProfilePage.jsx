import React, { useEffect, useState } from 'react';
import {
    Box, Typography, TextField, Button, Paper, FormControlLabel,
    Checkbox, MenuItem, Grid, Snackbar, Alert, Avatar
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PublicIcon from '@mui/icons-material/Public';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import axios from 'axios';

const countries = ["India", "United States", "United Kingdom", "Australia", "Canada"];

const UIUserProfilePage = () => {
    const [form, setForm] = useState({
        givenName: '',
        familyName: '',
        prefix: '',
        mobile: '',
        street: '',
        city: '',
        country: '',
        newsletter: false,
        bankName: '',
        branchCode: '',
        accountHolder: '',
        accountNumber: '',
        retypeAccountNumber: '',
        agreed: false
    });

    const [successMessageOpen, setSuccessMessageOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setForm(prev => ({ ...prev, ...res.data }));
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        if (form.accountNumber !== form.retypeAccountNumber) {
            alert("Account numbers do not match.");
            return;
        }

        if (!form.agreed) {
            alert("You must agree to the terms.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/profile', form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMessageOpen(true);
        } catch (err) {
            console.error("Error saving profile:", err);
            alert("Failed to save profile.");
        }
    };

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
            <Paper elevation={4} sx={{ p: 5, borderRadius: 4, background: '#ffffff' }}>
                <Box display="flex" alignItems="center" mb={3}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <AccountCircleIcon />
                    </Avatar>
                    <Typography variant="h4" fontWeight={600}>My Account</Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <TextField label="Prefix" name="prefix" value={form.prefix} onChange={handleChange} fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField label="Given Name(s)" name="givenName" value={form.givenName} onChange={handleChange} fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField label="Family Name" name="familyName" value={form.familyName} onChange={handleChange} fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Mobile Number" name="mobile" value={form.mobile} onChange={handleChange} fullWidth variant="outlined" InputProps={{ startAdornment: <PhoneAndroidIcon sx={{ mr: 1 }} /> }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Street Address" name="street" value={form.street} onChange={handleChange} fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="City" name="city" value={form.city} onChange={handleChange} fullWidth variant="outlined" InputProps={{ startAdornment: <LocationCityIcon sx={{ mr: 1 }} /> }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Country"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            fullWidth
                            select
                            variant="outlined"
                            InputProps={{ startAdornment: <PublicIcon sx={{ mr: 1 }} /> }}
                        >
                            {countries.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox name="newsletter" checked={form.newsletter} onChange={handleChange} />}
                            label="Stay in touch for news on volunteering, party planning tips, charity news and much more!"
                        />
                    </Grid>
                </Grid>

                <Box mt={5} display="flex" alignItems="center">
                    <CreditCardIcon color="primary" sx={{ mr: 2 }} />
                    <Typography variant="h5" fontWeight={600}>Bank Details</Typography>
                </Box>

                <Grid container spacing={3} mt={1}>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Bank" name="bankName" value={form.bankName} onChange={handleChange} fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Branch Code" name="branchCode" value={form.branchCode} onChange={handleChange} fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Account Holder's Name" name="accountHolder" value={form.accountHolder} onChange={handleChange} fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Account Number" name="accountNumber" type="password" value={form.accountNumber} onChange={handleChange} fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Retype Account Number" name="retypeAccountNumber" type="password" value={form.retypeAccountNumber} onChange={handleChange} fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox name="agreed" checked={form.agreed} onChange={handleChange} />}
                            label="I agree the above information is correct and I authorise Twopresents to send funds to this bank account in accordance with the Terms of Service."
                        />
                    </Grid>
                </Grid>

                <Button variant="contained" color="primary" size="large" onClick={handleSubmit} sx={{ mt: 4, borderRadius: 3 }}>
                    Save Profile
                </Button>

                <Snackbar
                    open={successMessageOpen}
                    autoHideDuration={3000}
                    onClose={() => setSuccessMessageOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={() => setSuccessMessageOpen(false)} severity="success" sx={{ width: '100%' }}>
                        Profile saved successfully!
                    </Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
};

export default UIUserProfilePage;
