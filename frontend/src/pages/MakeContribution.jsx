import { useState, useEffect } from "react";
import axios from "axios";

export default function MakeContribution() {
    const [events, setEvents] = useState([]);
    const [eventId, setEventId] = useState("");
    const [guests, setGuests] = useState([]);
    const [guestId, setGuestId] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState("gift");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        axios.get("/api/events").then((res) => setEvents(res.data));
    }, []);

    useEffect(() => {
        if (eventId) {
            axios.get(`/api/guests/event/${eventId}`).then((res) => setGuests(res.data));
        }
    }, [eventId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/contributions/${eventId}`, {
                guestId,
                amount,
                message: `[${type.toUpperCase()}] ${message}`,
            });
            setSuccess("Contribution submitted!");
            setAmount("");
            setMessage("");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Make a Contribution</h2>
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
                <select
                    className="w-full border p-2 rounded"
                    value={guestId}
                    onChange={(e) => setGuestId(e.target.value)}
                    required
                >
                    <option value="">Select Guest</option>
                    {guests.map((g) => (
                        <option key={g._id} value={g._id}>
                            {g.name} ({g.email})
                        </option>
                    ))}
                </select>
                <div className="flex space-x-2">
                    <label className="flex items-center space-x-1">
                        <input
                            type="radio"
                            name="type"
                            value="gift"
                            checked={type === "gift"}
                            onChange={() => setType("gift")}
                        />
                        <span>Gift</span>
                    </label>
                    <label className="flex items-center space-x-1">
                        <input
                            type="radio"
                            name="type"
                            value="charity"
                            checked={type === "charity"}
                            onChange={() => setType("charity")}
                        />
                        <span>Charity</span>
                    </label>
                </div>
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Message (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Contribute
                </button>
                {success && <p className="text-green-500 mt-2">{success}</p>}
            </form>
        </div>
    );
}
