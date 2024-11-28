import { useEffect } from "react";
import { useDarkMode } from "../context/DarkModeContext";

function DarkMode() {
    const { defaultDarkMode, isUserLoggedIn } = useDarkMode();

    useEffect(() => {
        if (!isUserLoggedIn || defaultDarkMode === null) {
            return;
        }

        const appBody = document.body;
        if (defaultDarkMode === "on") {
            appBody?.classList.add("dark-mode");
        } else {
            appBody?.classList.remove("dark-mode");
        }
    }, [defaultDarkMode, isUserLoggedIn]);

    return null;
}

export default DarkMode;