import React from "react";
import { useParams } from "react-router-dom";
import GuestList from "../components/GuestList";

export default function GuestListPage() {
    const { id: eventId } = useParams();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Guests for this Event</h1>
            <GuestList eventId={eventId} />
        </div>
    );
}
