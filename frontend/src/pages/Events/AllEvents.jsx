import { useEffect, useState } from "react";
import { fetchAllEvents } from '../../api/eventDetailsApi'; // Adjust the path if needed
import EventCard from "./EventCard";

export default function AllEvents() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await fetchAllEvents();
                setEvents(data);
            } catch (err) {
                console.error("Failed to fetch events:", err);
            }
        };
        loadEvents();
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
