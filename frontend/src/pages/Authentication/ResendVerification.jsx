import { useState } from "react";
import axios from "axios";

export default function ResendVerification() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/resend-verification", { email });
            setMessage(res.data.message);
            setError("");
        } catch (err) {
            const msg = err.response?.data?.message || "Error resending verification email.";
            setError(msg);
            setMessage("");
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#f8f9fa" }}>
            <div className="login-card">
                <h2 className="login-title">Resend Verification Email</h2>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your registered email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100 mb-2">Resend Email</button>
                </form>
            </div>
        </div>
    );
}
