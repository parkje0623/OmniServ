import { db } from "../firebase"; 
import { doc, getDoc, setDoc } from "firebase/firestore";

// Add User to the Database
export const addUserDatabase = async (uid) => {
    try {
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            return;
        } else {
            console.log("Creating User's Database Collection");
            // Adding User to the Database (Setting and Cart)
            const settingsDocRef = doc(db, `users/${uid}/settings/default`);
            await setDoc(settingsDocRef, {});
            const cartDocRef = doc(db, `users/${uid}/cart/default`);
            await setDoc(cartDocRef, {}); 
            
            console.log("User's collection created successfully!");
        }
    } catch (error) {
        console.error("Error Adding User to the Database: ", error);
    }
};
