// src/pages/EventPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';

const EventPage = ({ eventId }) => {
    const [event, setEvent] = useState(null);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchEvent = async () => {
            const res = await api.get(`/events/${eventId}`);
            setEvent(res.data);
        };
        const fetchTotal = async () => {
            const res = await api.get(`/contributions/${eventId}/total`);
            setTotal(res.data.totalAmountRaised);
        };

        fetchEvent();
        fetchTotal();
    }, [eventId]);

    if (!event) return <p className="text-center">Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-2">{event.eventTitle}</h1>
            <p className="mb-2 text-gray-600">{event.eventDescription}</p>
            <p className="text-blue-600 font-semibold">Total Raised: ${total}</p>

            <h2 className="mt-6 text-xl font-semibold">Guest List</h2>
            <ul className="list-disc ml-6">
                {event.guestsInvited.map((guest, idx) => (
                    <li key={idx}>{guest.name} ({guest.email})</li>
                ))}
            </ul>
        </div>
    );
};

export default EventPage;
