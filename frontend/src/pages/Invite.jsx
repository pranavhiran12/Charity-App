// src/pages/Invite.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Invite = () => {
    const { invitationCode } = useParams();
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvitation = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/invitations/${invitationCode}`);
                setInvitation(res.data);
            } catch (err) {
                console.error(err);
                setError('Invitation not found.');
            } finally {
                setLoading(false);
            }
        };
        fetchInvitation();
    }, [invitationCode]);

    if (loading) return <div className="p-6">Loading invitation...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">🎉 You're Invited!</h1>
            <p className="mb-2"><strong>Event:</strong> {invitation.eventId.eventTitle}</p>
            <p className="mb-2"><strong>Hosted by:</strong> {invitation.eventId.host.name}</p>
            <p className="mb-2"><strong>Guest:</strong> {invitation.guestId.name}</p>

            <div className="mt-6 space-x-4">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => respondToInvitation('accepted')}
                >
                    ✅ Accept
                </button>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => respondToInvitation('declined')}
                >
                    ❌ Decline
                </button>
            </div>
        </div>
    );

    async function respondToInvitation(response) {
        try {
            await axios.put(`http://localhost:5000/invitations/${invitationCode}/respond`, {
                status: response
            });
            alert(`You have ${response === 'accepted' ? 'accepted' : 'declined'} the invitation.`);
            setInvitation({ ...invitation, status: response });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Error submitting RSVP.');
            navigate('/dashboard');
        }
    }
};

export default Invite;
