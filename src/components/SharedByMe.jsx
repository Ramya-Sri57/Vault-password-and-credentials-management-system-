import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import {
    Eye,
    EyeOff,
    KeyRound,
    Ban
} from "lucide-react";
import "../css/SharedWithMe.css";

function SharedByMe() {

    const [sharedCredentials, setSharedCredentials] = useState([]);
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSharedByMe();
    }, []);

    const fetchSharedByMe = async () => {
    try {
        const response = await API.get("/share/shared-by-me");

        console.log("Shared By Me:", response.data);

        let data = [];

        if (Array.isArray(response.data)) {
            data = response.data;
        } else if (Array.isArray(response.data?.sharedCredentials)) {
            data = response.data.sharedCredentials;
        } else if (Array.isArray(response.data?.data)) {
            data = response.data.data;
        }

        setSharedCredentials(data);

    } catch (error) {
        console.error(
            "Failed to fetch shared credentials:",
            error
        );

        setSharedCredentials([]);

        setError(
            error.response?.data?.message ||
            "Unable to load shared credentials."
        );

    } finally {
        setLoading(false);
    }
};

    const togglePassword = (shareId) => {

        setVisiblePasswords((previous) => ({
            ...previous,
            [shareId]: !previous[shareId]
        }));

    };


    const revokeAccess = async (shareId) => {

        const confirmed = window.confirm(
            "Are you sure you want to revoke access to this credential?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await API.delete(
                `/share/${shareId}`
            );

            setSharedCredentials((previous) =>
                previous.filter(
                    (item) =>
                        item.shareId !== shareId
                )
            );

            setVisiblePasswords((previous) => {

                const updated = {
                    ...previous
                };

                delete updated[shareId];

                return updated;

            });

        } catch (error) {

            console.error(
                "Failed to revoke access:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to revoke access."
            );

        }

    };


    /* Loading */

    if (loading) {

        return (

            <div className="shared-page">

                <div className="shared-container">

                    <div className="empty-shared">

                        <div className="empty-icon">
                            <KeyRound size={32} />
                        </div>

                        <h3>
                            Loading shared credentials...
                        </h3>

                        <p>
                            Please wait while we load
                            your shared credentials.
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="shared-page">

            <div className="shared-container">


                {/* PAGE HEADER */}

                <div className="shared-header">

                    <div className="shared-title-section">

                        <div className="shared-title-icon">
                            <KeyRound size={24} />
                        </div>

                        <div>

                            <h2>
                                Shared By Me
                            </h2>

                            <p>
                                Credentials you have securely
                                shared with other users.
                            </p>

                        </div>

                    </div>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="shared-error">
                        {error}
                    </div>

                )}


                {/* EMPTY STATE */}

                {!error &&
                    sharedCredentials.length === 0 && (

                        <div className="empty-shared">

                            <div className="empty-icon">
                                <KeyRound size={32} />
                            </div>

                            <h3>
                                No Shared Credentials
                            </h3>

                            <p>
                                You haven't shared any
                                credentials yet.
                            </p>

                        </div>

                    )
                }


                {/* CREDENTIAL CARDS */}

                {sharedCredentials.length > 0 && (

                    <div className="shared-grid">

                        {sharedCredentials.map((item) => (

                            <div
                                className="shared-credential-card"
                                key={item.shareId}
                            >


                                {/* CARD HEADER */}

                                <div className="credential-top">

                                    <div className="website-icon">
                                        <KeyRound size={25} />
                                    </div>

                                    <div className="credential-title">

                                        <h3>
                                            {item.website}
                                        </h3>

                                        <span>
                                            Shared credential
                                        </span>

                                    </div>

                                </div>


                                {/* DIVIDER */}

                                <div className="credential-divider">
                                </div>


                                {/* CREDENTIAL INFORMATION */}

                                <div className="credential-info">


                                    {/* USERNAME */}

                                    <div className="info-row">

                                        <span className="info-label">
                                            USERNAME
                                        </span>

                                        <span className="info-value">
                                            {item.username}
                                        </span>

                                    </div>


                                    {/* PASSWORD */}

                                    <div className="info-row">

                                        <span className="info-label">
                                            PASSWORD
                                        </span>

                                        <span className="info-value password-value">

                                            {visiblePasswords[item.shareId]
                                                ? item.password
                                                : "••••••••••••"
                                            }

                                        </span>

                                    </div>


                                    {/* SHARED WITH */}

                                    <div className="info-row">

                                        <span className="info-label">
                                            SHARED WITH
                                        </span>

                                        <span className="info-value">
                                            {item.sharedWith}
                                        </span>

                                    </div>
                                    <div className="info-row">

    <span className="info-label">
        Access Level
    </span>

    <span className="info-value access-level">
        {item.accessLevel === "VIEW"
            ? "View"
            : item.accessLevel === "EDIT"
                ? "Edit"
                : "Full Access"
        }
    </span>

</div>


                                    {/* SHARED ON */}

                                    <div className="info-row">

                                        <span className="info-label">
                                            SHARED ON
                                        </span>

                                        <span className="info-value">

                                            {item.sharedAt
                                                ? new Date(
                                                    item.sharedAt
                                                ).toLocaleString()
                                                : "Unknown"
                                            }

                                        </span>

                                    </div>


                                    {/* NOTES */}

                                    {item.notes && (

                                        <div className="notes-section">

                                            <span className="info-label">
                                                NOTES
                                            </span>

                                            <p>
                                                {item.notes}
                                            </p>

                                        </div>

                                    )}

                                </div>


                                {/* ACTION BUTTONS */}

                                <div className="shared-actions">


                                    {/* VIEW / HIDE */}

                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() =>
                                            togglePassword(
                                                item.shareId
                                            )
                                        }
                                        title={
                                            visiblePasswords[
                                                item.shareId
                                            ]
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >

                                        {visiblePasswords[
                                            item.shareId
                                        ] ? (

                                            <EyeOff size={17} />

                                        ) : (

                                            <Eye size={17} />

                                        )}

                                        <span>

                                            {visiblePasswords[
                                                item.shareId
                                            ]
                                                ? "Hide"
                                                : "View"
                                            }

                                        </span>

                                    </button>


                                    {/* REVOKE ACCESS */}

                                    <button
                                        type="button"
                                        className="revoke-btn"
                                        onClick={() =>
                                            revokeAccess(
                                                item.shareId
                                            )
                                        }
                                        title="Revoke access"
                                    >

                                        <Ban size={17} />

                                        <span>
                                            Revoke Access
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

export default SharedByMe;