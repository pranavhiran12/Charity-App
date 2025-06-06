import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", form);
            alert("Login successful!");
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            alert("Login failed: " + (err.response?.data?.message || err.message));
        }
    };

    const BACKEND_URL = "http://localhost:5000"; // Change to production URL later

    return (
        <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#d8f3dc" }}>
            <div className="login-card text-center">
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

                <hr className="my-4" />

                {/* 👇 Social login buttons */}
                <div className="social-buttons">
                    <a
                        href={`http://localhost:5000/api/auth/google`}
                        className="btn btn-danger w-100 mb-2"
                    >
                        Login with Google
                    </a>
                    <a
                        href={`${BACKEND_URL}/auth/facebook`}
                        className="btn btn-primary w-100"
                    >
                        Login with Facebook
                    </a>
                </div>
            </div>
        </div>
    );
}
