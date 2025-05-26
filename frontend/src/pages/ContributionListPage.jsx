// src/pages/ContributionListPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';

const ContributionListPage = ({ eventId }) => {
    const [contributions, setContributions] = useState([]);

    useEffect(() => {
        const fetchContributions = async () => {
            const res = await api.get(`/contributions/${eventId}`);
            setContributions(res.data);
        };
        fetchContributions();
    }, [eventId]);

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">All Contributions</h2>
            <ul className="space-y-2">
                {contributions.map(c => (
                    <li key={c._id} className="bg-gray-100 p-3 rounded">
                        <p><strong>{c.guestName}</strong> (${c.amount})</p>
                        <p className="text-sm text-gray-600">{c.message}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContributionListPage;
