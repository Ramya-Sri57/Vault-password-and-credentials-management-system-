import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import "../css/Credentials.css";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

function EditCredential(){

    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
   const [credential, setCredential] = useState({
    website: "",
    username: "",
    password: "",
    category: "",
    expiryDate: "",
    notes: ""
});

    useEffect(()=>{

        fetchCredential();

    },[]);


    const fetchCredential = async () => {
    try {
        const response = await API.get(`/credentials/${id}`);

        setCredential(response.data);

    } catch (error) {
        console.error("Fetch credential error:", error);

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
                    "You are not authorized to edit this password."
                );

                navigate("/credentials");

            } else if (status === 404) {
                toast.error(
                    "Password not found."
                );

                navigate("/credentials");

            } else if (status >= 500) {
                toast.error(
                    "Server error. Unable to load the password."
                );

            } else {
                toast.error(
                    error.response.data?.message ||
                    "Unable to load the password."
                );
            }

        } else if (error.request) {
            toast.error(
                "Unable to connect to the server. Please try again."
            );

        } else {
            toast.error(
                "Something went wrong while loading the password."
            );
        }
    }
};


    const handleChange=(e)=>{

        setCredential({
            ...credential,
            [e.target.name]:e.target.value
        });

    };


    const updateCredential = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!credential.website.trim()) {
        toast.error("Please enter the website.");
        return;
    }

    if (!credential.username.trim()) {
        toast.error("Please enter the username or email.");
        return;
    }

    if (!credential.password.trim()) {
        toast.error("Please enter a password.");
        return;
    }

    if (credential.password.length < 8) {
        toast.error("Password must contain at least 8 characters.");
        return;
    }

    setLoading(true);

    try {
        await API.put(
            `/credentials/${id}`,
            {
                ...credential,
                website: credential.website.trim(),
                username: credential.username.trim()
            }
        );

        toast.success("Password updated successfully!");

        setTimeout(() => {
            navigate("/credentials");
        }, 1000);

    } catch (error) {
        console.error("Update credential error:", error);

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
                    "You are not authorized to update this password."
                );

            } else if (status === 404) {
                toast.error(
                    "Password not found. It may have been deleted."
                );

                setTimeout(() => {
                    navigate("/credentials");
                }, 1000);

            } else if (status === 400) {
                toast.error(
                    error.response.data?.message ||
                    "Invalid password details."
                );

            } else if (status >= 500) {
                toast.error(
                    "Server error. Unable to update the password."
                );

            } else {
                toast.error(
                    error.response.data?.message ||
                    "Unable to update password."
                );
            }

        } else if (error.request) {
            toast.error(
                "Unable to connect to the server. Please try again."
            );

        } else {
            toast.error(
                "Something went wrong while updating the password."
            );
        }

    } finally {
        setLoading(false);
    }
};


    return(

        <div className="credentials-page">

            <div className="credential-card edit-card">

                <div className="page-header">

    <div>

        <h2>Edit Password</h2>

        <p>
            Update your saved credential securely.
        </p>

    </div>

</div>

                <form onSubmit={updateCredential} className="credential-form">

    <label>Website</label>

    <input
        type="text"
        name="website"
        value={credential.website}
        onChange={handleChange}
        placeholder="Website Name"
    />

    <label>Username / Email</label>

    <input
        type="text"
        name="username"
        value={credential.username}
        onChange={handleChange}
        placeholder="Username or Email"
    />

    <label>Password</label>

    <div className="password-input">

        <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={credential.password}
            onChange={handleChange}
            placeholder="Password"
        />

        <button
    type="button"
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
>
    {showPassword ? (
        <EyeOff size={20} />
    ) : (
        <Eye size={20} />
    )}
</button>

    </div>

    <label>Category</label>

    <select
        name="category"
        value={credential.category}
        onChange={handleChange}
    >
        <option value="">Select Category</option>
        <option value="SHOPPING">Shopping</option>
        <option value="EMAIL">Email</option>
        <option value="WORK">Work</option>
        <option value="BANKING">Banking</option>
        <option value="SOCIAL MEDIA">Social Media</option>
        <option value="ENTERTAINMENT">Entertainment</option>
        <option value="EDUCATION">Education</option>
        <option value="PERSONAL">Personal</option>
        <option value="OTHERS">Others</option>
    </select>

    <label>Expiry Date</label>

    <input
        type="date"
        name="expiryDate"
        value={credential.expiryDate || ""}
        onChange={handleChange}
    />

    <label>Notes</label>

    <textarea
        name="notes"
        value={credential.notes}
        onChange={handleChange}
        rows="4"
        placeholder="Additional Notes"
    />

    <div className="form-buttons">

        <button
            type="submit"
            className="save-btn"
            disabled={loading}
        >
            {loading ? "Updating..." : "Update Password"}
        </button>

        <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/credentials")}
        >
            Cancel
        </button>

    </div>

</form>

            </div>

        </div>

    );

}


export default EditCredential;