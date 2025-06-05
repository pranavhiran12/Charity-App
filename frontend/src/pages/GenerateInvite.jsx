import { useState } from "react";
import axios from "axios";

export default function GenerateInvite() {
    const [eventId, setEventId] = useState("");
    const [guestId, setGuestId] = useState("");
    const [code, setCode] = useState("");

    const handleGenerate = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/invitations/autolink?eventId=${eventId}&guestId=${guestId}`);
            setCode(res.data.invitationCode);
        } catch (err) {
            console.error("Error generating invitation", err);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Generate Invitation</h2>

            <input
                className="border p-2 mb-2 w-full"
                type="text"
                placeholder="Event ID"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
            />
            <input
                className="border p-2 mb-2 w-full"
                type="text"
                placeholder="Guest ID"
                value={guestId}
                onChange={(e) => setGuestId(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleGenerate}
            >
                Generate Invitation
            </button>

            {code && (
                <p className="mt-4 text-green-600">
                    Invitation Link:{" "}
                    <a
                        className="underline"
                        href={`http://localhost:5173/rsvp/${code}`}
                    >
                        http://localhost:5173/rsvp/{code}
                    </a>
                </p>
            )}
        </div>
    );
}