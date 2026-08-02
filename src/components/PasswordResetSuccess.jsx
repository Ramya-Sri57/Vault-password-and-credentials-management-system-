import { Link } from "react-router-dom";
import "../css/Auth.css";

function PasswordResetSuccess() {

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h2>Password Reset Successful 🎉</h2>

                <p className="subtitle">
                    Your password has been updated successfully.
                </p>

                <Link to="/">
                    <button>
                        Go to Login
                    </button>
                </Link>

            </div>

        </div>
    );

}

export default PasswordResetSuccess;