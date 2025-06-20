import { useEffect, useState } from "react";
import { fetchEventById, updateEventById } from '../../api/eventDetailsApi'; // ✅ Adjust path if needed

export default function UpdateEventForm({ eventId }) {
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchEventById(eventId); // ✅ Use separated API call
                setForm(data);
            } catch (err) {
                console.error("Failed to fetch event:", err);
                alert("Event not found");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [eventId]);

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
        try {
            const updated = await updateEventById(eventId, form); // ✅ Use separated API call
            console.log("Event updated:", updated);
            alert("Event updated successfully!");
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update event");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading event...</p>;
    if (!form) return <p className="text-center mt-10">Event not found</p>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Update Event</h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
                <input name="childName" placeholder="Child Name" value={form.childName} onChange={handleChange} required className="border p-2 rounded" />
                <input name="eventTitle" placeholder="Event Title" value={form.eventTitle} onChange={handleChange} required className="border p-2 rounded" />
                <textarea name="eventDescription" placeholder="Description" value={form.eventDescription} onChange={handleChange} className="border p-2 rounded" />
                <input name="eventDate" type="date" value={form.eventDate?.substring(0, 10)} onChange={handleChange} required className="border p-2 rounded" />
                <input name="eventImage" placeholder="Image URL" value={form.eventImage} onChange={handleChange} className="border p-2 rounded" />
                <input name="giftName" placeholder="Gift Name" value={form.giftName} onChange={handleChange} required className="border p-2 rounded" />
                <input name="charity.name" placeholder="Charity Name" value={form.charity?.name || ""} onChange={handleChange} className="border p-2 rounded" />
                <input name="charity.description" placeholder="Charity Description" value={form.charity?.description || ""} onChange={handleChange} className="border p-2 rounded" />
                <input name="charity.charityId" placeholder="Charity ID" value={form.charity?.charityId || ""} onChange={handleChange} className="border p-2 rounded" />
                <input name="totalTargetAmount" type="number" placeholder="Total Target Amount" value={form.totalTargetAmount} onChange={handleChange} required className="border p-2 rounded" />
                <input name="splitPercentage.gift" type="number" placeholder="Gift Split %" value={form.splitPercentage.gift} onChange={handleChange} className="border p-2 rounded" />
                <input name="splitPercentage.charity" type="number" placeholder="Charity Split %" value={form.splitPercentage.charity} onChange={handleChange} className="border p-2 rounded" />
                <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded">
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <button type="submit" className="bg-green-500 text-white py-2 rounded hover:bg-green-600">Update Event</button>
            </form>
        </div>
    );
}
