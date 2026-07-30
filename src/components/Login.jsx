import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosConfig";
import "../styles/auth.css";

function Login() {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });

        setError("");
        setSuccess("");
    };

    const loginUser = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await API.post("/auth/login", user);

            console.log("Login response:", response.data);

            localStorage.setItem("token", response.data.token);

            setSuccess("Login successful! Welcome back.");

            setUser({
                email: "",
                password: ""
            });

        } catch (error) {
            console.error("Login error:", error);

            if (error.response) {
                setError(
                    error.response.data?.message ||
                    "Invalid email or password"
                );
            } else {
                setError("Unable to connect to the server");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-brand">
                    <div className="brand-icon">🔐</div>

                    <h1>Password Vault</h1>

                    <p>
                        Secure your digital credentials
                    </p>
                </div>

                <div className="auth-header">
                    <h2>Welcome Back</h2>

                    <p>
                        Sign in to access your vault
                    </p>
                </div>

                <form
                    onSubmit={loginUser}
                    className="auth-form"
                >

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={user.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <div className="password-wrapper">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                placeholder="Enter your password"
                                value={user.password}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Login"}
                    </button>

                </form>

                <div className="auth-footer">

                    <span>
                        Don't have an account?
                    </span>

                    <Link
                        to="/register"
                        className="link-button"
                    >
                        Register
                    </Link>

                </div>

            </div>
        </div>
    );
}

export default Login;