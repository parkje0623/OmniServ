import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { auth, db } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, updateDoc, setDoc } from "firebase/firestore";


const AutoLogoutContext = createContext();
// Custom Hook to use the Context
export const useAutoLogout = () => useContext(AutoLogoutContext);

export const AutoLogoutProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [timeoutDuration, setTimeoutDuration] = useState(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    const updateTimeoutDuration = async (duration) => {
        setTimeoutDuration(duration);

        if (!userId) {
            return
        };

        try {
            const settingsCollectionRef = doc(db, `users/${userId}/settings/auto-logout`);
            const existingSettingSnapshot = await getDoc(settingsCollectionRef);

            if (existingSettingSnapshot.exists()) {
                await updateDoc(settingsCollectionRef, { duration: duration });
            } else {
                await setDoc(settingsCollectionRef, { duration: duration });
            }
        } catch (error) {
            console.error("Error Updating Timeout Duration: ", error);
        }
    };

    const getInitialTimeoutDuration = useCallback(async () => {
        try {
            const settingsCollectionRef = collection(db, `users/${userId}/settings`);
            const existingSettingQuery = doc(settingsCollectionRef, 'auto-logout');
            const existingSettingSnapshot = await getDoc(existingSettingQuery);

            if (existingSettingSnapshot.exists()) {
                setTimeoutDuration(existingSettingSnapshot.data().duration);
            } else {
                const newTimeoutDuration = { duration: 1800000 };
                await setDoc(existingSettingQuery, newTimeoutDuration);
                setTimeoutDuration(newTimeoutDuration.duration);
                console.log("New Duration added to settings.");
            }
        } catch (error) {
            console.error("Error Fetching Initial Timeout Duration: ", error);
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) {
            return;
        }

        getInitialTimeoutDuration();
    }, [userId, getInitialTimeoutDuration]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsUserLoggedIn(!!user);
            if (user) {
                setUserId(user.uid);
            }
        });

        return () => {
            // Cleanup listener
            unsubscribe();
        }
    }, []);

    return (
        <AutoLogoutContext.Provider
            value={{
                timeoutDuration,
                isUserLoggedIn,
                setIsUserLoggedIn,
                updateTimeoutDuration
            }}
        >
            {children}
        </AutoLogoutContext.Provider>
    );
};
