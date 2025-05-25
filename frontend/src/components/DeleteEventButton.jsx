import axios from "axios";

export default function DeleteEventButton({ eventId, onSuccess }) {
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/events/${eventId}`);
            alert("Event deleted successfully");
            onSuccess(); // e.g., redirect or refresh
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
