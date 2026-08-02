import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import "../css/Credentials.css";
import toast from "react-hot-toast";

function Credentials() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState([]);
    const [search, setSearch] = useState("");
    const [visiblePasswords, setVisiblePasswords] = useState({});
    useEffect(() => {
        fetchCredentials();
    }, []);

    const fetchCredentials = async () => {

        try {

            const response = await API.get("/credentials", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

console.log("API Response:", response.data);
setCredentials(response.data);
        } catch (error) {

            console.log(error);

        }

    };

    const togglePassword = (id) => {

        setVisiblePasswords({
            ...visiblePasswords,
            [id]: !visiblePasswords[id]
        });

    };
    const copyPassword = async (password) => {

    try {

        await navigator.clipboard.writeText(password);

        toast.success("Password copied to clipboard!");

    } catch (error) {

        toast.error("Unable to copy password.");

    }

};

    const deleteCredential = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this password?"
        );

        if (!confirmDelete) return;

        try {

           await API.delete(`/credentials/${id}`, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

toast.success("Password deleted successfully!");

fetchCredentials();
        } catch (error) {

           toast.error("Unable to delete password.");
        }

    };
    const filteredCredentials = credentials.filter((item) =>
    item.website.toLowerCase().includes(search.toLowerCase()) ||
    item.username.toLowerCase().includes(search.toLowerCase())
);
    return (

        <div className="credentials-page">

            <h2>My Passwords</h2>
            <input
    type="text"
    className="search-box"
    placeholder="🔍 Search by website or username..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
/>

            {
                credentials.length === 0 ? (

                    <p>No passwords saved.</p>

                ) : (

                    <div className="credential-grid">

                        {filteredCredentials.map((item) => (
                            <div
                                className="credential-card"
                                key={item.id}
                            >

                                <h3>{item.website}</h3>

                                <p>
                                    <strong>Username:</strong><br />
                                    {item.username}
                                </p>

                                <p>
                                    <strong>Password:</strong><br />

                                    {
                                        visiblePasswords[item.id]
                                            ? item.password
                                            : "••••••••••"
                                    }
                                </p>

                                <p>
                                    <strong>Notes:</strong><br />
                                    {item.notes || "-"}
                                </p>

                                <div className="credential-buttons">

    <button
        onClick={() => togglePassword(item.id)}
    >
        {
            visiblePasswords[item.id]
                ? "🙈 Hide"
                : "👁 Show"
        }
    </button>

    <button
        onClick={() => copyPassword(item.password)}
    >
        📋 Copy
    </button>

    <button
        onClick={() => navigate(`/edit-credential/${item.id}`)}
    >
        ✏ Edit
    </button>

    <button
        onClick={() => deleteCredential(item.id)}
    >
        🗑 Delete
    </button>

</div>

                            </div>

                        ))}

                    </div>

                )
            }

        </div>

    );

}

export default Credentials;