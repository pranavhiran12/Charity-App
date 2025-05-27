import React from "react";
import CharityList from "../components/CharityList";

export default function SelectCharityPage() {
    const handleCharitySelect = (charity) => {
        alert(`You selected: ${charity.name}`);
        // Save to state or move to next step
    };

    return (
        <div className="max-w-6xl mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Choose a Charity</h1>
            <CharityList onCharitySelect={handleCharitySelect} />
        </div>
    );
}

