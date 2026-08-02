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

    setLoading(true);

    try {

        await API.post("/auth/verify-otp", {
            email,
            otp
        });

        toast.success("OTP verified successfully!");

        setVerified(true);

    } catch (error) {

        toast.error(
            error.response?.data || "Invalid OTP"
        );

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
                        onChange={(e) => setOtp(e.target.value)}
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

        try {

            await API.post("/auth/forgot-password", {
                email
            });

           toast.success("OTP sent successfully!");
            setTimer(30);

        } catch {

            toast.error("Unable to resend OTP.");

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