import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, InputAdornment,
    Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';

const UniversalContactsDialog = ({ state, setField, loadUniversalContacts, handleAddFromUniversal }) => {
    const { universalContactsDialog, searchUniversal, universalContacts } = state;

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setField('searchUniversal', value);
        loadUniversalContacts(value);
    };

    return (
        <Dialog
            open={universalContactsDialog}
            onClose={() => setField('universalContactsDialog', false)}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>Select from Your Universal Contacts</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search contacts..."
                    value={searchUniversal}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        )
                    }}
                    sx={{ mb: 2 }}
                />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Mobile</TableCell>
                                <TableCell align="center">Add</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {universalContacts.map(contact => (
                                <TableRow key={contact._id}>
                                    <TableCell>{contact.name}</TableCell>
                                    <TableCell>{contact.email}</TableCell>
                                    <TableCell>{contact.mobile}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handleAddFromUniversal(contact)}
                                        >
                                            Add
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {universalContacts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">No contacts found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setField('universalContactsDialog', false)}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UniversalContactsDialog;
