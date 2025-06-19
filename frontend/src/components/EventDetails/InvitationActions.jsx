import React from 'react';
import { Stack, Button } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const InvitationActions = ({ handleInvite, setField, loadUniversalContacts, state }) => {
    const handleToggleInviteForm = () => {
        setField('showInviteForm', !state.showInviteForm);
    };

    const openUniversalContacts = () => {
        loadUniversalContacts(); // Initial fetch
        setField('universalContactsDialog', true);
    };

    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4}>
            <Button
                variant="contained"
                color="success"
                onClick={handleInvite}
                fullWidth
            >
                📤 Send Bulk Invitations
            </Button>
            <Button
                variant="outlined"
                color="info"
                onClick={handleToggleInviteForm}
                fullWidth
            >
                ✉️ Send Single Invitation
            </Button>
            <Button
                variant="outlined"
                color="secondary"
                onClick={openUniversalContacts}
                startIcon={<PersonAddAltIcon />}
                fullWidth
            >
                Add from Contact List
            </Button>
        </Stack>
    );
};

export default InvitationActions;
