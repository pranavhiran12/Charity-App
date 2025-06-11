import React, { useEffect, useState } from "react";
import axios from "axios";

const RSVPStatusCounter = ({ eventId }) => {
    const [counts, setCounts] = useState({ Accepted: 0, Declined: 0, Pending: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/guests/${eventId}/rsvp-count`);
                setCounts(res.data);
            } catch (err) {
                console.error("Error fetching RSVP counts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, [eventId]);

    if (loading) return <div>Loading RSVP stats...</div>;

    return (
        <div className="mt-4">
            <div className="bg-gray-100 p-4 rounded-xl shadow-sm flex justify-around items-center">
                <div className="text-center">
                    <div className="text-green-700 text-lg font-bold">{counts.Accepted}</div>
                    <div className="text-sm text-gray-600">Accepted ✅</div>
                </div>
                <div className="text-center">
                    <div className="text-red-600 text-lg font-bold">{counts.Declined}</div>
                    <div className="text-sm text-gray-600">Declined ❌</div>
                </div>
                <div className="text-center">
                    <div className="text-yellow-600 text-lg font-bold">{counts.Pending}</div>
                    <div className="text-sm text-gray-600">Pending ⏳</div>
                </div>
            </div>
        </div>
    );
};

export default RSVPStatusCounter;
