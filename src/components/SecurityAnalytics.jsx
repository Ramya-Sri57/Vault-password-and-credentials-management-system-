import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import "../css/SecurityAnalytics.css";

function SecurityAnalytics() {
    const navigate = useNavigate();

    const [analytics, setAnalytics] = useState({
        totalLoginAttempts: 0,
        successfulLogins: 0,
        failedLogins: 0,
        suspiciousActivities: 0,
        securityAlerts: 0,
        auditActivities: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);

            const response = await API.get("/security/analytics");

            setAnalytics(response.data);
            setError("");

        } catch (error) {
            console.error("Failed to fetch security analytics:", error);
            setError("Unable to load security analytics.");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="security-analytics">

            <main className="security-analytics-content">

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
                            className="nav-btn active"
                        >
                            🛡️ Security Analytics
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
                <section className="analytics-header">

                    <div>
                        <h1>Security Analytics</h1>

                        <p>
                            Monitor login activity, suspicious behavior,
                            security alerts, and audit activities.
                        </p>
                    </div>

                    <div className="security-icon">
                        🛡️
                    </div>

                </section>

                {/* Error */}
                {error && (
                    <div className="analytics-error">
                        ⚠️ {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="analytics-loading">
                        Loading security analytics...
                    </div>
                ) : (

                    <section className="analytics-cards">

                        <div className="analytics-card">
                            <div className="analytics-card-icon">
                                🔐
                            </div>

                            <h2>
                                {analytics.totalLoginAttempts}
                            </h2>

                            <p>Total Login Attempts</p>
                        </div>

                        <div className="analytics-card">
                            <div className="analytics-card-icon">
                                ✅
                            </div>

                            <h2>
                                {analytics.successfulLogins}
                            </h2>

                            <p>Successful Logins</p>
                        </div>

                        <div className="analytics-card">
                            <div className="analytics-card-icon">
                                ❌
                            </div>

                            <h2>
                                {analytics.failedLogins}
                            </h2>

                            <p>Failed Logins</p>
                        </div>

                        <div className="analytics-card">
                            <div className="analytics-card-icon">
                                🚨
                            </div>

                            <h2>
                                {analytics.suspiciousActivities}
                            </h2>

                            <p>Suspicious Activities</p>
                        </div>

                        <div className="analytics-card">
                            <div className="analytics-card-icon">
                                ⚠️
                            </div>

                            <h2>
                                {analytics.securityAlerts}
                            </h2>

                            <p>Security Alerts</p>
                        </div>

                        <div className="analytics-card">
                            <div className="analytics-card-icon">
                                📋
                            </div>

                            <h2>
                                {analytics.auditActivities}
                            </h2>

                            <p>Audit Activities</p>
                        </div>

                    </section>

                )}

                {/* Security Overview */}
                {!loading && !error && (
                    <section className="security-overview">

                        <h2>Security Overview</h2>

                        <p>
                            Your security analytics are generated from
                            actual login activities, suspicious activity
                            records, security alerts, and audit logs stored
                            in the backend database.
                        </p>

                    </section>
                )}

            </main>

        </div>
    );
}

export default SecurityAnalytics;