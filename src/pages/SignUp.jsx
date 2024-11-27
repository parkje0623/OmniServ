import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import useAuthRedirect from "../hooks/useAuthRedirect";
import { addUserDatabase } from '../utils/databaseHandler';
import { checkConfirmPassword, checkPasswordConditions } from "../utils/utils";

function SignUp() {
    // Redirect if user is logged in
    useAuthRedirect('/', '/signup'); 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [registerError, setRegisterError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    // Auth for createUserWithEmailAndPassword
    const auth = getAuth();
    const navigate = useNavigate();

    // Handle Sign Up Process
    const handleSignUp = async (e) => {
        e.preventDefault();
        // Check for Password & Confirm Conditions
        if (!checkPasswordConditions(password, setPasswordError)) {
            return;
        }
        if (!checkConfirmPassword(password, confirm, setConfirmError)) {
            return;
        }
        
        // Move on to SignUp Process
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Sign-up Successful: ", userCred);
            addUserDatabase(userCred.user.uid);
            navigate('/');
        } catch (error) {
            console.error("Sign-up Sucessful: ", error);
            if (error.code === 'auth/email-already-in-use') {
                setRegisterError('Email is already in use. Please use a different email.');
            } else {
                setRegisterError('Sign-up Failed: Please Try Again');
            }
        }
    };

    return (
        <div className="main-container sign-container">
            <div className="sign-title">
                <h4>Welcome to OmniServ</h4>
                <p>
                    Already Have an Account Yet? &nbsp;
                    <Link to='/signin'>Sign-in Here</Link>
                </p>
            </div>

            <div className="sign-content signup-content">
                {/* Sign-up with Email */}
                <div className="sign-email signup-email">
                    <h4 className="required">Required *</h4>
                    <form onSubmit={handleSignUp}>
                        <label htmlFor="email">
                            Email
                            <span className="required">*</span>
                        </label>
                        <input id="email"
                            type="email"
                            placeholder="emailname@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label htmlFor="password">
                            Password
                            <span className="required">*</span>
                        </label>
                        <input id="password"
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {passwordError && <p className="error">{passwordError}</p>}

                        <label htmlFor="confirm">
                            Confirm Password
                            <span className="required">*</span>
                        </label>
                        <input id="confirm"
                            type="password"
                            placeholder="Re-enter Password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                        />
                        {confirmError && <p className="error">{confirmError}</p>}

                        {registerError && <p className="error">{registerError}</p>}
                        <button type="submit">SIGN UP</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
