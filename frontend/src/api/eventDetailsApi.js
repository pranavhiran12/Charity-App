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

/*export const fetchGuestsForEvent = async(eventId) => {
    const res = await API.get(`/guests?eventId=${eventId}`);
    return res.data;
};*/


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

// eventDetailsApi.js
export const generateInvitationLink = async(guestId, eventId) => {
    try {
        const payload = {
            eventId: eventId,
            guestId: typeof guestId !== 'undefined' && guestId !== null ? guestId : null
        };

        console.log("📤 Sending payload to /autolink:", payload);

        const res = await API.post('/invitations/autolink', payload);

        if (res && res.data && res.data.invitationCode) {
            return res.data.invitationCode;
        }

        return null;

    } catch (err) {
        console.error("❌ Error generating invitation link:", (err.response && err.response.data) || err.message);
        return null;
    }
};

export const updateInvitationWithGuest = async(invitationCode, guestId) => {
    try {
        const res = await API.put(`/invitations/update-guest`, {
            invitationCode,
            guestId
        });
        return res.data;
    } catch (err) {
        console.error("❌ Failed to update invitation with guest:", (err.response && err.response.data) || err.message);

        throw err;
    }
};

// ------------------ Razorpay ------------------
export const createRazorpayOrder = async(data) => {
    try {
        const res = await API.post('/razorpay/create-order', data);
        return res.data;
    } catch (err) {
        console.error("❌ Failed to create Razorpay order:", err.response && err.response.data || err.message);
        throw err;
    }
};