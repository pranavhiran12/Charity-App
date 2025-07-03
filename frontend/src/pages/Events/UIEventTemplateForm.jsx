import React, { useState } from 'react';
import {
    Box, Button, TextField, MenuItem, Typography, Grid, InputAdornment
} from '@mui/material';
//import axios from 'axios';
import CharitySelector from '../Charity/CharitySelector'; // Import CharitySelector component
// Remove: import axios from 'axios';
import { createEvent } from '../../api/eventApi'; // Adjust path as needed

import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';

import CircularProgress from '@mui/material/CircularProgress';
import './UIEventTemplateForm.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';




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
        eventDescription: "Join us to celebrate Aarav's birthday!",
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

const steps = [
    'Basic Info',
    'Date & Venue',
    'Gift & Charity',
    'Event Image'
];

function getStep(form) {
    if (!form.childName || !form.eventTitle || !form.eventDescription) return 0;
    if (!form.eventDate || !form.time || !form.venue) return 1;
    if (!form.giftName || !form.charity.name) return 2;
    return 3;
}

const EventTemplateForm = () => {
    const [templateKey, setTemplateKey] = useState('blank');
    const [form, setForm] = useState(templates['blank']);
    //const [message, setMessage] = useState('');

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [createdEvent, setCreatedEvent] = useState(null);


    const navigate = useNavigate();

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

    const validateForm = () => {
        const newErrors = {};

        if (!form.childName) newErrors.childName = 'Child name is required';
        if (!form.eventTitle) newErrors.eventTitle = 'Event title is required';
        if (!form.eventDate) newErrors.eventDate = 'Date is required';
        if (!form.time) newErrors.time = 'Time is required';
        if (!form.venue) newErrors.venue = 'Venue is required';
        if (!form.giftName) newErrors.giftName = 'Gift name is required';
        if (!form.totalTargetAmount || form.totalTargetAmount <= 0)
            newErrors.totalTargetAmount = 'Target amount must be a positive number';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("❌ Please fix the form errors");
            return;
        }
        setLoading(true);
        try {
            const newEvent = await createEvent(form);
            setCreatedEvent(newEvent);
            setSuccess(true);
            toast.success("🎉 Event created successfully!");
            setTimeout(() => {
                navigate(`/dashboard2/event/${newEvent._id}`);
            }, 1800);
        } catch (error) {
            console.error('Create event error:', error.message);
            toast.error("❌ Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="ui-event-template-bg">
            {success && (
                <div className="ui-event-template-success-overlay">
                    <div className="ui-event-template-success-check">
                        <CheckCircleIcon style={{ fontSize: 56 }} />
                    </div>
                    <div className="ui-event-template-success-message">Event Created!</div>
                    {createdEvent && (
                        <div className="ui-event-template-success-summary">
                            <div><b>{createdEvent.eventTitle}</b></div>
                            <div>{createdEvent.eventDate} at {createdEvent.time}</div>
                            <div>{createdEvent.venue}</div>
                        </div>
                    )}
                </div>
            )}
            <Box className="ui-event-template-form">
                {/* Progress Bar */}
                <div className="ui-event-template-progress">
                    {steps.map((label, idx) => (
                        <div
                            key={label}
                            className={
                                'ui-event-template-progress-step' +
                                (getStep(form) > idx ? ' completed' : getStep(form) === idx ? ' active' : '')
                            }
                            title={label}
                        />
                    ))}
                </div>
                <Typography variant="h5" gutterBottom fontWeight="bold" className="ui-event-template-title">Create Event from Template</Typography>
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
                <div className="ui-event-template-section">Basic Info</div>
                <hr className="ui-event-template-divider" />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Child Name" name="childName" value={form.childName} onChange={handleChange} fullWidth error={!!errors.childName}
                            helperText={errors.childName}
                            InputProps={{
                                endAdornment: form.childName ? (
                                    <CheckCircleIcon className="ui-event-template-valid-icon" />
                                ) : null
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Event Title" name="eventTitle" value={form.eventTitle} onChange={handleChange} fullWidth error={!!errors.eventTitle}
                            helperText={errors.eventTitle}
                            InputProps={{
                                endAdornment: form.eventTitle ? (
                                    <CheckCircleIcon className="ui-event-template-valid-icon" />
                                ) : null
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Description" name="eventDescription" value={form.eventDescription} onChange={handleChange} fullWidth error={!!errors.eventDescription}
                            helperText={errors.eventDescription}
                            InputProps={{
                                endAdornment: form.eventDescription ? (
                                    <CheckCircleIcon className="ui-event-template-valid-icon" />
                                ) : null
                            }}
                        />
                    </Grid>
                </Grid>
                <div className="ui-event-template-section">Date & Venue</div>
                <hr className="ui-event-template-divider" />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField label="Date" name="eventDate" type="date" value={form.eventDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.eventDate}
                            helperText={errors.eventDate}
                            InputProps={{
                                endAdornment: form.eventDate ? (
                                    <CheckCircleIcon className="ui-event-template-valid-icon" />
                                ) : null
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Time" name="time" type="time" value={form.time} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.time}
                            helperText={errors.time}
                            InputProps={{
                                endAdornment: form.time ? (
                                    <CheckCircleIcon className="ui-event-template-valid-icon" />
                                ) : null
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Venue" name="venue" value={form.venue} onChange={handleChange} fullWidth error={!!errors.venue}
                            helperText={errors.venue}
                            InputProps={{
                                endAdornment: form.venue ? (
                                    <CheckCircleIcon className="ui-event-template-valid-icon" />
                                ) : null
                            }}
                        />
                    </Grid>
                </Grid>
                <div className="ui-event-template-section">Gift & Charity
                    <span className="ui-event-template-tooltip" tabIndex={0}>
                        <InfoOutlinedIcon fontSize="small" style={{ marginLeft: 4, verticalAlign: 'middle' }} />
                        <span className="ui-event-template-tooltip-text">
                            Specify the gift and select a charity for this event. Charity info is auto-filled after selection.
                        </span>
                    </span>
                </div>
                <hr className="ui-event-template-divider" />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField label="Gift Name" name="giftName" value={form.giftName} onChange={handleChange} fullWidth error={!!errors.giftName}
                            helperText={errors.giftName}
                            InputProps={{
                                endAdornment: form.giftName ? (
                                    <CheckCircleIcon className="ui-event-template-valid-icon" />
                                ) : null
                            }}
                        />
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
                </Grid>
                <div className="ui-event-template-section">Event Image
                    <span className="ui-event-template-tooltip" tabIndex={0}>
                        <InfoOutlinedIcon fontSize="small" style={{ marginLeft: 4, verticalAlign: 'middle' }} />
                        <span className="ui-event-template-tooltip-text">
                            Paste a direct image URL to preview your event image instantly.
                        </span>
                    </span>
                </div>
                <hr className="ui-event-template-divider" />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Event Image URL"
                            name="eventImage"
                            value={form.eventImage}
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                endAdornment: form.eventImage && form.eventImage.startsWith('http') ? (
                                    <CheckCircleIcon className="ui-event-template-valid-icon" />
                                ) : null
                            }}
                        />
                    </Grid>
                    {form.eventImage && form.eventImage.startsWith('http') && (
                        <Grid item xs={12}>
                            <img src={form.eventImage} alt="Event Preview" className="ui-event-template-image-preview" />
                        </Grid>
                    )}
                </Grid>
                <Button
                    variant="contained"
                    className="ui-event-template-save-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                    {loading ? 'Saving...' : 'SAVE EVENT'}
                </Button>
            </Box>
        </Box>
    );
};

export default EventTemplateForm;
