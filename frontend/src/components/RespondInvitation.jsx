import { useState } from 'react';
import axios from 'axios';

export default function RespondInvitation() {
    const [token, setToken] = useState('');
    const [attending, setAttending] = useState(true);
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    const respond = async () => {
        try {
            const res = await axios.post(`http://localhost:5000/invitations/respond/${token}`, {
                attending,
                message,
            });
            setResponse(res.data.message);
        } catch (err) {
            setResponse(err.response?.data?.error || 'Server error');
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-4">Respond to Invitation</h2>
            <input
                className="border p-2 w-full mb-2"
                placeholder="Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
            />
            <textarea
                className="border p-2 w-full mb-2"
                placeholder="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <select
                className="border p-2 w-full mb-2"
                value={attending}
                onChange={(e) => setAttending(e.target.value === 'true')}
            >
                <option value="true">Attending</option>
                <option value="false">Not Attending</option>
            </select>
            <button onClick={respond} className="bg-purple-600 text-white px-4 py-2 rounded">
                Submit RSVP
            </button>
            {response && <p className="mt-2">{response}</p>}
        </div>
    );
}
