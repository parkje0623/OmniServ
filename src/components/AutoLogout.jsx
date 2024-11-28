import { useEffect, useRef, useCallback } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAutoLogout } from "../context/AutoLogoutContext";

function AutoLogout() {
    const timerRef = useRef(null);
    const { timeoutDuration, isUserLoggedIn } = useAutoLogout();

    // Reset Auto-Logout Timer
    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
         }

        timerRef.current = setTimeout(() => {
            handleLogout();
        }, timeoutDuration);
    }, [timeoutDuration]);

    // Handle Firebase Sign-out
    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("You have been signed out due to inactivity.");
        } catch (error) {
            console.error("Error Logging out:", error);
        }
    };

    useEffect(() => {
        if (!isUserLoggedIn || timeoutDuration === null || timeoutDuration === Infinity) {
            // Clear timer if the user is logged out
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            return;
        }

        // Events to detect user activity
        const events = ["mousemove", "keydown", "click", "scroll"];
        // Reset the timer on user activity
        events.forEach((event) =>
            window.addEventListener(event, resetTimer)
        );
        // Initialize the Timer
        resetTimer();

        // Cleanup: Remove event listeners and clear the timer
        return () => {
            events.forEach((event) =>
                window.removeEventListener(event, resetTimer)
            );
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            };
        };
    }, [timeoutDuration, isUserLoggedIn, resetTimer]);

    return null;
}

export default AutoLogout;