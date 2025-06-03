// pages/ContributePage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ContributeForm from '../components/ContributionForm';

const ContributePage = () => {
    const { eventId } = useParams();

    // 1️⃣ If guest ID is stored after RSVP (from localStorage or context):
    const guestId = localStorage.getItem('guestId'); // You must store this after RSVP/login

    if (!guestId) {
        return (
            <div className="text-center text-red-500">
                Please RSVP or log in as a guest to contribute.
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-center">Make a Contribution</h1>
            <ContributeForm eventId={eventId} guestId={guestId} />
        </div>
    );
};

export default ContributePage;
