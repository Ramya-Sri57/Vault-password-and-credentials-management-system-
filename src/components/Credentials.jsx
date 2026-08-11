import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import "../css/Credentials.css";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

function Credentials() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState([]);
const [search, setSearch] = useState("");
const categories = [
    "All Categories",
    "Shopping",
    "Email",
    "Work",
    "Banking",
    "Social Media",
    "Entertainment",
    "Education",
    "Finance",
    "Personal",
    "Others"
];
const [selectedCategory, setSelectedCategory] = useState("All Categories");
const [visiblePasswords, setVisiblePasswords] = useState({});
const [showShareModal, setShowShareModal] = useState(false);

const [selectedCredential, setSelectedCredential] = useState(null);

const [shareEmail, setShareEmail] = useState("");
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
setCredentials(response.data);
response.data.forEach(item => {
    console.log(item.website, item.category);
});
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

   const getWebsiteIcon = (website) => {

    const site = website.toLowerCase();

    if (site.includes("google")) return "🔵";
    if (site.includes("github")) return "🐙";
    if (site.includes("facebook")) return "📘";
    if (site.includes("instagram")) return "📸";
    if (site.includes("linkedin")) return "💼";
    if (site.includes("amazon")) return "🛒";
    if (site.includes("flipkart")) return "🛍️";
    if (site.includes("meesho")) return "🛍️";
    if (site.includes("shopsy")) return "🛒";
    if (site.includes("netflix")) return "🎬";
    if (site.includes("youtube")) return "▶️";
    if (site.includes("gmail")) return "📧";
    if (site.includes("bank")) return "🏦";

    return "🌐";
}; 

const getPasswordStrength = (password) => {

    if (!password) return {
        text: "Weak",
        className: "weak-badge"
    };

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&#]/.test(password)) score++;

    if (score >= 5) {
        return {
            text: "Strong",
            className: "strong-badge"
        };
    }

    if (score >= 3) {
        return {
            text: "Medium",
            className: "medium-badge"
        };
    }

    return {
        text: "Weak",
        className: "weak-badge"
    };

};
    const filteredCredentials = credentials.filter((item) => {

    const matchesSearch =
        item.website.toLowerCase().includes(search.toLowerCase()) ||
        item.username.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
    selectedCategory === "All Categories" ||
    item.category?.trim().toUpperCase() ===
    selectedCategory.trim().toUpperCase();
    return matchesSearch && matchesCategory;

});

const isExpired = (expiryDate) => {

    if (!expiryDate) return false;

    return new Date(expiryDate) < new Date();

};

const openShareModal = (credential) => {

    setSelectedCredential(credential);

    setShareEmail("");

    setShowShareModal(true);

};

const shareCredential = async () => {

    if (!shareEmail.trim()) {
        toast.error("Please enter recipient email.");
        return;
    }

    try {

        await API.post(
            "/share",
            {
                credentialId: selectedCredential.id,
                email: shareEmail
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        toast.success("Credential shared successfully!");

        setShowShareModal(false);

        setShareEmail("");

    } catch (error) {

    console.log("Complete Error:", error);

    console.log("Response:", error.response);

    console.log("Response Data:", error.response?.data);

    toast.error(
        error.response?.data || "Sharing failed."
    );

}

};
   return (

    <div className="credentials-page">

        <div className="credentials-header">

            <div>

                <h1>My Passwords</h1>

                <p>Manage and secure all your saved accounts.</p>

            </div>

            <button
                className="add-password-btn"
                onClick={() => navigate("/add-credential")}
            >
                ➕ Add Password
            </button>

        </div>

        <div className="credentials-toolbar">

            <input
                type="text"
                className="search-box"
                placeholder="🔍 Search website or username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <select
    className="category-filter"
    value={selectedCategory}
    onChange={(e) =>
        setSelectedCategory(e.target.value)
    }
>

    {categories.map(category => (

        <option
            key={category}
            value={category}
        >
            {category}
        </option>

    ))}

</select>
        </div>

        {

            filteredCredentials.length === 0 ?

            (

                <div className="empty-state">

                    <h3>No Passwords Found</h3>

                    <p>
                        Add your first password to keep it secure.
                    </p>

                </div>

            )

            :

            (

                <div className="credential-grid">

                    {

                        filteredCredentials.map((item) => (

                            <div
                                className="credential-card"
                                key={item.id}
                            >

                                <div className="card-header">

                                    <div>

                                       <div className="website-title">

    <div className="website-avatar">

        {item.website.charAt(0).toUpperCase()}

    </div>

    <h3>{item.website}</h3>

</div>

                                    </div>

                                    <div className="card-badges">

    <span className="category-badge">

        {item.category || "Others"}

    </span>

    <span
        className={
            getPasswordStrength(item.password).className
        }
    >

        {getPasswordStrength(item.password).text}

    </span>

</div>

                                </div>

                                <div className="credential-info">

                                    <label>👤 Username</label>

                                    <p>{item.username}</p>

                                </div>

                                <div className="credential-info">

                                    <label>🔒 Password</label>

                                    <p>

                                        {

                                            visiblePasswords[item.id]

                                            ?

                                            item.password

                                            :

                                            "••••••••••••"

                                        }

                                    </p>

                                </div>

                                <div className="credential-info">

                                    <label>📝 Notes</label>

                                    <p>

                                        {

                                            item.notes ||

                                            "No notes available"

                                        }

                                    </p>

                                </div>

                                <div className="action-buttons">

                                   <button
    className="view-btn"
    onClick={() =>
        togglePassword(item.id)
    }
>
    {
        visiblePasswords[item.id]
        ?
        <>
            <EyeOff size={18} />
            Hide
        </>
        :
        <>
            <Eye size={18} />
            View
        </>
    }
</button>

                                    <button
                                        className="copy-btn"
                                        onClick={() =>
                                            copyPassword(item.password)
                                        }
                                    >

                                        📋 Copy

                                    </button>

                                    <button
                                        className="edit-btn"
                                        onClick={() =>
                                            navigate(
                                                `/edit-credential/${item.id}`
                                            )
                                        }
                                    >

                                        ✏ Edit

                                    </button>

                                    <button
    className="share-btn"
    onClick={() => openShareModal(item)}
>
    🔗 Share
</button>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            deleteCredential(item.id)
                                        }
                                    >

                                        🗑 Delete

                                    </button>

                                </div>

                            </div>

                        ))

                    }

                </div>

            )

        }

        {showShareModal && (

    <div className="modal-overlay">

        <div className="share-modal">

            <h2>🔗 Share Credential</h2>

            <p>
                Share
                <strong> {selectedCredential?.website} </strong>
                with another registered user.
            </p>

            <input
                type="email"
                placeholder="Recipient Email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
            />

            <div className="modal-buttons">

                <button
                    className="cancel-btn"
                    onClick={() => setShowShareModal(false)}
                >
                    Cancel
                </button>

                <button
                    className="share-confirm-btn"
                    onClick={shareCredential}
                >
                    Share
                </button>

            </div>

        </div>

    </div>

)}

    </div>

);
}

export default Credentials;