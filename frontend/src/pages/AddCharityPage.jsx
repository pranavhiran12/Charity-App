import React from "react";
import AddCharityForm from "../components/AddCharityForm";

export default function AddCharityPage() {
    const handleSuccess = (charity) => {
        console.log("Charity added:", charity);
        // Optional: redirect or refresh list
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <AddCharityForm onSuccess={handleSuccess} />
        </div>
    );
}