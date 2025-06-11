import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RSVPPage() {
    const { code } = useParams();
    const [invitation, setInvitation] = useState(null);
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchInvitation = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/invitations/${code}`);
                setInvitation(res.data);
                setStatus(res.data.status);
            } catch (err) {
                console.error("Failed to generate invite", err); // ← now 'err' is used
                console.error("Invalid invitation code");
            }
        };
        fetchInvitation();
    }, [code]);

    const respond = async (response) => {
        try {
            await axios.put(`http://localhost:5000/invitations/${code}`, {
                status: response,
            });
            setStatus(response);
        } catch (err) {
            console.error("Failed to generate invite", err); // ← now 'err' is used
            console.error("RSVP failed");
        }
    };

    if (!invitation) return <p>Loading...</p>;

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">You're Invited!</h2>
            <p>Event: {invitation.eventId}</p>
            <p>Guest: {invitation.guestId}</p>
            <p>Status: {status}</p>

            {status === "pending" && (
                <div className="mt-4 flex gap-4">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={() => respond("accepted")}
                    >
                        Accept
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => respond("declined")}
                    >
                        Decline
                    </button>
                </div>
            )}
        </div>
    );
}
