import { useState } from "react";
import API from "../api/axiosConfig";
import "../css/Auth.css";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Register() {
    const [user, setUser] = useState({
        fullName: "",
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

    const registerUser = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Frontend validation
    if (!user.fullName.trim()) {
        setError("Please enter your full name.");
        return;
    }

    if (!user.email.trim()) {
        setError("Please enter your email.");
        return;
    }

    if (!user.password.trim()) {
        setError("Please enter a password.");
        return;
    }

    if (user.password.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
    }

    setLoading(true);

    try {
        const response = await API.post("/auth/register", {
            fullName: user.fullName.trim(),
            email: user.email.trim(),
            password: user.password
        });

        console.log("Registration response:", response.data);

        setSuccess("Account created successfully!");

        setUser({
            fullName: "",
            email: "",
            password: ""
        });

        setShowPassword(false);

    } catch (error) {
        console.error("Registration error:", error);

        if (error.response) {
            const status = error.response.status;

            if (status === 409) {
                setError("An account with this email already exists.");
            } else if (status === 400) {
                setError(
                    error.response.data?.message ||
                    "Please check your registration details."
                );
            } else if (status >= 500) {
                setError("Server error. Please try again later.");
            } else {
                setError(
                    error.response.data?.message ||
                    "Registration failed. Please try again."
                );
            }

        } else if (error.request) {
            setError(
                "Unable to connect to the server. Please check your connection and try again."
            );

        } else {
            setError("Something went wrong. Please try again.");
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
                    <h2>Create Account</h2>

                    <p>
                        Start protecting your credentials today
                    </p>
                </div>

                <form
                    onSubmit={registerUser}
                    className="auth-form"
                >

                    <div className="form-group">
                        <label>Full Name</label>

                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={user.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                                placeholder="Create a password"
                                value={user.password}
                                onChange={handleChange}
                                minLength="8"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
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
                            ? "Creating account..."
                            : "Create Account"}
                    </button>

                </form>

                <div className="auth-footer">

                    <span>
                        Already have an account?
                    </span>

                    <Link
                        to="/login"
                        className="link-button"
                    >
                        Login
                    </Link>

                </div>

            </div>
        </div>
    );
}

export default Register;