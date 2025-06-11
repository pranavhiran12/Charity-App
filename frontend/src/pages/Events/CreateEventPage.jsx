import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateEventForm() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        childName: "",
        eventTitle: "",
        eventDescription: "",
        eventDate: "",
        eventImage: "",
        giftName: "",
        charity: {
            name: "",
            description: "",
            charityId: ""
        },
        totalTargetAmount: "",
        splitPercentage: {
            gift: 50,
            charity: 50
        },
        status: "upcoming"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("charity.")) {
            const key = name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                charity: { ...prev.charity, [key]: value }
            }));
        } else if (name.startsWith("splitPercentage.")) {
            const key = name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                splitPercentage: { ...prev.splitPercentage, [key]: Number(value) }
            }));
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const payload = {
            childName: form.childName,
            eventTitle: form.eventTitle,
            eventDescription: form.eventDescription,
            eventDate: form.eventDate,
            eventImage: form.eventImage,
            giftName: form.giftName,
            charityId: form.charity.charityId, // send only charityId
            totalTargetAmount: form.totalTargetAmount,
            splitPercentage: form.splitPercentage,
            status: form.status
        };

        try {
            const response = await axios.post("http://localhost:5000/api/events", payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }

            });

            console.log("Event created:", response.data);
            alert("Event created successfully!");
            navigate('/dashboard');
        } catch (err) {
            console.error("Create Event Error:", err.response?.data || err.message);
            alert("Failed to create event");
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Create Event</h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
                <input name="childName" placeholder="Child Name" value={form.childName} onChange={handleChange} required className="border p-2 rounded" />
                <input name="eventTitle" placeholder="Event Title" value={form.eventTitle} onChange={handleChange} required className="border p-2 rounded" />
                <textarea name="eventDescription" placeholder="Description" value={form.eventDescription} onChange={handleChange} className="border p-2 rounded" />
                <input name="eventDate" type="date" value={form.eventDate} onChange={handleChange} required className="border p-2 rounded" />
                <input name="eventImage" placeholder="Image URL" value={form.eventImage} onChange={handleChange} className="border p-2 rounded" />
                <input name="giftName" placeholder="Gift Name" value={form.giftName} onChange={handleChange} required className="border p-2 rounded" />
                <input name="charity.name" placeholder="Charity Name (display only)" value={form.charity.name} onChange={handleChange} className="border p-2 rounded" />
                <input name="charity.description" placeholder="Charity Description (display only)" value={form.charity.description} onChange={handleChange} className="border p-2 rounded" />
                <input name="charity.charityId" placeholder="Charity ID (required)" value={form.charity.charityId} onChange={handleChange} required className="border p-2 rounded" />
                <input name="totalTargetAmount" type="number" placeholder="Total Target Amount" value={form.totalTargetAmount} onChange={handleChange} required className="border p-2 rounded" />
                <input name="splitPercentage.gift" type="number" placeholder="Gift Split %" value={form.splitPercentage.gift} onChange={handleChange} className="border p-2 rounded" />
                <input name="splitPercentage.charity" type="number" placeholder="Charity Split %" value={form.splitPercentage.charity} onChange={handleChange} className="border p-2 rounded" />
                <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded">
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Create Event</button>
            </form>
        </div>
    );
}
