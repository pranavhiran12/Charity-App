import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

import { Box, Typography, TextField, IconButton, Tooltip, Button, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import EventOverview from '../../components/EventDetails/EventOverview';
import InvitationActions from '../../components/EventDetails/InvitationActions';
import InviteOneForm from '../../components/EventDetails/InviteOneForm';
import GuestListTable from '../../components/EventDetails/GuestListTable';
import AddContactForm from '../../components/EventDetails/AddContactForm';
import UniversalContactsDialog from '../../components/EventDetails/UniversalContactsDialog';
import ConfirmDeleteDialog from '../../components/EventDetails/ConfirmDeleteDialog';
import Snackbars from '../../components/EventDetails/Snackbars';
import Sidebar from '../../components/Sidebar';

import {
    fetchEventById,
    fetchEventGuests,
    addGuest,
    addToContactList,
    deleteGuestById,
    sendBulkInvitations,
    generateInvitationLink,
    fetchUniversalContacts
} from '../../api/eventDetailsApi';

import styles from './UIEventDetails.module.css';

const UIEventDetails = () => {
    const { id: eventId } = useParams();
    const navigate = useNavigate();
    const [state, setState] = useState({
        event: null,
        contacts: [],
        form: { name: '', email: '', mobile: '' },
        openDialog: false,
        deleteId: null,
        loading: false,
        successMessage: '',
        errorMessage: '',
        showInviteForm: false,
        inviteGuestForm: { name: '', email: '', mobile: '' },
        universalContactsDialog: false,
        universalContacts: [],
        searchUniversal: '',
        whatsAppLink: '',
        publicInviteCode: '',
    });

    const setField = (field, value) => setState(prev => ({ ...prev, [field]: value }));

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const initialize = async () => {
            try {
                const eventData = await fetchEventById(eventId);
                setField('event', eventData);
            } catch (err) {
                console.error("Error initializing event details:", err);
                setField('errorMessage', 'Failed to load event');
            }

            fetchContacts();
        };

        initialize();
        const interval = setInterval(fetchContacts, 5000);
        return () => clearInterval(interval);
    }, [eventId, navigate]);

    const fetchContacts = async () => {
        try {
            const data = await fetchEventGuests(eventId);
            setField('contacts', data);
        } catch (err) {
            console.error('Error fetching contacts:', err);
        }
    };

    const handleAdd = async () => {
        const { name, email, mobile } = state.form;
        if (!name.trim() || !email.trim() || !mobile.trim()) return alert("All fields are required.");

        setField('loading', true);
        try {
            await addGuest({ ...state.form, eventId });
            await addToContactList({ name, email, mobile });
            setState(prev => ({
                ...prev,
                successMessage: `${name} added to event and your contact list.`,
                form: { name: '', email: '', mobile: '' }
            }));
        } catch (err) {
            console.error('Error adding contact:', err);
            setField('errorMessage', "Failed to save contact.");
        } finally {
            setField('loading', false);
        }
    };

    const handleDeleteConfirmed = async () => {
        try {
            await deleteGuestById(state.deleteId);
            setField('contacts', state.contacts.filter(c => c._id !== state.deleteId));
        } catch (err) {
            console.error('Error deleting contact:', err);
        } finally {
            setState(prev => ({ ...prev, openDialog: false, deleteId: null }));
        }
    };

    const handleInvite = async () => {
        try {
            const links = await sendBulkInvitations(eventId);
            await navigator.clipboard.writeText(links.join('\n'));
            setField('successMessage', "Invitations sent & links copied to clipboard!");
        } catch (err) {
            console.error("Invitation error:", err);
            setField('errorMessage', "Failed to send invitations.");
        }
    };

    const sendWhatsAppMessage = async (contact) => {
        try {
            if (!contact?._id || !eventId) {
                console.warn("Missing guestId or eventId", contact, eventId);
                setField('errorMessage', 'Invalid contact or event ID');
                return;
            }

            const inviteCode = await generateInvitationLink(contact._id, eventId);
            if (!inviteCode) {
                setField('errorMessage', 'Failed to generate WhatsApp invite link.');
                return;
            }

            const displayUrl = `${window.location.origin}/invite/${inviteCode}`;
            const msg = encodeURIComponent(`Hi ${contact.name}, you're invited to ${state.event.eventTitle}! Join here: ${displayUrl}`);
            const phone = contact.mobile.replace(/[^0-9]/g, '');
            const link = `https://wa.me/${phone}?text=${msg}`;

            window.open(link, '_blank');
            setField('whatsAppLink', displayUrl);
        } catch (err) {
            console.error("WhatsApp invite failed:", err);
            setField('errorMessage', 'WhatsApp invite failed.');
        }
    };

    const sendEmailInvite = async (contact) => {
        try {
            const inviteCode = await generateInvitationLink(contact._id, eventId);
            if (!inviteCode) {
                setField('errorMessage', 'Failed to generate email invite link.');
                return;
            }

            const subject = encodeURIComponent(`You're Invited to ${state.event.eventTitle}`);
            const body = encodeURIComponent(`Hi ${contact.name},\n\nYou're invited to ${state.event.eventTitle}! Click the link to view: http://localhost:5173/invite/${inviteCode}`);
            window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
        } catch (err) {
            console.error("Email invite failed:", err);
            setField('errorMessage', 'Email invite failed.');
        }
    };

    const submitInviteGuest = async () => {
        try {
            const guest = await addGuest({ ...state.inviteGuestForm, eventId });
            await generateInvitationLink(guest._id, eventId);
            setState(prev => ({
                ...prev,
                successMessage: 'Invitation sent successfully!',
                inviteGuestForm: { name: '', email: '', mobile: '' },
                showInviteForm: false
            }));
        } catch (err) {
            console.error('Error:', err);
            setField('errorMessage', 'Failed to send invitation.');
        }
    };

    const loadUniversalContacts = async (query = '') => {
        try {
            const data = await fetchUniversalContacts(query);
            setField('universalContacts', data);
        } catch (err) {
            console.error("Failed to load universal contacts:", err);
        }
    };

    const handleAddFromUniversal = async (contact) => {
        try {
            await addGuest({ name: contact.name, email: contact.email, mobile: contact.mobile, eventId });
            setState(prev => ({
                ...prev,
                successMessage: `${contact.name} added to event.`,
                universalContactsDialog: false
            }));
        } catch (err) {
            console.error("Error adding from universal:", err);
            setField('errorMessage', "Failed to add contact from universal list.");
        }
    };

    const inviteLink = state.publicInviteCode ? `${window.location.origin}/invite/${state.publicInviteCode}` : '';

    const generatePublicInviteLink = async () => {
        try {
            setField('loading', true);
            const publicInviteCode = await generateInvitationLink(null, eventId);

            if (publicInviteCode) {
                console.log("✅ Public Invite Code:", publicInviteCode);
                setField('publicInviteCode', publicInviteCode);
                setField('successMessage', 'Public invitation link generated successfully!');
            } else {
                console.warn("❌ No public invite code received.");
                setField('errorMessage', 'Failed to generate public invitation link');
            }
        } catch (err) {
            console.error("Error generating public invitation link:", err);
            setField('errorMessage', 'Failed to generate public invitation link');
        } finally {
            setField('loading', false);
        }
    };

    return (
        <Box className={styles.eventDetailsBg} sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar Navigation */}
            <Box sx={{ width: { xs: 70, sm: 220 }, flexShrink: 0 }}>
                <Sidebar />
            </Box>
            {/* Main Content */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', px: { xs: 1, sm: 2, md: 4 }, pt: 4 }}>
                {/* Elegant Header */}
                <div className={styles.eventDetailsHeader}>
                    <span className={styles.eventDetailsTitle}>Event Details</span>
                </div>
                <Box className={styles.eventDetailsCard}>
                    <EventOverview event={state.event} />
                    {/* Invite Link Section */}
                    <Box className={styles.section}>
                        <Typography className={styles.sectionTitle} variant="h6" fontWeight={500} gutterBottom>
                            Public Invitation Link
                        </Typography>
                        {!state.publicInviteCode && (
                            <Box mb={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={generatePublicInviteLink}
                                    disabled={state.loading}
                                    startIcon={state.loading ? <CircularProgress size={20} /> : null}
                                >
                                    {state.loading ? 'Generating...' : 'Generate Public Invitation Link'}
                                </Button>
                            </Box>
                        )}
                        <Box display="flex" alignItems="center" gap={2}>
                            <TextField
                                label="Invite Link"
                                variant="outlined"
                                value={inviteLink || 'No public link generated yet'}
                                InputProps={{ readOnly: true }}
                                fullWidth
                                error={!inviteLink}
                                helperText={!inviteLink ? 'Click "Generate Public Invitation Link" to create a shareable link.' : ''}
                            />
                            <Tooltip title={inviteLink ? "Copy Link" : "No link to copy"}>
                                <span>
                                    <IconButton
                                        onClick={() => navigator.clipboard.writeText(inviteLink)}
                                        disabled={!inviteLink}
                                        className={styles.copyButton}
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Box>
                        {/* QR Code Section */}
                        {inviteLink && (
                            <Box className={styles.qrSection}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Scan to open invite
                                </Typography>
                                <Box className={styles.qrBox}>
                                    <QRCodeCanvas value={inviteLink} size={180} />
                                </Box>
                            </Box>
                        )}
                    </Box>
                    {/* Other Functional Sections */}
                    <Box className={styles.section}>
                        <InvitationActions {...{ handleInvite, setField, loadUniversalContacts }} state={state} />
                    </Box>
                    {state.showInviteForm && (
                        <Box className={styles.section}>
                            <InviteOneForm {...{ state, setField, submitInviteGuest }} />
                        </Box>
                    )}
                    <Box className={styles.section}>
                        <GuestListTable {...{ state, sendWhatsAppMessage, sendEmailInvite, setField }} />
                    </Box>
                    <Box className={styles.section}>
                        <AddContactForm {...{ state, handleAdd, setField }} />
                    </Box>
                    <ConfirmDeleteDialog {...{ state, setField, handleDeleteConfirmed }} />
                    <UniversalContactsDialog {...{ state, setField, loadUniversalContacts, handleAddFromUniversal }} />
                    <Snackbars {...{ state, setField }} />
                </Box>
            </Box>
        </Box>
    );
};

export default UIEventDetails;