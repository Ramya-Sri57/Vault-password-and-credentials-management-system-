import { useState } from "react";
import API from "../api/axiosConfig";
import "../styles/auth.css";
import { Link } from "react-router-dom";
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
        setLoading(true);

        try {
            const response = await API.post(
                "/auth/register",
                user
            );

            console.log("Registration response:", response.data);

            setSuccess("Account created successfully!");

            setUser({
                fullName: "",
                email: "",
                password: ""
            });

        } catch (error) {
            console.error("Registration error:", error);

            if (error.response) {
                setError(
                    error.response.data?.message ||
                    "Registration failed. Please try again."
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
                            ? "Creating account..."
                            : "Create Account"}
                    </button>

                </form>

                <div className="auth-footer">

    <span>
        Already have an account?
    </span>

    <Link to="/login" className="link-button">
        Login
    </Link>

</div>

            </div>
        </div>
    );
}

export default Register;