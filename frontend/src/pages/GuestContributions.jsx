import { useEffect, useState } from "react";
import axios from "axios";

export default function GuestContributions({ guestId }) {
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContributions = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/contributions/guest/${guestId}`);
                setContributions(res.data);
            } catch (error) {
                console.error("Failed to fetch contributions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContributions();
    }, [guestId]);

    if (loading) return <div className="text-center mt-8">Loading contributions...</div>;

    return (
        <div className="max-w-2xl mx-auto mt-8 p-4">
            <h2 className="text-xl font-semibold mb-4">Your Contributions</h2>

            {contributions.length === 0 ? (
                <p className="text-gray-600">No contributions found for this guest.</p>
            ) : (
                <ul className="space-y-4">
                    {contributions.map((contrib) => (
                        <li key={contrib._id} className="border p-4 rounded shadow-sm">
                            <p><strong>Event:</strong> {contrib.eventId?.title || "Unknown"}</p>
                            <p><strong>Date:</strong> {new Date(contrib.eventId?.date).toLocaleDateString()}</p>
                            <p><strong>Amount:</strong> ₹{contrib.amount}</p>
                            {contrib.message && (
                                <p><strong>Message:</strong> {contrib.message}</p>
                            )}
                            <p className="text-sm text-gray-500">
                                Contributed on {new Date(contrib.contributedAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
