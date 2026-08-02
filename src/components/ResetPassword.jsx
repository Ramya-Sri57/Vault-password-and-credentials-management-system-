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
        if (newPassword !== confirmPassword) {
    toast.error("Passwords do not match.");
    return;
}

        try {

            const response = await API.post("/auth/reset-password", {
                email,
                newPassword
            });

            setMessage("Password updated successfully ✅");
setPasswordUpdated(true);
        } catch (error) {

            if (error.response) {
                toast.error(error.response.data);
            } else {
                toast.error(error.message);
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