import React, { useState } from "react";
import { auth, db } from "../firebase";
import useAuthRedirect from "../hooks/useAuthRedirect";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser } from "firebase/auth";
import { doc, deleteDoc, getDocs, collection } from "firebase/firestore";
import { checkPasswordNotMatch, checkPasswordConditions } from "../utils/utils";
import Modal from "../components/Modal";
import '../stylesheets/setting.css';

function Profile() {
    // Redirect if user is logged in
    useAuthRedirect('/profile', '/signin'); 

    // User Information
    const user = auth.currentUser ? auth.currentUser : "";
    const [confirmPassword, setConfirmPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [pwdChanged, setPwdChanged] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [pwdError, setPwdError] = useState("");
    const [deleteError, setDeleteError] = useState("");

    // Handling Update Password
    const handlePasswordChange = async (e) => {
        e.preventDefault();

        const credential = EmailAuthProvider.credential(user.email, confirmPassword);
        try {
            // Check if the Current Password matches the Confirm Password given
            await reauthenticateWithCredential(user, credential);

            // If matches above condition, then check New password does not match current password & New Password Conditions
            //   1. New Password must not match the current password.
            //   2. Current password must pass the password format conditions
            if (!checkPasswordNotMatch(confirmPassword, newPassword, setPwdError)) {
                return;
            }
            if (!checkPasswordConditions(newPassword, setPwdError)) {
                return;
            } 

            // If passed both conditions, update to new password
            await updatePassword(user, newPassword);
            setPwdChanged(true);
            setNewPassword("");
            setConfirmPassword("");
            console.log("Password updated successfully!");
        } catch (error) {
            console.error("Error while updating password: ", error);
            if (error.code.includes('invalid-credential')) {
                setPwdError("Confirm password MUST match the current password.");
            }
        }
    };

    // Handling Delete Account
    const handleDeleteAccount = async (password) => {
        try {
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);

            // Delete associated data in Firestore
            const userRef = doc(db, `users/${user.uid}`);
            const subcollectionNames = ["cart", "settings"]; 
            subcollectionNames.forEach(async (name) => {
                const subcollectionRef = collection(db, `users/${user.uid}/${name}`);
                const querySnapshot = await getDocs(subcollectionRef);
                for (const docSnapshot of querySnapshot.docs) {
                    console.log(subcollectionRef.id, docSnapshot.id)
                    await deleteDoc(doc(db, `users/${user.uid}/${name}/${docSnapshot.id}`));
                }
            });
            await deleteDoc(userRef);
            
            // Delete the user
            await deleteUser(user);
            alert("Account successfully deleted.");
        } catch (error) {
            if (error.code === "auth/requires-recent-login") {
                alert("Please log in again to confirm account deletion.");
            } else {
                console.error("Error deleting account: ", error.message);
                setDeleteError("Error deleting account. Enter a correct password or Please try again later.");
            }
        }
    };
    // Handling Delete Account Modal Exit
    const handleCloseDeleteAccount = () => {
        setDeleteConfirm(false); 
        setDeletePassword(""); 
        setDeleteError("");
    };

    return (
        <div className="main-container setting">
            <div>
                <div className="setting-title">
                    <h2>Your Email Account</h2>
                </div>

                <div className="setting-body">
                    <div>
                        <input
                            id="email"
                            name="email"
                            value={user.email}
                            disabled
                        />
                    </div>
                </div>
            </div>

            <div>
                <div className="setting-title">
                    <h2>Update Password</h2>
                </div>

                <div className="setting-body">
                    <form onSubmit={handlePasswordChange}>
                        <div className="password-cotainer">
                            <label htmlFor="confirmPassword">Confirm Current Password: </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Enter Current Password"
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="password-cotainer">
                            <label htmlFor="newPassword">New Password: </label>
                            <input
                                type="password"
                                id="newPassword"
                                placeholder="Enter a New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />  
                        </div>

                        <div>
                            {pwdError && <p className="error">{pwdError}</p>}
                            <button type="submit" className="warning-button">
                                Update Password
                            </button>
                        </div>
                    </form>

                    {pwdChanged &&
                        <Modal isOpen={pwdChanged} onClose={() => setPwdChanged(false)}>
                            <h3 className="success-message">Password Successfully Updated!</h3>
                        </Modal>
                    }
                </div>
            </div>

            <div>
                <div className="setting-title">
                    <h2>Delete Account</h2>
                </div>

                <div className="setting-body">
                    <div>
                        <p>**Once you delete the account, there is no going back. Please be certain.</p>
                        <button type="button" className="warning-button" onClick={() => setDeleteConfirm(true)}>
                            Delete Account
                        </button>
                        {deleteConfirm && (
                            <Modal isOpen={deleteConfirm} onClose={handleCloseDeleteAccount}>
                                <h3>Are you sure you want to delete your account?</h3>
                                <p>Enter the current password to proceed. This action cannot be undone.</p>
                                <div>
                                    <input
                                        type="password"
                                        id="deletePassword"
                                        placeholder="Enter Current Password"
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {deleteError && <p className="error">{deleteError}</p>}
                                <button type="button" className="warning-button" onClick={() => handleDeleteAccount(deletePassword)}>
                                    Yes, Delete
                                </button>
                            </Modal>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;