import React, { useEffect, useState } from "react";
import axios from "axios";

export default function GuestList({ eventId }) {
    const [guests, setGuests] = useState([]);

    const fetchGuests = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/guests/event/${eventId}`);
            setGuests(res.data);
        } catch (err) {
            console.error("Error fetching guests:", err);
        }
    };

    useEffect(() => {
        fetchGuests();
    }, [eventId]);

    if (!guests.length) return <p>No contributions yet.</p>;

    return (
        <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold mb-4">🎁 Guest Contributions</h2>
            <ul className="divide-y">
                {guests.map((guest) => (
                    <li key={guest._id} className="py-2">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-bold">{guest.name}</p>
                                {guest.message && <p className="italic text-sm">{guest.message}</p>}
                            </div>
                            <p className="text-green-600 font-bold">₹{guest.contributionAmount || 0}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
