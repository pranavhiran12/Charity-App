// src/api/eventDetailsApi.js
import API from './axios';


// ------------------ Auth -------------------

export const fetchEventsWithAuth = () =>
    API.get(`/events`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }).then(res => res.data);



// ------------------ Events ------------------
export const fetchAllEvents = () =>
    API.get(`/events`).then(res => res.data);


export const fetchEventById = (eventId) =>
    API.get(`/events/${eventId}`).then(res => res.data);

export const updateEventById = (eventId, data) =>
    API.put(`/events/${eventId}`, data).then(res => res.data);



// ------------------ Guests ------------------
export const fetchEventGuests = (eventId) =>
    API.get(`/guests?eventId=${eventId}`).then(res => res.data);

export const addGuest = (data) =>
    API.post(`/guests`, data).then(res => res.data);

export const deleteGuestById = (guestId) =>
    API.delete(`/guests/${guestId}`);

// ------------------ Contacts ------------------
export const addToContactList = (data) =>
    API.post(`/contacts`, data);

export const fetchUniversalContacts = (query = '') =>
    API.get(`/contacts?q=${query}`).then(res =>
        Array.isArray(res.data.contacts) ? res.data.contacts : res.data
    );

// ------------------ Invitations ------------------

export const fetchInvitationByCode = (code) =>
    API.get(`/invitations/${code}`).then(res => res.data);



export const respondToInvitation = (code, status) =>
    API.put(`/invitations/${code}/respond`, { status }).then(res => res.data.invitation);


export const sendBulkInvitations = (eventId) =>
    API.post(`/invitations/send/${eventId}`)
    .then(res =>
        res.data.map(i => `http://localhost:5173/invite/${i.invitationCode}`)
    );

export const generateInvitationLink = async(guestId, eventId) => {
    try {
        const res = await API.post(`/invitations/autolink`, { guestId, eventId });
        console.log("🔍 Response from /autolink:", res.data);

        const code = res && res.data && res.data.invitationCode;

        if (!code) {
            console.warn("⚠️ No invitationCode found in response", res.data);
            return null;
        }

        return code;
    } catch (err) {
        console.error("❌ Error generating invitation link:", err);
        return null;
    }
};