import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import "../css/Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
   const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    
    useEffect(() => {

        const fetchProfile = async () => {
    try {
        const response = await API.get("/profile");

        setProfile(response.data);

    } catch (error) {
        console.error("Fetch profile error:", error);

        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                alert("Your session has expired. Please login again.");

                localStorage.removeItem("token");
                navigate("/login");

            } else if (status === 403) {
                alert(
                    "You are not authorized to access this profile."
                );

                navigate("/dashboard");

            } else if (status === 404) {
                alert("Profile not found.");

            } else if (status >= 500) {
                alert(
                    "Server error. Unable to load your profile."
                );

            } else {
                alert(
                    error.response.data?.message ||
                    "Unable to load your profile."
                );
            }

        } else if (error.request) {
            alert(
                "Unable to connect to the server. Please try again."
            );

        } else {
            alert(
                "Something went wrong while loading your profile."
            );
        }
    }
};

        fetchProfile();

    }, []);

    if (!profile) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="profile-page">

            <div className="profile-card">

                <div className="profile-avatar">
                    👤
                </div>

                <h2>{profile.fullName}</h2>

                <p>{profile.email}</p>

                <div className="profile-info">

                    <div>
                        <strong>ID</strong>
                        <span>{profile.id}</span>
                    </div>

                    <div>
                        <strong>Role</strong>
                        <span>{profile.role}</span>
                    </div>

                </div>

                <button
    onClick={() => navigate("/edit-profile")}
>
    Edit Profile
</button>
<button
    onClick={() => navigate("/change-password")}
>
    Change Password
</button>
            </div>

        </div>

    );

}

export default Profile;