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

        try {

            setLoading(true);

            await API.post("/auth/forgot-password", {
                email
            });

            setOtpSent(true);

        } catch (error) {

            console.log(error);

           toast.error(
    error.response?.data ||
    "Unable to send OTP"
);

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