import { useState } from 'react';
import axios from 'axios';

export default function SendInvitationForm({ eventId }) {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponse('');

        const token = localStorage.getItem('token');
        if (!token) {
            setResponse('❌ User not logged in.');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(
                `http://localhost:5000/invitations/send/${eventId}`,
                { message },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setResponse(`✅ ${res.data.message || 'Invitation sent successfully'}`);
            setMessage('');
        } catch (err) {
            console.error(err);
            setResponse(`❌ ${err.response?.data?.error || 'Server error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSend} className="p-4 max-w-lg mx-auto border rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Send Invitations</h2>

            <textarea
                className="border p-2 w-full mb-2 rounded"
                placeholder="Invitation message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
            />

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={loading}
            >
                {loading ? 'Sending...' : 'Send Invitation'}
            </button>

            {response && <p className="mt-2 text-sm">{response}</p>}
        </form>
    );
}
