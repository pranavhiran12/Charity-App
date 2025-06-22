import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BACKEND_URL = "http://localhost:5000";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("📤 Sending login request with:", form);

            const res = await axios.post(`${BACKEND_URL}/api/auth/login`, form);

            console.log("✅ Response from backend:", res.data); // Add this line

            toast.success("✅ Login successful!");

            localStorage.setItem("token", res.data.token);
            if (res.data.user) {
                localStorage.setItem("user", JSON.stringify(res.data.user));
            }

            navigate("/dashboard2");
        } catch (err) {
            console.error("❌ Login error (raw):", err);

            const errorMsg =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Login failed";

            toast.error(`❌ ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };


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

                    <button
                        type="submit"
                        className="btn btn-green w-100"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <a href="/register" className="link-green d-block mt-3">
                        Don&apos;t have an account? Register
                    </a>
                </form>

                <hr className="my-4" />

                {/* Social login buttons */}
                <div className="social-buttons">
                    <a
                        href={`${BACKEND_URL}/api/auth/google`}
                        className="btn btn-danger w-100 mb-2"
                    >
                        Login with Google
                    </a>
                    <a
                        href={`${BACKEND_URL}/api/auth/facebook`}
                        className="btn btn-primary w-100"
                    >
                        Login with Facebook
                    </a>
                </div>
            </div>
        </div>
    );
}
