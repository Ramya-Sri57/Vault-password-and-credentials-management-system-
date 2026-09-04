import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import "../css/Auth.css";
import toast from "react-hot-toast";
function VerifyOtp() {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(30);
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {

    if (timer === 0) return;

    const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);

}, [timer]);

    const verifyOtp = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.trim();

    // Frontend validation
    if (!email) {
        toast.error("Email information is missing. Please start again.");
        navigate("/forgot-password");
        return;
    }

    if (!enteredOtp) {
        toast.error("Please enter the OTP.");
        return;
    }

    if (!/^\d{6}$/.test(enteredOtp)) {
        toast.error("Please enter a valid 6-digit OTP.");
        return;
    }

    setLoading(true);

    try {
        await API.post("/auth/verify-otp", {
            email,
            otp: enteredOtp
        });

        toast.success("OTP verified successfully!");

        setVerified(true);

    } catch (error) {
        console.error("OTP verification error:", error);

        if (error.response) {
            const status = error.response.status;

            if (status === 400) {
                toast.error(
                    error.response.data?.message ||
                    error.response.data ||
                    "Invalid or expired OTP."
                );

            } else if (status === 404) {
                toast.error(
                    "No account found for this email address."
                );

            } else if (status === 429) {
                toast.error(
                    "Too many verification attempts. Please try again later."
                );

            } else if (status >= 500) {
                toast.error(
                    "Server error. Unable to verify OTP. Please try again later."
                );

            } else {
                toast.error(
                    error.response.data?.message ||
                    error.response.data ||
                    "Unable to verify OTP."
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
    if (verified) {

    return (

        <div className="auth-page">

            <div className="auth-card success-card">

                <div className="success-icon">
                    ✅
                </div>

                <h2>
                    OTP Verified
                </h2>

                <p className="subtitle">
                    Your email has been verified successfully.
                </p>

                <button
                    onClick={() =>
                        navigate("/reset-password", {
                            state: { email }
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

                <h2>Verify Email</h2>

               <p className="subtitle">
    Enter the 6-digit OTP sent to
</p>

<h3>{email}</h3>

                <form onSubmit={verifyOtp}>

                    <input
    type="text"
    placeholder="Enter OTP"
    value={otp}
    maxLength={6}
    inputMode="numeric"
    onChange={(e) => {
        const value = e.target.value.replace(/\D/g, "");
        setOtp(value);
    }}
    required
/>

                   <button
    type="submit"
    disabled={loading}
>
    {loading ? "Verifying..." : "Verify OTP"}
</button>
                    <div style={{ marginTop: "15px" }}>

<button
    type="button"
    disabled={timer > 0}
    className="secondary-btn"
    onClick={async () => {

    if (!email) {
        toast.error("Email information is missing. Please start again.");
        navigate("/forgot-password");
        return;
    }

    try {

        await API.post("/auth/forgot-password", {
            email
        });

        toast.success("OTP sent successfully!");
        setTimer(30);

    } catch (error) {

        console.error("Resend OTP error:", error);

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
                    "Server error. Unable to resend OTP."
                );

            } else {
                toast.error(
                    error.response.data?.message ||
                    error.response.data ||
                    "Unable to resend OTP."
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
}}
>

{
    timer > 0
    ? `Resend OTP in ${timer}s`
    : "Resend OTP"
}

</button>

</div>

                </form>

            </div>

        </div>

    );

}

export default VerifyOtp;