import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import "../css/SharedWithMe.css";
import { Eye, EyeOff } from "lucide-react";
function SharedWithMe() {

    const [sharedCredentials, setSharedCredentials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [visiblePasswords, setVisiblePasswords] = useState({});

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

                                    <button
    className="password-toggle-btn"
    onClick={() => togglePassword(item.shareId)}
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
            : "View"}
    </span>
</button>
                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );
}

export default SharedWithMe;