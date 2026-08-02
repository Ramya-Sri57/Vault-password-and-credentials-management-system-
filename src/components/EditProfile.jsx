import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import "../css/Auth.css";
import toast from "react-hot-toast";

function EditProfile() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [profile, setProfile] = useState({
        fullName: "",
        email: ""
    });

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response = await API.get("/profile", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                setProfile(response.data);

            } catch (error) {
                console.log(error);
            }

        };

        fetchProfile();

    }, []);

    const handleChange = (e) => {

        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });

    };

    const updateProfile = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

        await API.put(
            "/profile",
            profile,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        toast.success("Profile updated successfully!");

        setTimeout(() => {
            navigate("/profile");
        }, 1000);

    } catch (error) {

        toast.error(
            error.response?.data || "Unable to update profile"
        );

    } finally {

        setLoading(false);

    }

};

    return (

        <div className="auth-page">

            <div className="auth-card">

                <h2>Edit Profile</h2>

                <form
                    onSubmit={updateProfile}
                    className="auth-form"
                >

                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={profile.fullName}
                        onChange={handleChange}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={profile.email}
                        onChange={handleChange}
                    />

                   <button
    type="submit"
    className="auth-button"
    disabled={loading}
>
    {
        loading
            ? "Updating..."
            : "Update Profile"
    }
</button>

                </form>

            </div>

        </div>

    );

}

export default EditProfile;