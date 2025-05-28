import React, { useState } from 'react';
import axios from 'axios';

const ContributePage = ({ eventId }) => {
    const [formData, setFormData] = useState({
        guestName: '',
        guestEmail: '',
        amount: '',
        message: '',
    });

    const [submitted, setSubmitted] = useState(false); // ✅
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/api/contributions/${eventId}`, formData);
            setSubmitted(true); // ✅ Success: show Thank You message
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        }
    };

    // ✅ Render "Thank You" message if form is successfully submitted
    if (submitted) {
        return (
            <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded shadow text-center">
                <h2 className="text-2xl font-semibold text-green-700 mb-2">
                    🎉 Thank you so much for your Contribution!
                </h2>
                <p className="text-gray-600">Your generosity is truly appreciated.</p>
            </div>
        );
    }

    // ✅ Otherwise, show the form
    return (
        <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Make a Contribution</h2>
            {error && <p className="text-red-600 mb-2">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Your Name</label>
                    <input
                        name="guestName"
                        value={formData.guestName}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                        placeholder="Full name"
                    />
                </div>

                <div>
                    <label className="block mb-1">Email (optional)</label>
                    <input
                        name="guestEmail"
                        value={formData.guestEmail}
                        onChange={handleChange}
                        type="email"
                        className="w-full p-2 border rounded"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label className="block mb-1">Amount</label>
                    <input
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        type="number"
                        required
                        className="w-full p-2 border rounded"
                        placeholder="Amount to contribute"
                    />
                </div>

                <div>
                    <label className="block mb-1">Message (optional)</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Your message"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    Contribute
                </button>
            </form>
        </div>
    );
};

export default ContributePage;