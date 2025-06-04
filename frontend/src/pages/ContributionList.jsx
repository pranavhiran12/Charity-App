import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ContributionList() {
    const { eventId } = useParams();
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContributions = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/contributions/event/${eventId}`);
                console.log("🎯 Contributions fetched:", res.data);
                setContributions(res.data);
            } catch (err) {
                console.error("❌ Error loading contributions", err);
            } finally {
                setLoading(false);
            }
        };

        fetchContributions();
    }, [eventId]);

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">🎖️ Top Contributors</h2>

            {loading ? (
                <p className="text-center text-gray-600">Loading contributions...</p>
            ) : contributions.length === 0 ? (
                <p className="text-center text-gray-500">No contributions yet for this event.</p>
            ) : (
                <ul className="space-y-4">
                    {contributions.map((c, i) => (
                        <li key={c._id} className="border p-4 rounded shadow-sm bg-gray-50">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">
                                    {i + 1}. {c.name || c.guestId?.name || 'Anonymous'}
                                </span>
                                <span className="font-bold text-green-600">₹{c.amount}</span>
                            </div>
                            {c.message && (
                                <p className="text-sm text-gray-600 mt-1">💬 "{c.message}"</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
