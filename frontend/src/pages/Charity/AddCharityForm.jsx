import React, { useState } from "react";
import axios from "axios";

export default function AddCharityForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        website: "",
        logoUrl: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post("http://localhost:5000/api/charities", formData);
            setMessage("✅ Charity added successfully!");
            setFormData({ name: "", description: "", website: "", logoUrl: "" });
            if (onSuccess) onSuccess(response.data);
        } catch (error) {
            console.error("Error adding charity:", error);
            setMessage("❌ Failed to add charity.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Add New Charity</h2>
            {message && <p className="mb-2 text-sm">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Charity Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
                <input
                    type="url"
                    name="website"
                    placeholder="Website URL"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
                <input
                    type="url"
                    name="logoUrl"
                    placeholder="Logo Image URL"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Adding..." : "Add Charity"}
                </button>
            </form>
        </div>
    );
}
