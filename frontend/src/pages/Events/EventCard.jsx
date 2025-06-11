import { useState } from "react";
import ContributePopup from "../Contributions/ContributePopup";
;

export default function EventCard({ event }) {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="border rounded p-4 mb-4 shadow">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-gray-600">{event.description}</p>
            <p className="text-sm text-gray-500 mb-2">Date: {event.date}</p>

            <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => setShowForm(true)}
            >
                Contribute
            </button>

            {showForm && (
                <ContributePopup
                    eventId={event._id}
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    );
}
