import { useState, useEffect } from "react";
import axios from "axios";

export default function InviteGuest() {
    const [eventId, setEventId] = useState("");
    const [guest, setGuest] = useState({ name: "", email: "" });
    const [events, setEvents] = useState([]);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        axios.get("/api/events").then((res) => setEvents(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/guests/${eventId}`, guest);
            setSuccess("Invitation sent!");
            setGuest({ name: "", email: "" });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Invite a Guest</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    className="w-full border p-2 rounded"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    required
                >
                    <option value="">Select Event</option>
                    {events.map((e) => (
                        <option key={e._id} value={e._id}>
                            {e.title}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Guest Name"
                    value={guest.name}
                    onChange={(e) => setGuest({ ...guest, name: e.target.value })}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="email"
                    placeholder="Guest Email"
                    value={guest.email}
                    onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                    className="w-full border p-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Send Invitation
                </button>
                {success && <p className="text-green-500 mt-2">{success}</p>}
            </form>
        </div>
    );
}
