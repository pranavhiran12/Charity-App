//import axios from "axios";

import { deleteEventById } from '../../api/eventApi'; // ✅ Adjust the import path as needed

export default function DeleteEventButton({ eventId, onSuccess }) {
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteEventById(eventId); // ✅ Use the API function
            alert("Event deleted successfully");
            if (onSuccess) onSuccess(); // Call the success handler, e.g., refresh
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete event");
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
            Delete Event
        </button>
    );
}
