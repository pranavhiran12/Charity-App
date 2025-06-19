import React from 'react';
import {
    Typography,
    Stack,
    TextField,
    Button,
    Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const AddContactForm = ({ state, setField, handleAdd }) => {
    const { form, loading } = state;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setField('form', { ...form, [name]: value });
    };

    return (
        <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>➕ Add New Contact</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <TextField
                    name="name"
                    label="Name"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    name="email"
                    label="Email"
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    name="mobile"
                    label="Mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    fullWidth
                />
            </Stack>
            <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleAdd}
                disabled={loading}
            >
                Save Contact
            </Button>
        </>
    );
};

export default AddContactForm;
