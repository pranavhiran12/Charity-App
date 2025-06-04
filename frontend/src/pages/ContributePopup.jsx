import { useState } from "react";
import axios from "axios";

export default function ContributePopup({ eventId, onClose }) {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        guestId: "",
        amount: "",
        message: "",
    });
    const [response, setResponse] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await axios.post("http://localhost:5000/api/contributions", {
                eventId,
                ...form,
            });
            setResponse("✅ Thank you for your contribution!");
        } catch (err) {
            setResponse("❌ Error: " + err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96 relative">
                <button className="absolute top-2 right-3 text-gray-500" onClick={onClose}>✖</button>

                {step === 1 ? (
                    <>
                        <h2 className="text-lg font-semibold mb-4">
                            Do you want to contribute to this event?
                        </h2>
                        <div className="flex justify-between">
                            <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
                            <button onClick={() => setStep(2)} className="bg-blue-600 text-white px-4 py-2 rounded">Yes</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-lg font-semibold mb-4">Enter Contribution Details</h2>
                        <input
                            className="border p-2 w-full mb-2"
                            placeholder="Guest ID"
                            name="guestId"
                            value={form.guestId}
                            onChange={handleChange}
                        />
                        <input
                            className="border p-2 w-full mb-2"
                            placeholder="Amount"
                            name="amount"
                            type="number"
                            value={form.amount}
                            onChange={handleChange}
                        />
                        <textarea
                            className="border p-2 w-full mb-2"
                            placeholder="Message (optional)"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                        />
                        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded w-full">
                            Submit Contribution
                        </button>
                        <p className="mt-2 text-sm text-center text-gray-700">{response}</p>
                    </>
                )}
            </div>
        </div>
    );
}
