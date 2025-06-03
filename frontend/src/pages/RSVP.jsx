import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RSVP = () => {
    const { code } = useParams();
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        const fetchInvitation = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/invitations/${code}`);
                setInvitation(res.data);
            } catch (err) {
                console.error('RSVP error:', err);
                setResponseMessage('Invalid or expired invitation code.');
            } finally {
                setLoading(false);
            }
        };
        fetchInvitation();
    }, [code]);

    const handleRSVP = async (status) => {
        try {
            const res = await axios.post(`http://localhost:5000/invitations/rsvp/${code}`, {
                status,
            });
            setResponseMessage(`RSVP ${status} successfully.`);
            setInvitation(res.data.invitation);
        } catch (err) {
            console.error('RSVP error:', err);
            setResponseMessage('Failed to RSVP. Try again.');
        }
    };

    if (loading) return <div className="text-center p-4">Loading invitation...</div>;

    if (!invitation) return <div className="text-center p-4 text-red-500">{responseMessage}</div>;

    return (
        <div className="max-w-xl mx-auto p-6 shadow-lg rounded-lg mt-10 bg-white">
            <h2 className="text-2xl font-bold mb-4 text-center">You're Invited!</h2>

            <div className="mb-4">
                <p><strong>Guest:</strong> {invitation.guestId?.name || 'Guest'}</p>
                <p><strong>Event:</strong> {invitation.eventId?.title || 'Event'}</p>
                <p><strong>Status:</strong> {invitation.status}</p>
            </div>

            <div className="flex justify-center space-x-4">
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => handleRSVP('accepted')}
                >
                    Accept
                </button>
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleRSVP('declined')}
                >
                    Decline
                </button>
            </div>

            {responseMessage && (
                <div className="mt-4 text-center text-blue-600">{responseMessage}</div>
            )}
        </div>
    );
};

export default RSVP;
