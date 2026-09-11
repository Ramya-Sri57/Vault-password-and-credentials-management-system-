import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import "../css/Auth.css";
import toast from "react-hot-toast";
function Login() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
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

    // Frontend validation
    if (!user.email.trim() || !user.password.trim()) {
        setError("Please enter both email and password.");
        return;
    }

    setLoading(true);

try {
    const response = await API.post("/auth/login", {
        email: user.email.trim(),
        password: user.password
    });

    console.log("LOGIN RESPONSE:", response.data);
    console.log("TOKEN FIELD:", response.data.token);

    // Save JWT token
    localStorage.setItem("token", response.data.token);

    console.log(
        "TOKEN SAVED:",
        localStorage.getItem("token")
    );

    toast.success("Login successful!");

    setTimeout(() => {
        navigate("/dashboard");
    }, 1000);
    } catch (error) {
        console.error("Login error:", error);

        if (error.response) {
            const status = error.response.status;

            if (status === 401 || status === 403) {
                setError("Invalid email or password.");
            } else if (status === 400) {
                setError(
                    error.response.data?.message ||
                    "Please check your email and password."
                );
            } else if (status >= 500) {
                setError("Server error. Please try again later.");
            } else {
                setError(
                    error.response.data?.message ||
                    "Login failed. Please try again."
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

    <input
        type="password"
        name="password"
        placeholder="Enter your password"
        value={user.password}
        onChange={handleChange}
        required
    />

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
                    <div className="forgot-link">

    <Link to="/forgot-password">

        Forgot Password?

    </Link>

</div>

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