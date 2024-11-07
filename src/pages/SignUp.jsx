import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import useAuthRedirect from "../hooks/useAuthRedirect";

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

    // Handle Password Condition Validation
    const checkPasswordConditions = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()]/.test(password);
        const isValidLength = password.length >= 8;

        let errorMsg = "";
        switch (true) {
            case !isValidLength:
                errorMsg = "*Password must be at least 8 characters long.";
                break;
            case !hasUppercase:
                errorMsg = "*Password must contain at least one uppercase letter.";
                break;
            case !hasLowercase:
                errorMsg = "*Password must contain at least one lowercase letter.";
                break;
            case !hasNumber:
                errorMsg = "*Password must contain at least one number.";
                break;
            case !hasSpecialChar:
                errorMsg = "*Password must contain at least one of (!@#$%^&*()).";
                break;
            default:
                setPasswordError("");
                return true;
        }
        setPasswordError(errorMsg);
        return false;
    };
    // Handle Confirm Password Match
    const checkConfirmPassword = (password, confirm) => {
        if (password === confirm) {
            setConfirmError("");
            return true;
        }
        setConfirmError("Confirm password must match the password.");
        return false
    };

    // Handle Sign Up Process
    const handleSignUp = async (e) => {
        e.preventDefault();
        // Check for Password & Confirm Conditions
        if (!checkPasswordConditions(password)) {
            return;
        }
        if (!checkConfirmPassword(password, confirm)) {
            return;
        }
        
        // Move on to SignUp Process
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Sign-up Successful: ", userCred);
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
