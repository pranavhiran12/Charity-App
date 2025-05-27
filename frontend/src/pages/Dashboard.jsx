import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [events, setEvents] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // 🚪 Logout handler
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchSummary = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/dashboard/summary', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSummary(res.data);
            } catch (err) {
                console.error('Error loading dashboard summary:', err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        const fetchEvents = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/events', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvents(res.data);
            } catch (err) {
                console.error('Error fetching events:', err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchSummary();
        fetchEvents();
    }, [token, navigate]);

    if (!summary) return <div className="p-6 text-center">Loading Dashboard...</div>;

    return (
        <div className="p-6">
            {/* Header with Logout Button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">📊 Dashboard Overview</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white shadow p-4 rounded">
                    <h2 className="text-xl font-semibold">Total Events</h2>
                    <p className="text-2xl">{summary.totalEvents}</p>
                </div>
                <div className="bg-white shadow p-4 rounded">
                    <h2 className="text-xl font-semibold">Total Guests</h2>
                    <p className="text-2xl">{summary.totalGuests}</p>
                </div>
                <div className="bg-white shadow p-4 rounded">
                    <h2 className="text-xl font-semibold">Total Contributions</h2>
                    <p className="text-2xl">{summary.totalContributions}</p>
                </div>
                <div className="bg-green-50 shadow p-4 rounded">
                    <h2 className="text-xl font-semibold">Total Gift Amount</h2>
                    <p className="text-2xl text-green-600">${summary.totalGiftAmount}</p>
                </div>
                <div className="bg-blue-50 shadow p-4 rounded">
                    <h2 className="text-xl font-semibold">Total Charity Amount</h2>
                    <p className="text-2xl text-blue-600">${summary.totalCharityAmount}</p>
                </div>
            </div>

            {/* Events List */}
            <div className="bg-white p-4 shadow rounded">
                <h2 className="text-xl font-bold mb-4">📅 Your Events</h2>
                <ul className="space-y-2">
                    {events.map(event => (
                        <li
                            key={event._id}
                            className="border rounded p-2 hover:bg-gray-50 cursor-pointer"
                            onClick={() => navigate(`/event/${event._id}`)}
                        >
                            <div className="font-medium">{event.eventTitle}</div>
                            <div className="text-sm text-gray-600">{new Date(event.eventDate).toLocaleDateString()}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
