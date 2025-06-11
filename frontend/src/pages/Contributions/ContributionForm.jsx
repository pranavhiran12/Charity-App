import React, { useState } from 'react';
import axios from 'axios';

const ContributeForm = ({ eventId, guestId }) => {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Submitting...');

        try {
            const _res = await axios.post('http://localhost:5000/api/contributions', {
                eventId,
                guestId,
                amount,
                message
            });

            setStatus('Contribution successful!');
            setAmount('');
            setMessage('');
        } catch (err) {
            console.error(err);
            setStatus('Error submitting contribution');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 shadow rounded">
            <h2 className="text-xl font-semibold mb-4">Make a Contribution</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="number"
                    placeholder="Amount"
                    className="w-full border p-2 rounded"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Message (optional)"
                    className="w-full border p-2 rounded"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Contribute
                </button>
                {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
            </form>
        </div>
    );
};

export default ContributeForm;
