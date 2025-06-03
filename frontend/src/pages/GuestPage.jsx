import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const GuestPage = () => {
    const { eventId } = useParams();
    const [guests, setGuests] = useState([]);
    const [newGuest, setNewGuest] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return navigate('/login');
        fetchGuests();
    }, [eventId]);

    const fetchGuests = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/guests/event/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGuests(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching guests:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    const handleInputChange = (e) => {
        setNewGuest({ ...newGuest, [e.target.name]: e.target.value });
    };

    const handleAddGuest = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:5000/api/guests',
                { ...newGuest, eventId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewGuest({ name: '', email: '' });
            fetchGuests();
        } catch (err) {
            console.error('Error adding guest:', err);
            alert('Failed to add guest');
        }
    };

    if (loading) return <div className="p-6 text-center">Loading Guests...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">👥 Guests for Event</h1>

            {/* Add Guest Form */}
            <form onSubmit={handleAddGuest} className="mb-6 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Add Guest</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        name="name"
                        value={newGuest.name}
                        onChange={handleInputChange}
                        placeholder="Guest Name"
                        className="border p-2 rounded w-full"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={newGuest.email}
                        onChange={handleInputChange}
                        placeholder="Guest Email"
                        className="border p-2 rounded w-full"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add
                    </button>
                </div>
            </form>

            {/* Guest List */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Guest List</h2>
                <ul className="divide-y">
                    {guests.map((guest) => (
                        <li key={guest._id} className="py-2">
                            <div className="font-medium">{guest.name}</div>
                            <div className="text-sm text-gray-600">{guest.email}</div>
                            <div className="text-sm">
                                RSVP:{" "}
                                <span className={`font-semibold ${guest.rsvp === 'yes' ? 'text-green-600' : 'text-red-600'}`}>
                                    {guest.rsvp || 'Not Responded'}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GuestPage;
