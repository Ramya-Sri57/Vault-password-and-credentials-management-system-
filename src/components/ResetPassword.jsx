import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import "../css/Auth.css";
import toast from "react-hot-toast";

function ResetPassword() {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [newPassword, setNewPassword] = useState("");
    const [passwordUpdated, setPasswordUpdated] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const resetPassword = async (e) => {
    e.preventDefault();

    // Check email information
    if (!email) {
        toast.error(
            "Reset session is invalid. Please request a new OTP."
        );
        navigate("/forgot-password");
        return;
    }

    // Password validation
    if (!newPassword.trim()) {
        toast.error("Please enter a new password.");
        return;
    }

    if (newPassword.length < 8) {
        toast.error("Password must be at least 8 characters.");
        return;
    }

    // Confirm password
    if (!confirmPassword.trim()) {
        toast.error("Please confirm your new password.");
        return;
    }

    if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
    }

    try {
        await API.post("/auth/reset-password", {
            email,
            newPassword
        });

        setMessage("Password updated successfully ✅");
        setPasswordUpdated(true);

        toast.success("Password reset successfully!");

    } catch (error) {
        console.error("Reset password error:", error);

        if (error.response) {
            const status = error.response.status;

            if (status === 400) {
                toast.error(
                    error.response.data?.message ||
                    error.response.data ||
                    "Invalid password reset request."
                );

            } else if (status === 401) {
                toast.error(
                    "Your reset session has expired. Please request a new OTP."
                );
                navigate("/forgot-password");

            } else if (status === 403) {
                toast.error(
                    "You are not authorized to reset this password."
                );

            } else if (status === 404) {
                toast.error(
                    "Account not found. Please request a new password reset."
                );

            } else if (status >= 500) {
                toast.error(
                    "Server error. Unable to reset password. Please try again later."
                );

            } else {
                toast.error(
                    error.response.data?.message ||
                    error.response.data ||
                    "Unable to reset password."
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
    }
};

    if (passwordUpdated) {

    return (

        <div className="auth-page">

            <div className="auth-card success-card">

                <div className="success-icon">
                    🎉
                </div>

                <h2>
                    Password Updated
                </h2>

                <p className="success-message">
    Password updated successfully ✅
</p>

                <button
                    onClick={() => navigate("/")}
                >
                    Back to Login
                </button>

            </div>

        </div>

    );

}
    return (

        <div className="auth-page">

            <div className="auth-card">

                <h2>Reset Password</h2>

                <p className="subtitle">
                    Enter your new password
                </p>

                <form onSubmit={resetPassword}>

    {/* New Password */}
    <div className="password-wrapper">

       <input
    type="password"
    placeholder="New Password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    minLength={8}
    required
/>

        

    </div>

    {/* Confirm Password */}
    <div className="password-wrapper">

        <input
           type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
        />

        

    </div>

    {
        confirmPassword &&
        newPassword !== confirmPassword && (

            <div className="error-message">
                Passwords do not match.
            </div>

        )
    }

    <button type="submit">
        Reset Password
    </button>

</form>

            </div>

        </div>

    );
}

export default ResetPassword;