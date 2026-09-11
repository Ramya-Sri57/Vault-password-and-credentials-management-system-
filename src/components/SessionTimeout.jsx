import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TIMEOUT = 15 * 60 * 1000; // 15 minutes

function SessionTimeout() {

    const navigate = useNavigate();

    useEffect(() => {

        // Do nothing if the user is not logged in
        if (!localStorage.getItem("token")) {
            return;
        }

        let timer;

        const logout = () => {

            localStorage.removeItem("token");

            toast.error("Your session has expired.");

            navigate("/");

        };

        const resetTimer = () => {

            clearTimeout(timer);

            // Check again before starting the timer
            if (localStorage.getItem("token")) {
                timer = setTimeout(logout, TIMEOUT);
            }

        };

        resetTimer();

        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);
        window.addEventListener("click", resetTimer);
        window.addEventListener("scroll", resetTimer);

        return () => {

            clearTimeout(timer);

            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            window.removeEventListener("click", resetTimer);
            window.removeEventListener("scroll", resetTimer);

        };

    }, [navigate]);

    return null;
}

export default SessionTimeout;