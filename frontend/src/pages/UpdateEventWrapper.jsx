// pages/UpdateEventWrapper.jsx
import { useParams } from "react-router-dom";
import UpdateEventForm from "./UpdateEventForm";

export default function UpdateEventWrapper() {
    const { id } = useParams(); // 👈 Get event ID from URL
    return <UpdateEventForm eventId={id} />;
}
