import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';



// Accept eventId from props (from EventWrapper)
const GuestRSVPForm = ({ eventId: propEventId }) => {
    const [eventId, setEventId] = useState(propEventId || "");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [rsvp, setRsvp] = useState("Yes");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    const navigate = useNavigate(); // ✅ define navigate

    const handleRSVP = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!eventId) {
            setError("Event ID is required.");
            return;
        }

        try {
            const res = await axios.post(`http://localhost:5000/api/guests/${eventId}/rsvp`, {
                name,
                email,
                rsvp,
            });
            setMessage(res.data.message);
            setName("");
            setEmail("");
            setRsvp("Yes");

            // ✅ Store guestId in localStorage for later use (e.g., for contribution)
            localStorage.setItem('guestId', res.data.guest._id);

            // Redirect to contribute page or show success message
            navigate(`/dashboard`);
        } catch (err) {
            console.error("RSVP failed:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Something went wrong");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">RSVP as Guest</h2>
            <form onSubmit={handleRSVP} className="space-y-4">
                {!propEventId && (
                    <input
                        type="text"
                        placeholder="Event ID"
                        value={eventId}
                        onChange={(e) => setEventId(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                )}
                <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <select
                    value={rsvp}
                    onChange={(e) => setRsvp(e.target.value)}
                    className="w-full border p-2 rounded"
                >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Maybe">Maybe</option>
                </select>
                <button
                    type="submit"
                    className="bg-blue-600 text-green-300 px-4 py-2 rounded hover:bg-blue-700"
                >
                    Submit RSVP
                </button>
                {message && <p className="text-green-600">{message}</p>}
                {error && <p className="text-red-600">{error}</p>}
            </form>
        </div>
    );
};

export default GuestRSVPForm;