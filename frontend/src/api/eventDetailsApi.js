// src/api/eventDetailsApi.js
import axios from 'axios';

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const fetchEventById = (eventId) =>
    axios.get(`http://localhost:5000/api/events/${eventId}`, getAuthHeaders()).then(res => res.data);

export const fetchEventGuests = (eventId) =>
    axios.get(`http://localhost:5000/api/guests?eventId=${eventId}`, getAuthHeaders()).then(res => res.data);

export const addGuest = (data) =>
    axios.post(`http://localhost:5000/api/guests`, data, getAuthHeaders()).then(res => res.data);

export const addToContactList = (data) =>
    axios.post(`http://localhost:5000/api/contacts`, data, getAuthHeaders());

export const deleteGuestById = (guestId) =>
    axios.delete(`http://localhost:5000/api/guests/${guestId}`, getAuthHeaders());

export const sendBulkInvitations = (eventId) =>
    axios.post(`http://localhost:5000/invitations/send/${eventId}`, {}, getAuthHeaders())
    .then(res => res.data.map(i => `http://localhost:5173/invite/${i.invitationCode}`));

export const generateInvitationLink = async(guestId, eventId) => {
    try {
        const res = await axios.post(
            `http://localhost:5000/invitations/autolink`, { guestId, eventId },
            getAuthHeaders()
        );
        return (res.data && res.data.invitationCode) ? res.data.invitationCode : guestId.slice(-6);
    } catch (err) {
        console.error("Error generating invitation link:", err);
        return guestId.slice(-6); // Fallback in case of failure
    }
};


export const fetchUniversalContacts = (query = '') =>
    axios.get(`http://localhost:5000/api/contacts?q=${query}`, getAuthHeaders())
    .then(res => Array.isArray(res.data.contacts) ? res.data.contacts : res.data);