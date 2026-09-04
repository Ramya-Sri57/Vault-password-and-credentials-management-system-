import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import "../css/SecurityReports.css";

function SecurityReports() {

    const navigate = useNavigate();

    const [passwordHealth, setPasswordHealth] = useState(null);

    const [loginReport, setLoginReport] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {

        try {

            setLoading(true);

            const [passwordResponse, loginResponse] =
                await Promise.all([
                    API.get("/security/password-health"),
                    API.get("/security/login-activity-report")
                ]);

            setPasswordHealth(passwordResponse.data);

            setLoginReport(loginResponse.data);

            setError("");

        } catch (error) {

            console.error("Failed to fetch security reports:", error);

            setError("Unable to load security reports.");

        } finally {

            setLoading(false);

        }
    };

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };

    return (

        <div className="security-reports">

            <main className="security-reports-content">

                {/* Navigation */}

                <header className="top-navbar">

                    <div className="logo">
                        🔐 <span>Password Vault</span>
                    </div>

                    <nav className="nav-links">

                        <Link to="/profile" className="nav-btn">
                            👤 Profile
                        </Link>

                        <Link to="/dashboard" className="nav-btn">
                            📊 Dashboard
                        </Link>

                        <Link to="/add-credential" className="nav-btn">
                            ➕ Add Password
                        </Link>

                        <Link to="/credentials" className="nav-btn">
                            🔑 My Passwords
                        </Link>

                        <Link to="/shared-with-me" className="nav-btn">
                            📥 Shared With Me
                        </Link>

                        <Link to="/shared-by-me" className="nav-btn">
                            📤 Shared By Me
                        </Link>

                        <Link
                            to="/security-analytics"
                            className="nav-btn"
                        >
                            🛡️ Security Analytics
                        </Link>

                        <Link
                            to="/security-reports"
                            className="nav-btn active"
                        >
                            📑 Security Reports
                        </Link>

                    </nav>

                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </header>

                {/* Page Header */}

                <section className="reports-header">

                    <div>

                        <h1>Security Reports</h1>

                        <p>
                            Review password health and login activity
                            using your actual security data.
                        </p>

                    </div>

                    <div className="reports-icon">
                        📑
                    </div>

                </section>

                {error && (

                    <div className="reports-error">
                        ⚠️ {error}
                    </div>

                )}

                {loading ? (

                    <div className="reports-loading">
                        Loading security reports...
                    </div>

                ) : (

                    <>

                        {/* Password Health Report */}

                        <section className="report-section">

                            <div className="section-title">

                                <h2>🔐 Password Health Report</h2>

                                <p>
                                    Analysis of the strength of your stored
                                    passwords.
                                </p>

                            </div>

                            <div className="report-cards">

                                <div className="report-card">

                                    <span className="report-icon">
                                        🔑
                                    </span>

                                    <h3>
                                        {passwordHealth?.totalPasswords}
                                    </h3>

                                    <p>Total Passwords</p>

                                </div>

                                <div className="report-card">

                                    <span className="report-icon">
                                        🛡️
                                    </span>

                                    <h3>
                                        {passwordHealth?.strongPasswords}
                                    </h3>

                                    <p>Strong Passwords</p>

                                </div>

                                <div className="report-card">

                                    <span className="report-icon">
                                        🟡
                                    </span>

                                    <h3>
                                        {passwordHealth?.mediumPasswords}
                                    </h3>

                                    <p>Medium Passwords</p>

                                </div>

                                <div className="report-card">

                                    <span className="report-icon">
                                        ⚠️
                                    </span>

                                    <h3>
                                        {passwordHealth?.weakPasswords}
                                    </h3>

                                    <p>Weak Passwords</p>

                                </div>

                            </div>

                            <div className="health-summary">

                                <div>

                                    <h3>Overall Password Health</h3>

                                    <p>
                                        Based on the strength of your
                                        stored passwords.
                                    </p>

                                </div>

                                <strong>
                                    {passwordHealth?.healthPercentage?.toFixed(1)}%
                                </strong>

                            </div>

                        </section>


                        {/* Login Activity Report */}

                        <section className="report-section">

                            <div className="section-title">

                                <h2>🔑 Login Activity Report</h2>

                                <p>
                                    Summary of your recorded login attempts.
                                </p>

                            </div>

                            <div className="report-cards">

                                <div className="report-card">

                                    <span className="report-icon">
                                        🔐
                                    </span>

                                    <h3>
                                        {loginReport?.totalAttempts}
                                    </h3>

                                    <p>Total Attempts</p>

                                </div>

                                <div className="report-card">

                                    <span className="report-icon">
                                        ✅
                                    </span>

                                    <h3>
                                        {loginReport?.successfulLogins}
                                    </h3>

                                    <p>Successful Logins</p>

                                </div>

                                <div className="report-card">

                                    <span className="report-icon">
                                        ❌
                                    </span>

                                    <h3>
                                        {loginReport?.failedLogins}
                                    </h3>

                                    <p>Failed Logins</p>

                                </div>

                            </div>
                            <div className="recent-login-activity">

    <h3>🕒 Recent Login Activity</h3>

    {loginReport?.recentActivities?.length > 0 ? (

        <div className="login-activity-list">

            {loginReport.recentActivities.map(
                (activity, index) => (

                    <div
                        className="login-activity-item"
                        key={index}
                    >

                        <div>

                            <strong>
                                {activity.status === "SUCCESS"
                                    ? "Successful Login"
                                    : "Failed Login"}
                            </strong>

                            <p>
                                {new Date(
                                    activity.loginTime
                                ).toLocaleString()}
                            </p>

                        </div>

                        <span
                            className={
                                activity.status === "SUCCESS"
                                    ? "login-status success"
                                    : "login-status failed"
                            }
                        >
                            {activity.status}
                        </span>

                    </div>

                )
            )}

        </div>

    ) : (

        <p className="no-login-activity">
            No recent login activity.
        </p>

    )}

</div>

                        </section>

                    </>

                )}

            </main>

        </div>

    );

}

export default SecurityReports;