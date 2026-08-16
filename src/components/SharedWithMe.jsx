import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import "../css/SharedWithMe.css";
import { Eye, EyeOff } from "lucide-react";
function SharedWithMe() {
     const navigate = useNavigate();
    const [sharedCredentials, setSharedCredentials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [showManageModal, setShowManageModal] = useState(false);
const [manageCredential, setManageCredential] = useState(null);
const [usersWithAccess, setUsersWithAccess] = useState([]);
const [loadingUsers, setLoadingUsers] = useState(false);

const [newShareEmail, setNewShareEmail] = useState("");
const [newAccessLevel, setNewAccessLevel] = useState("VIEW");
    useEffect(() => {
        fetchSharedCredentials();
    }, []);

    const fetchSharedCredentials = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get(
                "/share/shared-with-me"
            );

            console.log(
                "Shared credentials:",
                response.data
            );

            setSharedCredentials(response.data);

        } catch (error) {

            console.error(
                "Failed to fetch shared credentials:",
                error
            );

            setError(
                "Unable to load shared credentials."
            );

        } finally {

            setLoading(false);

        }
    };

    const togglePassword = (id) => {

        setVisiblePasswords((previous) => ({
            ...previous,
            [id]: !previous[id]
        }));

    };

    const openManageSharing = async (item) => {

    try {

        setManageCredential(item);
        setShowManageModal(true);
        setLoadingUsers(true);

        const response = await API.get(
            `/share/${item.credentialId}/users`
        );

        setUsersWithAccess(response.data);

    } catch (error) {

        console.error(
            "Failed to load sharing details:",
            error
        );

        alert(
            error.response?.data ||
            "Unable to load sharing details."
        );

        setShowManageModal(false);

    } finally {

        setLoadingUsers(false);

    }
};

    if (loading) {

        return (
            <div className="shared-page">

                <div className="shared-card">

                    <p className="loading-text">
                        Loading shared credentials...
                    </p>

                </div>

            </div>
        );

    }

    return (

        <div className="shared-page">

            <div className="shared-container">

                <div className="shared-header">

                    <div>
                        <h2>📥 Shared With Me</h2>

                        <p>
                            Credentials shared with you by other users
                        </p>
                    </div>

                </div>

                {error && (
                    <div className="shared-error">
                        {error}
                    </div>
                )}

                {!error &&
                    sharedCredentials.length === 0 && (

                    <div className="empty-shared">

                        <div className="empty-icon">
                            📭
                        </div>

                        <h3>No Shared Credentials</h3>

                        <p>
                            No one has shared a credential
                            with you yet.
                        </p>

                    </div>

                )}

                {sharedCredentials.length > 0 && (

                    <div className="shared-grid">

                        {sharedCredentials.map((item) => (

                            <div
                                className="shared-credential-card"
                                key={item.shareId}
                            >

                                <div className="credential-top">

                                    <div className="website-icon">
                                        🔐
                                    </div>

                                    <div>

                                        <h3>
                                            {item.website}
                                        </h3>

                                        <span>
                                            Shared with you
                                        </span>

                                    </div>

                                </div>

                                <div className="credential-info">

                                    <div className="info-row">

                                        <span className="info-label">
                                            Username
                                        </span>

                                        <span className="info-value">
                                            {item.username}
                                        </span>

                                    </div>

                                    <div className="info-row">

                                        <span className="info-label">
                                            Password
                                        </span>

                                        <span className="info-value">

                                            {visiblePasswords[item.shareId]
                                                ? item.password
                                                : "••••••••••"
                                            }

                                        </span>

                                    </div>

                                    <div className="info-row">

                                        <span className="info-label">
                                            Shared By
                                        </span>

                                        <span className="info-value">
                                            {item.sharedBy}
                                        </span>

                                    </div>
                                    <div className="info-row">

    <span className="info-label">
        Access Level
    </span>

    <span className="info-value">

        {item.accessLevel === "VIEW" &&
            "👁 View Only"}

        {item.accessLevel === "EDIT" &&
            "✏️ Edit Access"}

        {item.accessLevel === "FULL_ACCESS" &&
            "🛡️ Full Management"}

    </span>

</div>

                                    {item.notes && (

                                        <div className="notes-section">

                                            <span className="info-label">
                                                Notes
                                            </span>

                                            <p>
                                                {item.notes}
                                            </p>

                                        </div>

                                    )}

                                </div>

                                <div className="shared-actions">

    {/* View Password - available for everyone */}
    <button
        className="password-toggle-btn"
        onClick={() =>
            togglePassword(item.shareId)
        }
        title={
            visiblePasswords[item.shareId]
                ? "Hide password"
                : "Show password"
        }
    >

        {visiblePasswords[item.shareId] ? (
            <EyeOff size={18} />
        ) : (
            <Eye size={18} />
        )}

        <span>
            {visiblePasswords[item.shareId]
                ? "Hide"
                : "View"
            }
        </span>

    </button>


    {/* Edit - EDIT and FULL_ACCESS only */}
    {(item.accessLevel === "EDIT" ||
      item.accessLevel === "FULL_ACCESS") && (

        <button
            className="edit-btn"
            onClick={() =>
                navigate(
                    `/edit-credential/${item.credentialId}`
                )
            }
        >
            ✏️ Edit
        </button>

    )}


    {/* Delete - FULL_ACCESS only */}
{item.accessLevel === "FULL_ACCESS" && (

    <button
        className="delete-btn"
        onClick={() => {

            if (
                window.confirm(
                    "Are you sure you want to delete this credential?"
                )
            ) {

                API.delete(
                    `/credentials/${item.credentialId}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                )
                .then(() => {

                    setSharedCredentials((previous) =>
                        previous.filter(
                            (credential) =>
                                credential.shareId !== item.shareId
                        )
                    );

                })
                .catch((error) => {

                    console.error(
                        "Failed to delete credential:",
                        error
                    );

                    alert(
                        error.response?.data ||
                        "Failed to delete credential."
                    );

                });

            }

        }}
    >
        🗑 Delete
    </button>

)}

{/* Manage Sharing - FULL_ACCESS only */}
{item.accessLevel === "FULL_ACCESS" && (

    <button
        className="manage-sharing-btn"
        onClick={() => openManageSharing(item)}
    >
        🔗 Manage Sharing
    </button>

)}

</div>

                            </div>

                        ))}

                    </div>

                )}

            </div>
            {showManageModal && manageCredential && (

    <div className="modal-overlay">

        <div className="share-modal">

            <h2>🔗 Manage Sharing</h2>

            <p>
                Manage access for
                <strong> {manageCredential.website} </strong>
            </p>


            <h3>Users With Access</h3>

            {loadingUsers ? (

                <p>Loading users...</p>

            ) : usersWithAccess.length === 0 ? (

                <p>
                    This credential has not been shared with anyone.
                </p>

            ) : (

                <div className="users-access-list">

                    {usersWithAccess.map((user) => (

                        <div
                            className="access-user-row"
                            key={user.shareId}
                        >

                            <div>

                                <strong>
                                    {user.sharedWith}
                                </strong>

                                <span>
                                    {user.accessLevel === "VIEW" &&
                                        "👁 View Only"}

                                    {user.accessLevel === "EDIT" &&
                                        "✏️ Edit Access"}

                                    {user.accessLevel === "FULL_ACCESS" &&
                                        "🛡️ Full Management"}
                                </span>

                            </div>

                            <button
                                className="delete-btn"
                                onClick={async () => {

                                    if (
                                        !window.confirm(
                                            `Revoke access for ${user.sharedWith}?`
                                        )
                                    ) {
                                        return;
                                    }

                                    try {

                                        await API.delete(
                                            `/share/${user.shareId}`
                                        );

                                        setUsersWithAccess(
                                            previous =>
                                                previous.filter(
                                                    current =>
                                                        current.shareId !==
                                                        user.shareId
                                                )
                                        );

                                    } catch (error) {

                                        alert(
                                            error.response?.data ||
                                            "Failed to revoke access."
                                        );

                                    }

                                }}
                            >
                                🗑 Revoke
                            </button>

                        </div>

                    ))}

                </div>

            )}


            <hr />


            <h3>Share With Another User</h3>

            <input
                type="email"
                placeholder="Recipient Email"
                value={newShareEmail}
                onChange={(e) =>
                    setNewShareEmail(e.target.value)
                }
            />


            <select
                value={newAccessLevel}
                onChange={(e) =>
                    setNewAccessLevel(e.target.value)
                }
            >

                <option value="VIEW">
                    👁 View Only
                </option>

                <option value="EDIT">
                    ✏️ Edit Access
                </option>

                <option value="FULL_ACCESS">
                    🛡️ Full Management
                </option>

            </select>


            <div className="modal-buttons">

                <button
                    className="cancel-btn"
                    onClick={() => {
                        setShowManageModal(false);
                        setNewShareEmail("");
                    }}
                >
                    Close
                </button>

                <button
                    className="share-confirm-btn"
                    onClick={async () => {

                        if (!newShareEmail.trim()) {

                            alert(
                                "Please enter recipient email."
                            );

                            return;
                        }

                        try {

                            await API.post(
                                "/share",
                                {
                                    credentialId:
                                        manageCredential.credentialId,

                                    email:
                                        newShareEmail,

                                    accessLevel:
                                        newAccessLevel
                                }
                            );

                            alert(
                                "Credential shared successfully."
                            );

                            setNewShareEmail("");

                            const response = await API.get(
                                `/share/${manageCredential.credentialId}/users`
                            );

                            setUsersWithAccess(
                                response.data
                            );

                        } catch (error) {

                            alert(
                                error.response?.data ||
                                "Failed to share credential."
                            );

                        }

                    }}
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

export default SharedWithMe;