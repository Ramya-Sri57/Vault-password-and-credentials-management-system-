import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import "../css/Auth.css";
import toast from "react-hot-toast";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);


    const sendOtp = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    // Frontend validation
    if (!trimmedEmail) {
        toast.error("Please enter your email address.");
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
        toast.error("Please enter a valid email address.");
        return;
    }

    try {
        setLoading(true);

        await API.post("/auth/forgot-password", {
            email: trimmedEmail
        });

        setEmail(trimmedEmail);
        setOtpSent(true);

        toast.success("OTP sent successfully!");

    } catch (error) {
        console.error("Forgot password error:", error);

        if (error.response) {
            const status = error.response.status;

            if (status === 400) {
                toast.error(
                    error.response.data?.message ||
                    error.response.data ||
                    "Invalid email address."
                );

            } else if (status === 404) {
                toast.error(
                    "No account found with this email address."
                );

            } else if (status === 429) {
                toast.error(
                    "Too many OTP requests. Please try again later."
                );

            } else if (status >= 500) {
                toast.error(
                    "Server error. Unable to send OTP. Please try again later."
                );

            } else {
                toast.error(
                    error.response.data?.message ||
                    error.response.data ||
                    "Unable to send OTP."
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

    // OTP success screen
    if (otpSent) {

        return (

            <div className="auth-page">

                <div className="auth-card success-card">


                    <div className="success-icon">
                        ✉️
                    </div>


                    <h2>
                        OTP Sent Successfully
                    </h2>


                    <p className="subtitle">
                        We have sent a 6-digit verification OTP to
                    </p>


                    <h3 className="email-text">
                        {email}
                    </h3>


                    <button
                        onClick={() =>
                            navigate("/verify-otp", {
                                state:{email}
                            })
                        }
                    >
                        Continue
                    </button>


                </div>

            </div>

        );
    }



    return (

        <div className="auth-page">


            <div className="auth-card">


                <div className="forgot-icon">
                    🔐
                </div>


                <h2>
                    Forgot Password?
                </h2>


                <p className="subtitle">
                    Don't worry! Enter your registered email and we will send you an OTP to reset your password.
                </p>



                <form onSubmit={sendOtp}>


                    <input

                        type="email"

                        placeholder="Enter your email address"

                        value={email}

                        onChange={(e)=>
                            setEmail(e.target.value)
                        }

                        required

                    />



                    <button 
                        type="submit"
                        disabled={loading}
                    >

                        {
                            loading 
                            ? "Sending OTP..."
                            : "Send OTP"
                        }

                    </button>


                </form>



                <Link 
                    to="/" 
                    className="bottom-link"
                >
                    ← Back to Login
                </Link>


            </div>


        </div>

    );

}


export default ForgotPassword;