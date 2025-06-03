import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewGuests = () => {
    const { eventId } = useParams();
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        console.log("Event ID:", eventId); // Debug line
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
                            <th className="p-2 border">RSVP</th>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ViewGuests;
