import { useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function Contribute() {
    const { eventId } = useParams();
    const [form, setForm] = useState({ name: '', email: '', amount: '', message: '' });
    const [response, setResponse] = useState('');

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setResponse(''); // Clear old messages



        console.log("📤 Sending contribution:", {
            eventId,
            name: form.name,
            email: form.email,
            amount: parseFloat(form.amount),
            message: form.message
        });


        try {
            const contributionRes = await axios.post(`http://localhost:5000/api/contributions/direct`, {
                eventId,
                name: form.name,
                email: form.email,
                amount: parseFloat(form.amount),
                message: form.message
            });

            if (contributionRes.status === 200 || contributionRes.status === 201) {
                setResponse('🎉 Contribution successful!');
                setForm({ name: '', email: '', amount: '', message: '' }); // Clear form
            } else {
                setResponse('⚠️ Failed to submit contribution. Please try again.');
            }
        } catch (err) {
            console.error("📛 Contribution Error:", err); // full error
            console.error("🔍 Error Response:", err?.response?.data); // response from server

            if (err.response?.data?.message) {
                setResponse(`❌ ${err.response.data.message}`);
            } else {
                setResponse('❌ Something went wrong. Please try again.');
            }
        }

    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Contribute to the Event</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    name="amount"
                    type="number"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    name="message"
                    placeholder="Message (optional)"
                    value={form.message}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Contribute
                </button>
            </form>
            {response && <p className="mt-4 text-green-600 font-medium">{response}</p>}
        </div>
    );
}
