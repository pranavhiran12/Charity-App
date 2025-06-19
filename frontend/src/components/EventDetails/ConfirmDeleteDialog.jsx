import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from '@mui/material';

const ConfirmDeleteDialog = ({ state, setField, handleDeleteConfirmed }) => {
    const { openDialog } = state;

    return (
        <Dialog
            open={openDialog}
            onClose={() => setField('openDialog', false)}
        >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this contact? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setField('openDialog', false)}>Cancel</Button>
                <Button onClick={handleDeleteConfirmed} color="error" variant="contained">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;
