import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import "../css/Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

const [profile, setProfile] = useState(null);
const [credentials, setCredentials] = useState([]);
const [stats, setStats] = useState({
    totalPasswords: 0,
    totalCategories: 0,
    strongPasswords: 0,
    weakPasswords: 0
});
useEffect(() => {

    fetchProfile();
    fetchCredentials();
    fetchDashboardStats();

}, []);

const fetchProfile = async () => {

    try {

        const response = await API.get("/profile");

        setProfile(response.data);

    } catch (error) {

        console.log(error);

    }

};

const fetchCredentials = async () => {

    try {

        const response = await API.get("/credentials");

        setCredentials(response.data);

    } catch (error) {

        console.log(error);

    }

};

const fetchDashboardStats = async () => {

    try {

        const response = await API.get("/credentials/dashboard-stats");

        setStats(response.data);

    } catch (error) {

        console.log(error);

    }

};
const totalPasswords = credentials.length;

const totalWebsites = new Set(
    credentials.map(item => item.website)
).size;
    return (

<div className="dashboard">

    <main className="dashboard-content">

        {/* Top Navigation */}

        <header className="top-navbar">

            <div className="logo">
                🔐 <span>Password Vault</span>
            </div>

            <nav className="nav-links">

    <Link to="/profile" className="nav-btn">
        👤 Profile
    </Link>

    <Link to="/dashboard" className="nav-btn active">
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
<Link to="/security-analytics" className="nav-btn">
    🛡️ Security Analytics
</Link>
<Link to="/security-reports" className="nav-btn">
    📑 Security Reports
</Link>
</nav>
            <button
                className="logout-button"
                onClick={() => {

                    localStorage.removeItem("token");
                    navigate("/");

                }}
            >
              Logout
            </button>

        </header>

        {/* Welcome Banner */}

        <section className="welcome-card">

            <div>

                <h1>
                    Welcome back, {profile?.fullName || "User"} 👋
                </h1>

                <p>
                    Manage your passwords securely and keep your digital life safe.
                </p>

            </div>

            <div className="welcome-image">

                🔐🛡️

            </div>

        </section>

        {/* Statistics */}

        <section className="cards">

            <div className="card">

                <h2>🔐</h2>

                <h3>{stats.totalPasswords}</h3>

                <p>Total Passwords</p>

            </div>

            <div className="card">

                <h2>📁</h2>

                <h3>{stats.totalCategories}</h3>

                <p>Categories</p>

            </div>

            <div className="card">

                <h2>🛡️</h2>

                <h3>{stats.strongPasswords}</h3>

                <p>Strong Passwords</p>

            </div>

            <div className="card">

                <h2>⚠️</h2>

                <h3>{stats.weakPasswords}</h3>

                <p>Weak Passwords</p>

            </div>

        </section>

        {/* Recent Passwords */}

        <section className="recent-section">

            <div className="section-header">

                <h2>Recent Passwords</h2>

                <Link to="/credentials" className="view-all">

                    View All →

                </Link>

            </div>

            <div className="recent-list">

                {credentials.slice(0,5).map((item) => (

                    <div className="recent-item" key={item.id}>

                        <div>

                            <h4>{item.website}</h4>

                            <p>{item.username}</p>

                        </div>

                        <span className="category-badge">

                            {item.category || "General"}

                        </span>

                    </div>

                ))}

            </div>

        </section>

        {/* Security Tip */}

        <section className="security-tip">

            🛡️ <strong>Security Tip:</strong> Use unique passwords for every account and enable two-factor authentication whenever possible.

        </section>

    </main>

</div>

);

}

export default Dashboard;

