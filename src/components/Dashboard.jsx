import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import "../css/Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

const [profile, setProfile] = useState(null);
const [credentials, setCredentials] = useState([]);

useEffect(() => {

    fetchProfile();
    fetchCredentials();

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

const totalPasswords = credentials.length;

const totalWebsites = new Set(
    credentials.map(item => item.website)
).size;
    return (

        <div className="dashboard">

            <aside className="sidebar">

                <h2>🔐 Password Vault</h2>

                <nav>

                    <Link to="/dashboard">🏠 Dashboard</Link>

                    <Link to="/profile">👤 Profile</Link>

                    <Link to="/credentials">🔑 My Passwords</Link>

<Link to="/add-credential">➕ Add Password</Link>
                   <button
    className="logout-btn"
    onClick={() => {
        localStorage.removeItem("token");
        navigate("/");
    }}
>
    🚪 Logout
</button>

                </nav>

            </aside>

            <main className="content">

               <h1>
    Welcome, {profile?.fullName || "User"} 👋
</h1>

                <p>
                    Manage all your passwords securely from one place.
                </p>

               <div className="cards">

    <div className="card">
        <h3>{totalPasswords}</h3>
        <p>Saved Passwords</p>
    </div>

    <div className="card">
        <h3>{totalWebsites}</h3>
        <p>Websites Saved</p>
    </div>

    <div className="card">
        <h3>Protected</h3>
        <p>JWT Secured</p>
    </div>

    <div className="card">
        <h3>{profile?.fullName || "-"}</h3>
        <p>Account Owner</p>
    </div>

</div>

            </main>

        </div>

    );

}

export default Dashboard;