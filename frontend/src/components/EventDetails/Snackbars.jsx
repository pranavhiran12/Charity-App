import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const Snackbars = ({ state, setField }) => {
    const { successMessage, errorMessage, whatsAppLink } = state;

    return (
        <>
            {/* ✅ Success Snackbar */}
            <Snackbar
                open={!!successMessage}
                autoHideDuration={3000}
                onClose={() => setField('successMessage', '')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" onClose={() => setField('successMessage', '')}>
                    {successMessage}
                </Alert>
            </Snackbar>

            {/* ❌ Error Snackbar */}
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={3000}
                onClose={() => setField('errorMessage', '')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="error" onClose={() => setField('errorMessage', '')}>
                    {errorMessage}
                </Alert>
            </Snackbar>

            {/* 📱 WhatsApp Link Snackbar */}
            <Snackbar
                open={!!whatsAppLink}
                autoHideDuration={6000}
                onClose={() => setField('whatsAppLink', '')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="info" onClose={() => setField('whatsAppLink', '')}>
                    WhatsApp link:&nbsp;
                    <a
                        href={whatsAppLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'underline' }}
                    >
                        {whatsAppLink}
                    </a>
                </Alert>
            </Snackbar>
        </>
    );
};

export default Snackbars;
