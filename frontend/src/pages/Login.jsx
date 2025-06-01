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
        <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#d8f3dc" }}>
            <div className="login-card">
                <h2 className="login-title">Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="form-control"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="form-control"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-green w-100">Login</button>

                    <a href="/register" className="link-green">Don't have an account? Register</a>
                </form>
            </div>
        </div>
    );

}
