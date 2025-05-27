import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", form); // ✅ Fixed URL
            console.log(res.data);
            alert("Login successful!");
            localStorage.setItem('token', res.data.token);

            navigate('/dashboard');


        } catch (err) {
            alert("Login failed: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Login</h2>
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
                    className="mb-4 w-full p-2 border rounded" required />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}
                    className="mb-6 w-full p-2 border rounded" required />
                <button type="submit" className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600">
                    Login
                </button>
            </form>
        </div>
    );
}
