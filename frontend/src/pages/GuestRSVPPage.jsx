import React, { useState } from 'react';
import axios from 'axios';

const GuestRSVPPage = ({ eventId }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rsvp: 'Maybe',
    });

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/guests', {
                ...formData,
                eventId,
            });

            setSuccess(`RSVP submitted successfully for ${response.data.name}`);
            setError('');
            setFormData({ name: '', email: '', rsvp: 'Maybe' });
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
            setSuccess('');
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">RSVP to the Event</h2>

            {success && <p className="text-green-600 mb-2">{success}</p>}
            {error && <p className="text-red-600 mb-2">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                        placeholder="Your full name"
                    />
                </div>

                <div>
                    <label className="block mb-1">Email (optional)</label>
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        className="w-full p-2 border rounded"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label className="block mb-1">RSVP</label>
                    <select
                        name="rsvp"
                        value={formData.rsvp}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option>Yes</option>
                        <option>No</option>
                        <option>Maybe</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Submit RSVP
                </button>
            </form>
        </div>
    );
};

export default GuestRSVPPage;
