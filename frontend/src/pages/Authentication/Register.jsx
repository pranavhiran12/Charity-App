import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", form);
            setSuccessMsg(res.data.message || "Registration successful. Please check your email to verify your account.");
            setErrorMsg('');
            setForm({ name: "", email: "", password: "" });
            setTimeout(() => navigate('/login'), 3000); // Optional delay
        } catch (err) {
            const message = err.response?.data?.message || "Something went wrong.";
            setErrorMsg(message);
            setSuccessMsg('');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#d8f3dc" }}>
            <div className="login-card p-4 bg-white rounded shadow" style={{ minWidth: "350px" }}>
                <h2 className="login-title text-center mb-3">Create an Account</h2>

                {successMsg && (
                    <div className="alert alert-success text-center" role="alert">
                        {successMsg}
                    </div>
                )}
                {errorMsg && (
                    <div className="alert alert-danger text-center" role="alert">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            className="form-control"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

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

                    <button type="submit" className="btn btn-success w-100 mb-2">Register</button>

                    <div className="text-center">
                        <a href="/login" className="link-primary d-block">Already have an account? Login</a>
                        <a href="/resend-verification" className="link-secondary d-block mt-2">Didn't get the email? Resend verification</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
