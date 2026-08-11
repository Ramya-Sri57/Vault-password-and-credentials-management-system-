import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TIMEOUT = 15 * 60 * 1000; // 15 minutes
// For testing you can temporarily use:
// const TIMEOUT = 60 * 1000; // 1 minute

function SessionTimeout() {

    const navigate = useNavigate();

    useEffect(() => {

        let timer;

        const logout = () => {

            localStorage.removeItem("token");

            toast.error("Your session has expired.");

            navigate("/");

        };

        const resetTimer = () => {

            clearTimeout(timer);

            timer = setTimeout(logout, TIMEOUT);

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