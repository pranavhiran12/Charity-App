import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, Chip, IconButton, Stack
} from '@mui/material';

import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import DeleteIcon from '@mui/icons-material/Delete';

const GuestListTable = ({ state, sendWhatsAppMessage, sendEmailInvite, setField }) => {
    const { contacts } = state;

    const handleDeleteClick = (id) => {
        setField('deleteId', id);
        setField('openDialog', true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Accepted': return 'success';
            case 'Declined': return 'error';
            default: return 'warning';
        }
    };

    return (
        <>
            <Typography variant="h6" sx={{ mb: 2 }}>🎟️ Guest List</Typography>
            <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Mobile</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell align="center"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.map(contact => (
                            <TableRow key={contact._id} hover>
                                <TableCell>{contact.name}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.mobile}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={contact.status || "Pending"}
                                        color={getStatusColor(contact.status)}
                                        variant="outlined"
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <IconButton color="success" onClick={() => sendWhatsAppMessage(contact)}>
                                            <WhatsAppIcon />
                                        </IconButton>
                                        <IconButton color="primary" onClick={() => sendEmailInvite(contact)}>
                                            <EmailIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDeleteClick(contact._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                        {contacts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No contacts found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default GuestListTable;
