import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Stack,
    Button
} from '@mui/material';

const InviteOneForm = ({ state, setField, submitInviteGuest }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setField('inviteGuestForm', {
            ...state.inviteGuestForm,
            [name]: value
        });
    };

    const handleCancel = () => {
        setField('showInviteForm', false);
        setField('inviteGuestForm', { name: '', email: '', mobile: '' });
    };

    return (
        <Box sx={{ mb: 4, p: 3, backgroundColor: '#f9f9f9', borderRadius: 3, border: '1px solid #ccc' }}>
            <Typography variant="h6" gutterBottom>Send One Invitation</Typography>
            <Stack spacing={2}>
                <TextField
                    name="name"
                    label="Name"
                    value={state.inviteGuestForm.name}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    name="email"
                    label="Email"
                    value={state.inviteGuestForm.email}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    name="mobile"
                    label="Mobile"
                    value={state.inviteGuestForm.mobile}
                    onChange={handleChange}
                    fullWidth
                />
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="contained" onClick={submitInviteGuest}>
                        Send
                    </Button>
                    <Button variant="outlined" onClick={handleCancel}>
                        Cancel
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default InviteOneForm;
