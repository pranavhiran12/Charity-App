import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteEventButton from "./DeleteEventButton";

export default function EventDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        async function fetchEvent() {
            try {
                const response = await axios.get(`http://localhost:5000/api/events/${id}`);
                setEvent(response.data);
            } catch (err) {
                console.error("Error fetching event:", err);
            }
        }
        fetchEvent();
    }, [id]);

    if (!event) return <p className="p-4">Loading...</p>;

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-2">{event.eventTitle}</h1>
            <p className="mb-4">{event.eventDescription}</p>
            {/* 👇 Delete Button */}
            <DeleteEventButton
                eventId={event._id}
                onSuccess={() => navigate("/")} // Redirect on delete
            />
        </div>
    );
}