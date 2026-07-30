import { useState } from "react";
import API from "../api/axiosConfig";

function TestAuth() {

    const [message, setMessage] = useState("");

    const testAuthentication = async () => {
        try {
            const response = await API.get("/test");

            console.log("Protected API response:", response.data);

            setMessage(response.data);
        } catch (error) {
            console.error("Protected API error:", error);

            if (error.response) {
                setMessage(
                    `Request failed: ${error.response.status}`
                );
            } else {
                setMessage("Request failed: " + error.message);
            }
        }
    };

    return (
        <div>
            <h2>JWT Authentication Test</h2>

            <button onClick={testAuthentication}>
                Test Protected API
            </button>

            <p>{message}</p>
        </div>
    );
}

export default TestAuth;