import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewGuests = () => {
    const { eventId } = useParams();
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGuests = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/guests/event/${eventId}`);
                setGuests(res.data);
            } catch (err) {
                console.error("Error fetching guests:", err);
                setError("Failed to load guests.");
            } finally {
                setLoading(false);
            }
        };

        fetchGuests();
    }, [eventId]);

    const handleDelete = async (guestId) => {
        if (!window.confirm("Are you sure you want to delete this guest and their invitation?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/guests/${guestId}`);
            setGuests(prev => prev.filter(g => g._id !== guestId));
            alert("Guest deleted successfully.");
        } catch (err) {
            console.error("Delete error:", err.response?.data || err.message);
            alert("Failed to delete guest.");
        }
    };

    if (loading) return <div className="p-6 text-center">Loading guests...</div>;
    if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">👥 Guests for This Event</h2>
            {guests.length === 0 ? (
                <p className="text-gray-600 text-center">No guests have RSVP'd yet.</p>
            ) : (
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">#</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guests.map((guest, index) => (
                            <tr key={guest._id} className="text-center">
                                <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">{guest.name}</td>
                                <td className="border p-2">{guest.email}</td>
                                <td className="border p-2">
                                    <span
                                        className={
                                            guest.rsvpStatus === "accepted"
                                                ? "text-green-600 font-semibold"
                                                : guest.rsvpStatus === "declined"
                                                    ? "text-red-600 font-semibold"
                                                    : "text-yellow-600 font-semibold"
                                        }
                                    >
                                        {guest.rsvpStatus || "pending"}
                                    </span>
                                </td>
                                <td className="border p-2">
                                    <button
                                        className="bg-blue-600 text-green-300 px-4 py-2 rounded hover:bg-blue-700"
                                        onClick={() => handleDelete(guest._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ViewGuests;
