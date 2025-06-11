// TOP: keep your existing imports
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import RSVPStatusCounter from "../pages/Invitations/RSVPStatusCounter";


const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [events, setEvents] = useState([]);
    const [guests, setGuests] = useState({});
    const [invites, setInvites] = useState({});
    const [showInviteFormFor, setShowInviteFormFor] = useState(null);
    const [inviteGuestForm, setInviteGuestForm] = useState({ name: '', email: '', mobile: '' });
    const [inviteMessage, setInviteMessage] = useState('');
    const [totalContributions, setTotalContributions] = useState({});
    const [loadingTotals, setLoadingTotals] = useState({});

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const fetchGuests = async (eventId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/guests/event/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGuests(prev => ({ ...prev, [eventId]: res.data }));
        } catch (err) {
            console.error('Error fetching guests:', err);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenFromURL = queryParams.get('token');

        if (tokenFromURL) {
            localStorage.setItem('token', tokenFromURL);
            window.location.href = '/dashboard';
            return;
        }




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

                res.data.forEach(event => {
                    fetchGuests(event._id);
                });
            } catch (err) {
                console.error('Error fetching events:', err);
            }
        };

        fetchSummary();
        fetchEvents();
    }, [location, navigate, token]);

    const handleGenerateInvitation = async (eventId, guestId) => {
        try {
            const res = await axios.post(
                `http://localhost:5000/invitations/autolink`,
                { eventId, guestId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setInvites(prev => ({
                ...prev,
                [`${eventId}-${guestId}`]: res.data.invitationCode
            }));
        } catch (err) {
            console.error("Invitation error:", err);
            alert("Failed to generate invitation: " + (err.response?.data?.message || "Server error"));
        }
    };

    const handleInvite = async (eventId) => {
        try {
            const res = await axios.post(`http://localhost:5000/invitations/send/${eventId}`);
            const baseUrl = "http://localhost:5173/invite";
            const links = res.data.map(invite => `${baseUrl}/${invite.invitationCode}`);

            await navigator.clipboard.writeText(links.join('\n'));
            console.log("🔗 Invitation Links:");
            links.forEach(link => console.log(link));

            alert("Invitations sent & links copied to clipboard!");
        } catch (err) {
            console.error("❌ Invitation error:", err.response?.data || err.message);
            alert("Failed to send invitations.");
        }
    };

    const handle2Invite = (eventId) => {
        setShowInviteFormFor(eventId);
        setInviteGuestForm({ name: '', email: '', mobile: '' });
        setInviteMessage('');
    };

    const handleInviteInputChange = (e) => {
        const { name, value } = e.target;
        setInviteGuestForm(prev => ({ ...prev, [name]: value }));
    };

    const submitInviteGuest = async (eventId) => {
        try {
            const guestRes = await axios.post('http://localhost:5000/api/guests', {
                name: inviteGuestForm.name,
                email: inviteGuestForm.email,
                mobile: inviteGuestForm.mobile,
                eventId: eventId
            });

            const guestId = guestRes.data._id;

            await axios.post('http://localhost:5000/invitations/autolink', {
                guestId,
                eventId
            });

            setInviteMessage('✅ Invitation sent successfully!');
            setInviteGuestForm({ name: '', email: '', mobile: '' });
            setTimeout(() => setShowInviteFormFor(null), 2000);
        } catch (err) {
            console.error('Error:', err?.response?.data || err.message);
            setInviteMessage('❌ Failed to send invitation.');
        }
    };

    const fetchTotalContributions = async (eventId) => {
        try {
            setLoadingTotals(prev => ({ ...prev, [eventId]: true }));

            const response = await axios.get(`http://localhost:5000/api/contributions/total/${eventId}`);

            setTotalContributions(prev => ({
                ...prev,
                [eventId]: response.data.total || 0  // ✅ Fixed key here
            }));
        } catch (error) {
            console.error("Failed to fetch total contributions:", error);
            setTotalContributions(prev => ({ ...prev, [eventId]: "Error" }));
        } finally {
            setLoadingTotals(prev => ({ ...prev, [eventId]: false }));
        }
    };

    if (!summary) return <div className="p-6 text-center">Loading Dashboard...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">📊 Dashboard Overview</h1>
                <button onClick={handleLogout} className="bg-blue-600 text-green-300 px-4 py-2 rounded hover:bg-blue-700">
                    Logout
                </button>
            </div>

            <div className="bg-white p-6 shadow rounded mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">📅 Your Events</h2>
                    <Link to="/create-event" className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
                        ➕ Create New Event
                    </Link>
                </div>

                <ul className="space-y-6">
                    {events.map((event) => (
                        <li key={event._id} className="border rounded p-4 hover:bg-gray-50">
                            <div onClick={() => navigate(`/event/${event._id}`)} className="cursor-pointer">
                                <div className="font-medium text-lg">{event.eventTitle}</div>
                                <div className="text-sm text-gray-600">
                                    {new Date(event.eventDate).toLocaleDateString()}
                                </div>
                            </div>
                            <button onClick={() => fetchGuests(event._id)} className="text-sm text-blue-500 underline hover:text-blue-700 ml-4">
                                🔄 Refresh Guests
                            </button>

                            <div className="mt-2 space-x-4 text-sm">
                                <Link to={`/guest/${event._id}`} className="text-blue-600 hover:underline">
                                    📩 RSVP as Guest
                                </Link>
                                <Link to={`/event/${event._id}/guests`} className="text-green-600 hover:underline">
                                    👥 View Guests
                                </Link>
                                <button
                                    onClick={() => navigate(`/event/${event._id}/contributions`)}
                                    className="bg-blue-600 text-green-300 px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    View Contributions
                                </button>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="font-medium text-sm text-gray-800 mb-1">Guest Invitations:</div>
                                {guests[event._id]?.map(guest => (
                                    <div key={guest._id} className="flex items-center justify-between text-sm border rounded px-2 py-1">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{guest.name} ({guest.email})</span>
                                            <span className="text-xs mt-1">
                                                Status: <span className={`px-2 py-0.5 rounded-full font-semibold w-fit ${guest.status?.toLowerCase() === 'accepted' ? 'bg-green-100 text-green-700' : guest.status?.toLowerCase() === 'declined' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {guest.status ? guest.status.charAt(0).toUpperCase() + guest.status.slice(1).toLowerCase() : 'Pending'}
                                                </span>

                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            {invites[`${event._id}-${guest._id}`] ? (
                                                <a
                                                    href={`http://localhost:5173/invite/${invites[`${event._id}-${guest._id}`]}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline"
                                                >
                                                    View Invite
                                                </a>
                                            ) : (
                                                <button
                                                    onClick={() => handleGenerateInvitation(event._id, guest._id)}
                                                    className="bg-blue-600 text-green-300 px-4 py-2 rounded hover:bg-blue-700"
                                                >
                                                    Generate Link
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="mt-4 text-right space-x-2">
                                    <button
                                        onClick={() => navigate(`/contribute/${event._id}`)}
                                        className="bg-blue-600 text-green-300 px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        💰 Contribute to this Event
                                    </button>

                                    <button
                                        onClick={() => handleInvite(event._id)}
                                        className="bg-blue-600 text-green-300 px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Send Bulk Invitation
                                    </button>

                                    <button
                                        onClick={() => handle2Invite(event._id)}
                                        className="bg-blue-600 text-green-300 px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Send Invitation
                                    </button>

                                    <button
                                        onClick={() => fetchTotalContributions(event._id)}
                                        className="bg-blue-600 text-green-300 px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        View Total Contribution
                                    </button>

                                    {loadingTotals[event._id] ? (
                                        <p className="text-gray-500 mt-2">Loading total...</p>
                                    ) : (
                                        totalContributions[event._id] !== undefined && (
                                            <p className="text-green-700 font-semibold mt-2">
                                                💰 Total Contribution: ₹{totalContributions[event._id]}
                                            </p>
                                        )
                                    )}

                                    {/* ✅ RSVP Status Summary */}
                                    <div className="mt-4">
                                        <RSVPStatusCounter eventId={event._id} />
                                    </div>



                                </div>

                                {showInviteFormFor === event._id && (
                                    <div className="mt-3 bg-gray-100 p-4 rounded shadow-sm space-y-2">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Guest Name"
                                            value={inviteGuestForm.name}
                                            onChange={handleInviteInputChange}
                                            className="w-full p-2 border rounded"
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Guest Email"
                                            value={inviteGuestForm.email}
                                            onChange={handleInviteInputChange}
                                            className="w-full p-2 border rounded"
                                        />
                                        <input
                                            type="text"
                                            name="mobile"
                                            placeholder="Mobile Number"
                                            value={inviteGuestForm.mobile}
                                            onChange={handleInviteInputChange}
                                            className="w-full p-2 border rounded"
                                        />

                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => submitInviteGuest(event._id)}
                                                className="bg-blue-600 text-green-300 px-4 py-2 rounded hover:bg-blue-700"
                                            >
                                                Send
                                            </button>
                                            <button
                                                onClick={() => setShowInviteFormFor(null)}
                                                className="bg-blue-600 text-green-300 px-4 py-2 rounded hover:bg-blue-700"
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                        {inviteMessage && (
                                            <div className="text-sm mt-2 text-green-700 font-semibold">
                                                {inviteMessage}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-3">🎁 Charities</h2>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/add-charity" className="text-blue-600 hover:underline">
                                ➕ Add New Charity
                            </Link>
                        </li>
                        <li>
                            <Link to="/select-charity" className="text-blue-600 hover:underline">
                                🎯 Select Charity
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
