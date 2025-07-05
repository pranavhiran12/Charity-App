// src/pages/AllEventsPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllEvents, deleteEventById } from '../../api/eventApi'; // ✅ Adjust path if needed

const AllEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get current user info
    const currentUser = JSON.parse(localStorage.getItem('user')) || { name: 'User' };

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            try {
                const data = await fetchAllEvents();
                setEvents(data);
            } catch (err) {
                console.error('Error fetching events:', err);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);

    const handleDelete = async (eventId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this event?');
        if (!confirmDelete) return;

        try {
            await deleteEventById(eventId); // ✅ Use API function
            setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
        } catch (err) {
            console.error('Error deleting event:', err);
            alert('Failed to delete event');
        }
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto p-6 mt-10">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 mt-10">
            <h2 className="text-3xl font-bold mb-2 text-center">🎉 My Events</h2>
            <p className="text-gray-600 text-center mb-8">Welcome back, {currentUser.name}! Here are your events.</p>

            {events.length === 0 ? (
                <div className="text-center">
                    <p className="text-gray-600 mb-4">You haven't created any events yet.</p>
                    <Link
                        to="/dashboard2/create-template-event"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        + Create Your First Event
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event._id} className="bg-white p-4 rounded shadow">
                            <h3 className="text-xl font-semibold mb-2">{event.eventTitle}</h3>
                            <p className="text-gray-700 mb-2">{event.eventDescription}</p>
                            <p className="text-sm text-gray-500 mb-2">
                                🎂 Child: <strong>{event.childName}</strong>
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                                📅 Event Date: {new Date(event.eventDate).toLocaleDateString()}
                            </p>

                            <div className="flex justify-between items-center mt-3">
                                <Link
                                    to={`/event/${event._id}`}
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    View Event →
                                </Link>

                                <button
                                    onClick={() => handleDelete(event._id)}
                                    className="text-red-600 hover:underline text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllEventsPage;
