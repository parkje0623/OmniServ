import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth, signOut } from 'firebase/auth';
// import { UserContext } from "../context/UserContext";

function SidebarLink({ to, icon, label }) {
    // const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const auth = getAuth();
    
    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigate('/signin'); 
        }).catch((error) => {
          console.error("Sign-out Error:", error);
        });
    };

    return (
        <>
            {label === 'Sign Out' ? (
                <NavLink onClick={handleSignOut} to={to} className={({ isActive }) => 
                  isActive ? 'active sidebar-content-section' : 'sidebar-content-section'
                }>
                  <FontAwesomeIcon className="icon" icon={icon} />
                  <span><strong>{label}</strong></span>
                </NavLink>
            ) : (
                <NavLink to={to} className={({ isActive }) => 
                  isActive ? 'active sidebar-content-section' : 'sidebar-content-section'
                }>
                  <FontAwesomeIcon className="icon" icon={icon} />
                  <span><strong>{label}</strong></span>
                </NavLink>
            )}
        </>
    );
};

export default SidebarLink;