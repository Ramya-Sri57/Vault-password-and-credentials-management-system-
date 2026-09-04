import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import "../css/Auth.css";
import toast from "react-hot-toast";

function ChangePassword() {

    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const updatePassword = async (e) => {
        e.preventDefault();

        // Frontend validation
        if (!currentPassword.trim()) {
            toast.error("Please enter your current password.");
            return;
        }

        if (!newPassword.trim()) {
            toast.error("Please enter a new password.");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters.");
            return;
        }

        if (currentPassword === newPassword) {
            toast.error(
                "New password must be different from your current password."
            );
            return;
        }

        setLoading(true);

        try {

            await API.put("/profile/change-password", {
                currentPassword,
                newPassword
            });

            toast.success("Password changed successfully!");

            setCurrentPassword("");
            setNewPassword("");

            setTimeout(() => {
                navigate("/profile");
            }, 1000);

        } catch (error) {

            console.error("Change password error:", error);

            if (error.response) {

                const status = error.response.status;

                if (status === 401) {

                    toast.error(
                        "Your session has expired. Please login again."
                    );

                    localStorage.removeItem("token");
                    navigate("/login");

                } else if (status === 403) {

                    toast.error(
                        "You are not authorized to change the password."
                    );

                } else if (status === 400) {

                    toast.error(
                        error.response.data?.message ||
                        error.response.data ||
                        "Current password is incorrect or password details are invalid."
                    );

                } else if (status === 404) {

                    toast.error("User profile not found.");

                } else if (status >= 500) {

                    toast.error(
                        "Server error. Unable to change password."
                    );

                } else {

                    toast.error(
                        error.response.data?.message ||
                        error.response.data ||
                        "Unable to change password."
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
        <div className="auth-page">

            <div className="auth-card">

                <h2>Change Password</h2>

                <form
                    className="auth-form"
                    onSubmit={updatePassword}
                >

                    <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) =>
                            setCurrentPassword(e.target.value)
                        }
                    />

                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(e.target.value)
                        }
                    />

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Updating..."
                            : "Update Password"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default ChangePassword;