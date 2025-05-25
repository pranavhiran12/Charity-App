import React from "react";
import { useParams } from "react-router-dom";
import GuestContributionForm from "../components/GuestContributionForm";

export default function ContributePage() {
    const { id: eventId } = useParams();

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <GuestContributionForm eventId={eventId} />
        </div>
    );
}
