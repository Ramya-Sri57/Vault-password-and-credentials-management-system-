import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import "../css/AddCredential.css";
import toast from "react-hot-toast";

function AddCredential() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [strength, setStrength] = useState("");

    const [credential, setCredential] = useState({
        website: "",
        username: "",
        password: "",
        category: "OTHER",
        expiryDate: "",
        notes: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCredential({
            ...credential,
            [name]: value
        });

        if (name === "password") {
            setStrength(checkStrength(value));
        }
    };

    const checkStrength = (password) => {
    if (!password) {
        return "";
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&#]/.test(password)) score++;

    if (score >= 5) {
        return "Strong";
    }

    if (score >= 3) {
        return "Medium";
    }

    return "Weak";
};

    const generatePassword = () => {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

        let password = "";

        for (let i = 0; i < 16; i++) {
            password += chars.charAt(
                Math.floor(Math.random() * chars.length)
            );
        }

        setCredential({
            ...credential,
            password
        });

        setStrength(checkStrength(password));

        toast.success("Strong password generated!");
    };

    const saveCredential = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!credential.website.trim()) {
        toast.error("Please enter the website.");
        return;
    }

    if (!credential.username.trim()) {
        toast.error("Please enter the username or email.");
        return;
    }

    if (!credential.password.trim()) {
        toast.error("Please enter a password.");
        return;
    }

    if (credential.password.length < 8) {
        toast.error("Password must contain at least 8 characters.");
        return;
    }

    setLoading(true);

    try {
        await API.post(
            "/credentials",
            {
                ...credential,
                website: credential.website.trim(),
                username: credential.username.trim()
            }
        );

        toast.success("Password saved successfully!");

        setCredential({
            website: "",
            username: "",
            password: "",
            category: "OTHER",
            expiryDate: "",
            notes: ""
        });

        setStrength("");

        setTimeout(() => {
            navigate("/credentials");
        }, 1000);

    } catch (error) {
        console.error("Save credential error:", error);

        if (error.response) {
            const status = error.response.status;

            if (status === 401 || status === 403) {
                toast.error(
                    "Your session has expired. Please login again."
                );

                localStorage.removeItem("token");

                setTimeout(() => {
                    navigate("/login");
                }, 1000);

            } else if (status === 400) {
                toast.error(
                    error.response.data?.message ||
                    "Invalid credential details."
                );

            } else if (status === 404) {
                toast.error(
                    error.response.data?.message ||
                    "Unable to find the requested resource."
                );

            } else if (status >= 500) {
                toast.error(
                    "Server error. Please try again later."
                );

            } else {
                toast.error(
                    error.response.data?.message ||
                    "Unable to save password."
                );
            }

        } else if (error.request) {
            toast.error(
                "Unable to connect to the server. Please try again."
            );

        } else {
            toast.error(
                "Something went wrong. Please try again."
            );
        }

    } finally {
        setLoading(false);
    }
};
    return (
        <div className="add-page">

            <div className="add-card">

                <h2>Add New Password</h2>

                <form onSubmit={saveCredential}>

                    <div className="form-group">
                        <label>Website</label>

                        <input
                            type="text"
                            name="website"
                            placeholder="Enter website"
                            value={credential.website}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    <div className="form-group">
                        <label>Username / Email</label>

                        <input
                            type="text"
                            name="username"
                            placeholder="Enter username or email"
                            value={credential.username}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    <div className="form-group">

                        <label>Category</label>

                        <select
                            name="category"
                            value={credential.category}
                            onChange={handleChange}
                        >
                            <option value="SHOPPING">
                                🛒 Shopping
                            </option>

                            <option value="EMAIL">
                                📧 Email
                            </option>

                            <option value="WORK">
                                💼 Work
                            </option>

                            <option value="BANKING">
                                🏦 Banking
                            </option>

                            <option value="SOCIAL_MEDIA">
                                📱 Social Media
                            </option>

                            <option value="ENTERTAINMENT">
                                🎬 Entertainment
                            </option>

                            <option value="EDUCATION">
                                🎓 Education
                            </option>

                            <option value="FINANCE">
                                💰 Finance
                            </option>

                            <option value="PERSONAL">
                                👤 Personal
                            </option>

                            <option value="OTHER">
                                📂 Other
                            </option>
                        </select>

                    </div>


                    <div className="form-group">

                        <label>Password</label>

                        <div className="password-field">

                            <input
                                type="text"
                                name="password"
                                placeholder="Enter password"
                                value={credential.password}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="generate-btn"
                                onClick={generatePassword}
                            >
                                🎲 Generate
                            </button>

                        </div>


                        {credential.password && (
                            <p
                                className={`password-strength ${strength.toLowerCase()}`}
                            >
                                Strength: {strength}
                            </p>
                        )}

                    </div>


                    <div className="form-group">

                        <label>Password Expiry</label>

                        <input
                            type="date"
                            name="expiryDate"
                            value={credential.expiryDate}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="form-group">

                        <label>Notes</label>

                        <textarea
                            name="notes"
                            placeholder="Additional notes (optional)"
                            value={credential.notes}
                            onChange={handleChange}
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : "💾 Save Password"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AddCredential;