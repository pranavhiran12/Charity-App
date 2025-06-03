import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Contribution = ({ eventId }) => {
    const [contributions, setContributions] = useState([]);
    const [guestId, setGuestId] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [total, setTotal] = useState(0);

    // Fetch contributions on load
    useEffect(() => {
        fetchContributions();
        fetchTotal();
    }, [eventId]);

    const fetchContributions = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/contributions/${eventId}`);
            setContributions(res.data);
        } catch (err) {
            console.error('Error fetching contributions:', err.message);
        }
    };

    const fetchTotal = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/contributions/${eventId}/total`);
            setTotal(res.data.totalAmountRaised);
        } catch (err) {
            console.error('Error fetching total contribution:', err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!guestId || !amount) return alert('Guest ID and amount are required');
        try {
            const res = await axios.post(`http://localhost:5000/api/contributions/${eventId}`, {
                guestId,
                amount,
                message,
            });
            console.log(res.data);
            setGuestId('');
            setAmount('');
            setMessage('');
            fetchContributions();
            fetchTotal();
        } catch (err) {
            console.error('Error submitting contribution:', err.message);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Contributions</h2>

            {/* Contribution Form */}
            <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                <input
                    type="text"
                    placeholder="Guest ID"
                    value={guestId}
                    onChange={(e) => setGuestId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <textarea
                    placeholder="Message (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Add Contribution
                </button>
            </form>

            {/* Total */}
            <div className="text-lg font-semibold mb-2">Total Raised: ${total}</div>

            {/* Contributions List */}
            <div className="space-y-3">
                {contributions.map((contribution) => (
                    <div
                        key={contribution._id}
                        className="border p-4 rounded-md shadow-sm bg-gray-50"
                    >
                        <p>
                            <span className="font-bold">Guest:</span>{' '}
                            {contribution.guestId?.name || 'N/A'}
                        </p>
                        <p>
                            <span className="font-bold">Amount:</span> ${contribution.amount}
                        </p>
                        {contribution.message && (
                            <p>
                                <span className="font-bold">Message:</span>{' '}
                                {contribution.message}
                            </p>
                        )}
                        <p className="text-sm text-gray-500">
                            {new Date(contribution.date).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Contribution;
