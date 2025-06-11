import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TotalContribution = ({ eventId }) => {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchTotal = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/contributions/total/${eventId}`);
                setTotal(res.data.totalAmount);
            } catch (err) {
                console.error('Error fetching total:', err);
            }
        };

        fetchTotal();
    }, [eventId]);

    return (
        <div className="bg-green-100 text-green-800 p-4 rounded text-center mt-4">
            <h3 className="text-lg font-bold">Total Contributions</h3>
            <p className="text-2xl">${total}</p>
        </div>
    );
};

export default TotalContribution;
