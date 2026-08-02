import { useState } from "react";
import "../css/Auth.css";

function ChangePassword() {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    return (
        <div className="auth-page">
            <div className="auth-card">

                <h2>Change Password</h2>

                <form className="auth-form">

                    <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <button className="auth-button">
                        Update Password
                    </button>

                </form>

            </div>
        </div>
    );
}

export default ChangePassword;