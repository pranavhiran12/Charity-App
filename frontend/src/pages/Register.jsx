import { useState } from "react";
import axios from "axios";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", form);
            console.log(res.data); // or use res.data.token, etc.
            alert("Registered successfully!");
        } catch (err) {
            alert("Registration failed: " + err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Register</h2>
                <input name="name" placeholder="Name" value={form.name} onChange={handleChange}
                    className="mb-4 w-full p-2 border rounded" required />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
                    className="mb-4 w-full p-2 border rounded" required />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}
                    className="mb-6 w-full p-2 border rounded" required />
                <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600">
                    Register
                </button>
            </form>
        </div>
    );
}
