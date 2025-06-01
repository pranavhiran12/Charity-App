import { useState } from 'react';
import axios from 'axios';

export default function OpenInvitation() {
    const [token, setToken] = useState('');
    const [data, setData] = useState(null);

    const openInvitation = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/invitations/open/${token}`);
            setData(res.data);
        } catch (err) {
            setData({ error: err.response?.data?.error || 'Invalid token' });
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-4">Open Invitation</h2>
            <input
                className="border p-2 w-full mb-2"
                placeholder="Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
            />
            <button onClick={openInvitation} className="bg-green-600 text-white px-4 py-2 rounded">
                Open
            </button>
            {data && <pre className="mt-2 bg-gray-100 p-2">{JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
}
