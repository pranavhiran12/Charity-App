import React, { useState } from 'react';
import {
    Box, Button, TextField, MenuItem, Typography, Grid, InputAdornment
} from '@mui/material';
import axios from 'axios';
import CharitySelector from '../Charity/CharitySelector'; // Import CharitySelector component
// Remove: import axios from 'axios';
import { createEvent } from '../../api/eventApi'; // Adjust path as needed


const templates = {
    blank: {
        childName: '',
        eventTitle: '',
        eventDescription: '',
        eventDate: '',
        time: '',
        venue: '',
        giftName: '',
        charity: {
            name: '',
            description: '',
            charityId: ''
        },
        totalTargetAmount: '',
        splitPercentage: {
            gift: 50,
            charity: 50
        },
        eventImage: '',
        status: 'upcoming'
    },
    birthday: {
        childName: 'Aarav',
        eventTitle: "Aarav's 10th Birthday Bash",
        eventDescription: 'Join us to celebrate Aarav’s birthday!',
        eventDate: '',
        time: '',
        venue: 'Community Hall, Mumbai',
        giftName: 'LEGO Star Wars Set',
        charity: {
            name: 'Save The Children',
            description: 'Helping children in need',
            charityId: ''
        },
        totalTargetAmount: 10000,
        splitPercentage: {
            gift: 50,
            charity: 50
        },
        eventImage: 'https://example.com/image.jpg',
        status: 'upcoming'
    }
};

const EventTemplateForm = () => {
    const [templateKey, setTemplateKey] = useState('blank');
    const [form, setForm] = useState(templates['blank']);
    const [message, setMessage] = useState('');

    const handleTemplateChange = (e) => {
        const selected = e.target.value;
        setTemplateKey(selected);
        setForm(templates[selected]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('charity.')) {
            const field = name.split('.')[1];
            setForm({
                ...form,
                charity: {
                    ...form.charity,
                    [field]: value
                }
            });
        } else if (name.includes('splitPercentage.')) {
            const field = name.split('.')[1];
            setForm({
                ...form,
                splitPercentage: {
                    ...form.splitPercentage,
                    [field]: Number(value)
                }
            });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleCharitySelect = (charity) => {
        setForm({
            ...form,
            charity: {
                name: charity.name,
                description: charity.description,
                charityId: charity._id
            }
        });
    };

    const handleSubmit = async () => {
        try {
            console.log("Submitting event:", form);
            const newEvent = await createEvent(form);
            setMessage('✅ Event created successfully!');
            console.log("Created Event:", newEvent);
        } catch (error) {
            console.error('Create event error:', error.message);
            setMessage('❌ Failed to create event');
        }
    };

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', p: 4, boxShadow: 3, borderRadius: 3, bgcolor: 'white' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">Create Event from Template</Typography>

            <TextField
                select
                label="Choose Template"
                value={templateKey}
                onChange={handleTemplateChange}
                fullWidth
                margin="normal"
            >
                {Object.keys(templates).map((key) => (
                    <MenuItem key={key} value={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </MenuItem>
                ))}
            </TextField>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField label="Child Name" name="childName" value={form.childName} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Event Title" name="eventTitle" value={form.eventTitle} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Description" name="eventDescription" value={form.eventDescription} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Date" name="eventDate" type="date" value={form.eventDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Time" name="time" type="time" value={form.time} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Venue" name="venue" value={form.venue} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Gift Name" name="giftName" value={form.giftName} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <CharitySelector onSelect={handleCharitySelect} />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Charity Name"
                        name="charity.name"
                        value={form.charity.name}
                        fullWidth
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Charity ID"
                        name="charity.charityId"
                        value={form.charity.charityId}
                        fullWidth
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Charity Description"
                        name="charity.description"
                        value={form.charity.description}
                        fullWidth
                        InputProps={{ readOnly: true }}
                        multiline
                        minRows={2}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        label="Target Amount"
                        name="totalTargetAmount"
                        value={form.totalTargetAmount}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Gift %"
                        name="splitPercentage.gift"
                        type="number"
                        value={form.splitPercentage.gift}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Charity %"
                        name="splitPercentage.charity"
                        type="number"
                        value={form.splitPercentage.charity}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Event Image URL"
                        name="eventImage"
                        value={form.eventImage}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
            </Grid>

            <Button variant="contained" onClick={handleSubmit} sx={{ mt: 3, px: 4 }}>
                SAVE EVENT
            </Button>

            {message && (
                <Typography variant="body2" sx={{ mt: 2, color: message.includes('success') ? 'green' : 'red' }}>
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default EventTemplateForm;
