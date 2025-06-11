import React from "react";

export default function CharityCard({ charity, onSelect }) {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4">
            {charity.logoUrl && (
                <img
                    src={charity.logoUrl}
                    alt={charity.name}
                    className="w-full h-40 object-cover rounded-md"
                />
            )}
            <h2 className="text-xl font-semibold mt-4">{charity.name}</h2>
            <p className="text-sm text-gray-700 mt-2">{charity.description}</p>
            {charity.website && (
                <a
                    href={charity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline mt-2 inline-block"
                >
                    Visit Website
                </a>
            )}
            <button
                onClick={() => onSelect(charity)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Select Charity
            </button>
        </div>
    );
}
