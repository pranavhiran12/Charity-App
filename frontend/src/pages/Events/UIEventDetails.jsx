import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import EventOverview from '../../components/EventDetails/EventOverview';

import InvitationActions from '../../components/EventDetails/InvitationActions';
import InviteOneForm from '../../components/EventDetails/InviteOneForm';
import GuestListTable from '../../components/EventDetails/GuestListTable';
import AddContactForm from '../../components/EventDetails/AddContactForm';
import UniversalContactsDialog from '../../components/EventDetails/UniversalContactsDialog';
import ConfirmDeleteDialog from '../../components/EventDetails/ConfirmDeleteDialog';
import Snackbars from '../../components/EventDetails/Snackbars';

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
        //setWhatsAppLink: ''
    });

    const setField = (field, value) => setState(prev => ({ ...prev, [field]: value }));

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        (async () => {
            try {
                const eventData = await fetchEventById(eventId);
                setField('event', eventData);
            } catch (err) {
                console.error("Error fetching event:", err);
            }
            fetchContacts();
        })();

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
            console.log("Generated inviteCode:", inviteCode); // <-- should NOT be null

            if (!inviteCode) {
                setField('errorMessage', 'Failed to generate WhatsApp invite link.');
                return;
            }

            const displayUrl = `${window.location.origin}/invite/${inviteCode}`;
            const msg = encodeURIComponent(
                `Hi ${contact.name}, you're invited to ${state.event.eventTitle}! Join here: ${displayUrl}`
            );
            const phone = contact.mobile.replace(/[^0-9]/g, '');
            const link = `https://wa.me/${phone}?text=${msg}`;

            window.open(link, '_blank');
            setField('whatsAppLink', displayUrl); // ✅ Store the final URL
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

    return (
        <Box sx={{ p: { xs: 2, sm: 4, md: 6 }, maxWidth: 1000, mx: 'auto' }}>
            <EventOverview event={state.event} />
            <InvitationActions {...{ handleInvite, setField, loadUniversalContacts }} state={state} />
            {state.showInviteForm && <InviteOneForm {...{ state, setField, submitInviteGuest }} />}
            <GuestListTable {...{ state, sendWhatsAppMessage, sendEmailInvite, setField }} />
            <AddContactForm {...{ state, handleAdd, setField }} />
            <ConfirmDeleteDialog {...{ state, setField, handleDeleteConfirmed }} />
            <UniversalContactsDialog {...{ state, setField, loadUniversalContacts, handleAddFromUniversal }} />
            <Snackbars {...{ state, setField }} />
        </Box>
    );
};

export default UIEventDetails;
