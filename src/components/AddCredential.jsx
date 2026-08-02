import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import "../css/AddCredential.css";
import toast from "react-hot-toast";

function AddCredential() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [strength, setStrength] = useState("");
    const [credential, setCredential] = useState({
        website: "",
        username: "",
        password: "",
        notes: ""
    });

    const handleChange = (e) => {

    const { name, value } = e.target;

    setCredential({
        ...credential,
        [name]: value
    });

    if (name === "password") {
        setStrength(checkStrength(value));
    }

};

    const checkStrength = (password) => {

    if (password.length < 6) {
        return "Weak";
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&#]/.test(password);

    const score = [hasUpper, hasLower, hasNumber, hasSpecial]
        .filter(Boolean).length;

    if (score <= 2) {
        return "Medium";
    }

    return "Strong";

};

const generatePassword = () => {

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

    let password = "";

    for (let i = 0; i < 16; i++) {

        password += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );

    }

    setCredential({
        ...credential,
        password
    });

    setStrength(checkStrength(password));

    toast.success("Strong password generated!");

};
    const saveCredential = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

        await API.post(
            "/credentials",
            credential,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        toast.success("Password saved successfully!");

        setCredential({
            website: "",
            username: "",
            password: "",
            notes: ""
        });

        setTimeout(() => {
            navigate("/credentials");
        }, 1000);

    } catch (error) {

        console.log(error);

        toast.error(
            error.response?.data || "Unable to save password."
        );

    } finally {

        setLoading(false);

    }

};
    return (

        <div className="add-page">

            <div className="add-card">

                <h2>Add New Password</h2>

                <form onSubmit={saveCredential}>

                    <input
                        type="text"
                        name="website"
                        placeholder="Website"
                        value={credential.website}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="username"
                        placeholder="Username / Email"
                        value={credential.username}
                        onChange={handleChange}
                        required
                    />

                    <div className="password-field">

    <input
        type="text"
        name="password"
        placeholder="Password"
        value={credential.password}
        onChange={handleChange}
        required
    />

    <button
        type="button"
        className="generate-btn"
        onClick={generatePassword}
    >
        🎲 Generate
    </button>

</div>
                    {credential.password && (
    <p
        className={`password-strength ${strength.toLowerCase()}`}
    >
        Strength: {strength}
    </p>
)}

                    <textarea
                        name="notes"
                        placeholder="Notes"
                        rows="4"
                        value={credential.notes}
                        onChange={handleChange}
                    />

                    <button
    type="submit"
    disabled={loading}
>
    {
        loading
            ? "Saving..."
            : "Save Password"
    }
</button>
                </form>

            </div>

        </div>

    );

}

export default AddCredential;