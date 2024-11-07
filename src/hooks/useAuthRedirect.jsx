import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const useAuthRedirect = (redirect='/', loggedout='/signin') => {
    const navigate = useNavigate();
    const auth = getAuth();

    // Check if user is signed in
    useEffect(() => {
        // If signed in redirect to given redirect path
        // If not, direct users to the signin page
        const checkSignIn = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate(loggedout);
            } else {
                navigate(redirect);
            }
        });
        // Clean up the listener when the component unmounts
        return () => checkSignIn();
    }, [auth, navigate, redirect, loggedout]);
}

export default useAuthRedirect;