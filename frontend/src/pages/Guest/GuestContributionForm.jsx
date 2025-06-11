import React, { useState } from "react";
import axios from "axios";

export default function GuestContributionForm({ eventId, onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        contributionAmount: ""
    });

    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Submitting...");
        try {
            await axios.post("http://localhost:5000/api/guests", {
                ...formData,
                eventId,
            });
            setStatus("🎉 Thank you for your contribution!");
            setFormData({
                name: "",
                email: "",
                message: "",
                contributionAmount: ""
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            setStatus("❌ Something went wrong.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
            <h2 className="text-lg font-bold mb-4">Contribute to the Event</h2>
            {status && <p className="mb-2 text-sm">{status}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
                <textarea
                    name="message"
                    placeholder="Message (Optional)"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
                <input
                    type="number"
                    name="contributionAmount"
                    placeholder="Contribution Amount (e.g., 100)"
                    value={formData.contributionAmount}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                >
                    Contribute
                </button>
            </form>
        </div>
    );
}
