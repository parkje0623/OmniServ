import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { auth, db } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc, collection } from "firebase/firestore";

const DarkModeContext = createContext();
export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [defaultDarkMode, setDefaultDarkMode] = useState(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    const updateDarkMode = async (darkMode) => {
        setDefaultDarkMode(darkMode);

        if (!userId) {
            return
        };

        try {
            const settingsCollectionRef = doc(db, `users/${userId}/settings/darkmode`);
            const existingSettingSnapshot = await getDoc(settingsCollectionRef);

            if (existingSettingSnapshot.exists()) {
                await updateDoc(settingsCollectionRef, { toggle: darkMode });
            } else {
                await setDoc(settingsCollectionRef, { toggle: darkMode });
            }
        } catch (error) {
            console.error("Error Updating Dark Mode: ", error);
        }
    };

    const getInitialDarkMode = useCallback(async () => {
        try {
            const settingsCollectionRef = collection(db, `users/${userId}/settings`);
            const existingSettingQuery = doc(settingsCollectionRef, 'darkmode');
            const existingSettingSnapshot = await getDoc(existingSettingQuery);

            if (existingSettingSnapshot.exists()) {
                setDefaultDarkMode(existingSettingSnapshot.data().toggle);
            } else {
                const newDefaultDarkMode = { toggle: "off" };
                await setDoc(existingSettingQuery, newDefaultDarkMode);
                setDefaultDarkMode(newDefaultDarkMode.toggle);
                console.log("New Default Dark Mode added to the setting");
            }
        } catch (error) {
            console.error("Error Fetching Initial Dark Mode: ", error);
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) {
            return;
        }

        getInitialDarkMode();
    }, [userId, getInitialDarkMode]);

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
        <DarkModeContext.Provider
            value={{
                defaultDarkMode,
                isUserLoggedIn,
                setIsUserLoggedIn,
                updateDarkMode
            }}
        >
            {children}
        </DarkModeContext.Provider>
    );
}