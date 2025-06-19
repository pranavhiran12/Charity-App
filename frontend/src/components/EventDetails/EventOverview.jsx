import React from 'react';
import { Box, Paper, Stack, Typography, Grid, Divider, Chip } from '@mui/material';

const EventOverview = ({ event }) => {
    if (!event) return null;

    return (
        <Paper elevation={6} sx={{ p: { xs: 3, sm: 4 }, mb: 5, borderRadius: 4, backgroundColor: '#fefefe' }}>
            <Stack spacing={3}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
                        🎉 {event.eventTitle}
                    </Typography>
                    <Divider />
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">👶 Child Name</Typography>
                        <Typography variant="body1">{event.childName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">🗕️ Date</Typography>
                        <Typography variant="body1">{new Date(event.eventDate).toLocaleDateString()}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">⏰ Time</Typography>
                        <Typography variant="body1">{event.time}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">📍 Venue</Typography>
                        <Typography variant="body1">{event.venue}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">📝 Description</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{event.eventDescription}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">🎁 Gift</Typography>
                        <Typography variant="body1">{event.giftName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">💰 Target Amount</Typography>
                        <Typography variant="body1">₹{event.totalTargetAmount}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">🔀 Split</Typography>
                        <Typography variant="body1">
                            🎁 {event.splitPercentage?.gift || 0}% &nbsp;| ❤️ {event.splitPercentage?.charity || 0}%
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">📌 Status</Typography>
                        <Chip label={event.status?.toUpperCase()} color="primary" variant="filled" />
                    </Grid>
                </Grid>

                {event.charity?.name && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Box>
                            <Typography variant="h6" color="secondary" gutterBottom>💖 Charity Information</Typography>
                            <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                            <Typography variant="body1">{event.charity.name}</Typography>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Description</Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{event.charity.description}</Typography>
                        </Box>
                    </>
                )}
            </Stack>
        </Paper>
    );
};

export default EventOverview;
