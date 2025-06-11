import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewContributions = ({ eventId }) => {
    const [contributions, setContributions] = useState([]);

    useEffect(() => {
        const fetchContributions = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/contributions/event/${eventId}`);
                setContributions(res.data);
            } catch (err) {
                console.error('Error fetching contributions:', err);
            }
        };

        fetchContributions();
    }, [eventId]);

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 shadow rounded mt-6">
            <h2 className="text-xl font-semibold mb-4">All Contributions</h2>
            {contributions.length === 0 ? (
                <p>No contributions yet.</p>
            ) : (
                <ul className="space-y-4">
                    {contributions.map((contribution) => (
                        <li key={contribution._id} className="border p-4 rounded">
                            <p className="font-semibold">{contribution.guestId?.name}</p>
                            <p>💰 Amount: ${contribution.amount}</p>
                            {contribution.message && <p>📝 Message: {contribution.message}</p>}
                            <p className="text-sm text-gray-500">
                                Date: {new Date(contribution.contributedAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewContributions;
