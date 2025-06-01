import { useState } from 'react';
import axios from 'axios';

export default function SendInvitationForm() {
    const [eventId, setEventId] = useState('');
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    const handleSend = async () => {

        const token = localStorage.getItem('token'); // ✅ Add token from localStorage
        if (!token) {
            setResponse('User not logged in.');
            return;
        }



        try {
            const res = await axios.post(`http://localhost:5000/invitations/send/${eventId}`, { message });
            setResponse(res.data.message);
        } catch (err) {
            setResponse(err.response?.data?.error || 'Server error');
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-4">Send Invitations</h2>
            <input
                className="border p-2 w-full mb-2"
                placeholder="Event ID"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
            />
            <textarea
                className="border p-2 w-full mb-2"
                placeholder="Invitation message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">
                Send Invitations
            </button>
            {response && <p className="mt-2">{response}</p>}
        </div>
    );
}
