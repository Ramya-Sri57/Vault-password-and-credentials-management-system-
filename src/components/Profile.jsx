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

                const response = await API.get("/profile", {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem("token")}`
                    }
                });

                setProfile(response.data);

            } catch (error) {

                console.log(error);

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