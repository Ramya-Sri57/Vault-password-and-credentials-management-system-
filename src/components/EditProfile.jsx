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
        const response = await API.get("/profile");

        setProfile(response.data);

    } catch (error) {
        console.error("Fetch profile error:", error);

        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                toast.error("Your session has expired. Please login again.");
                localStorage.removeItem("token");
                navigate("/login");

            } else if (status === 403) {
                toast.error("You are not authorized to access this profile.");
                navigate("/dashboard");

            } else if (status === 404) {
                toast.error("Profile not found.");

            } else if (status >= 500) {
                toast.error("Server error. Unable to load your profile.");

            } else {
                toast.error(
                    error.response.data?.message ||
                    "Unable to load your profile."
                );
            }

        } else if (error.request) {
            toast.error(
                "Unable to connect to the server. Please try again."
            );

        } else {
            toast.error(
                "Something went wrong while loading your profile."
            );
        }
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

    const fullName = profile.fullName.trim();
    const email = profile.email.trim();

    // Frontend validation
    if (!fullName) {
        toast.error("Please enter your full name.");
        return;
    }

    if (!email) {
        toast.error("Please enter your email.");
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        toast.error("Please enter a valid email address.");
        return;
    }

    setLoading(true);

    try {
        await API.put("/profile", {
            fullName,
            email
        });

        toast.success("Profile updated successfully!");

        setTimeout(() => {
            navigate("/profile");
        }, 1000);

    } catch (error) {
        console.error("Update profile error:", error);

        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                toast.error(
                    "Your session has expired. Please login again."
                );

                localStorage.removeItem("token");
                navigate("/login");

            } else if (status === 403) {
                toast.error(
                    "You are not authorized to update this profile."
                );

            } else if (status === 404) {
                toast.error("Profile not found.");

            } else if (status === 400) {
                toast.error(
                    error.response.data?.message ||
                    "Invalid profile details."
                );

            } else if (status === 409) {
                toast.error(
                    error.response.data?.message ||
                    "This email is already in use."
                );

            } else if (status >= 500) {
                toast.error(
                    "Server error. Unable to update profile."
                );

            } else {
                toast.error(
                    error.response.data?.message ||
                    "Unable to update profile."
                );
            }

        } else if (error.request) {
            toast.error(
                "Unable to connect to the server. Please try again."
            );

        } else {
            toast.error(
                "Something went wrong. Please try again."
            );

        }
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