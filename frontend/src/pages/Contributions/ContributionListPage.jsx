// pages/ContributionListPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ViewContributions from "./ViewContributions";
import TotalContribution from "./TotalContribution";


const ContributionListPage = () => {
    const { eventId } = useParams();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-center">Contributions Summary</h1>
            <TotalContribution eventId={eventId} />
            <ViewContributions eventId={eventId} />
        </div>
    );
};

export default ContributionListPage;
