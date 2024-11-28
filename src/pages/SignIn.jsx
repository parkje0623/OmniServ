import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleButton from 'react-google-button'
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import useAuthRedirect from "../hooks/useAuthRedirect";
import '../stylesheets/sign.css';

function SignIn() {
    // Redirect if user is logged in
    useAuthRedirect('/', '/signin'); 

    // Email & Password for Login
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    // Auth for SignIn Method
    const auth = getAuth();
    // Google Auth Provider
    const provider = new GoogleAuthProvider();
    const navigate = useNavigate();

    // Handle Email/Pwd Signin Method
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            console.log("Email/Password Signed in: ", userCred);
            navigate('/');
        } catch (error) {
            console.error("Error Sign-in with Email/Password: ", error);
            setLoginError("Login Failed: Invalid email or password.");
        }
    };

    // Handle Google SignIn Method
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("Google Signed in: ", result);
            navigate('/');
        } catch (error) {
            console.error("Error Sign-in with Google: ", error);
        }
    };

    return (
        <div className="main-container sign-container">
            <div className="sign-title">
                <h4>Welcome to OmniServ</h4>
                <p>
                    Don't Have an Account Yet? &nbsp;
                    <Link to='/signup'>Sign-up Here</Link>
                </p>
            </div>

            <div className="sign-content">
                {/* Email Sign In */}
                <div className="sign-email">
                    <h4 className="required">* Required</h4>
                    <form onSubmit={handleLogin}>
                        <label htmlFor="email">
                            Email
                            <span className="required">*</span>
                        </label>
                        <input id="email" 
                            type='email'
                            placeholder='emailname@example.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="password">
                            Password
                            <span className="required">*</span>
                        </label>
                        <input id="password"
                            type='password'
                            placeholder='Enter Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {loginError && <p className="error">{loginError}</p>}
                        <button type='submit'>
                            <h4>SIGN IN</h4>
                        </button>
                    </form>
                </div>

                {/* Line Between Email & Gmail Logins */}
                <div className="vertical-hr"></div>

                {/* Gmail Sign In */}
                <div className="sign-google">
                    <GoogleButton onClick={handleGoogleSignIn} />
                </div>
            </div>
        </div>
    );
}

export default SignIn;
