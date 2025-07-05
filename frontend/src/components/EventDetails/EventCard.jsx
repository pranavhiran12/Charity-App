import React from 'react';
import {
    Card, CardContent, Typography, Avatar, CardActions, Button, IconButton, Tooltip, Box
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete';

const EventCard = ({ event, stats, onView, onDelete }) => {
    const handleCardClick = (e) => {
        // Don't trigger if clicking on the delete button or its tooltip
        if (e.target.closest('[data-action="delete"]')) {
            return;
        }
        onView();
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation(); // Prevent card click
        onDelete();
    };

    return (
        <Card
            sx={{
                backdropFilter: 'blur(6px)',
                background: 'rgba(255, 255, 255, 0.92)',
                borderRadius: '24px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.10)',
                transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                height: '100%',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-6px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.13)',
                }
            }}
            aria-label={`Event card for ${event.eventTitle}`}
            onClick={handleCardClick}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        sx={{
                            width: 50,
                            height: 50,
                            mr: 2,
                            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                            color: '#fff',
                            boxShadow: 3
                        }}
                        aria-label="event icon"
                    >
                        <EventIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {event.eventTitle}
                    </Typography>
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 2,
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {event.eventDescription}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: '#6b7280' }} />
                    <Typography variant="body2">
                        {new Date(event.eventDate).toLocaleDateString()} at {event.time}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1, color: '#6b7280' }} />
                    <Typography variant="body2">{event.venue}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
                    <PeopleAltIcon fontSize="small" sx={{ mr: 1, color: '#6b7280' }} />
                    <Typography variant="body2">
                        Invited: {stats?.invited ?? 0}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DoneAllIcon fontSize="small" sx={{ mr: 1, color: '#10b981' }} />
                    <Typography variant="body2" sx={{ color: '#10b981' }}>
                        Accepted: {stats?.accepted ?? 0}
                    </Typography>
                </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                <Tooltip title="Delete this event">
                    <IconButton
                        onClick={handleDeleteClick}
                        color="error"
                        aria-label={`Delete ${event.eventTitle}`}
                        data-action="delete"
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            }
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
};

export default EventCard; 