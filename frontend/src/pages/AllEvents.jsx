import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "./EventCard";

export default function AllEvents() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const res = await axios.get("http://localhost:5000/api/events");
            setEvents(res.data);
        };
        fetchEvents();
    }, []);

    return (
        <div className="max-w-2xl mx-auto mt-6">
            <h1 className="text-2xl font-bold mb-4">All Events</h1>
            {events.map((event) => (
                <EventCard key={event._id} event={event} />
            ))}
        </div>
    );
}
