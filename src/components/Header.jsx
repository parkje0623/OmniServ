import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { faHome, faWrench } from "@fortawesome/fontawesome-free-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Header({ path }) {
    const navigate = useNavigate();
    const specialCases = {
        '/dashboard': '/ Dashboard',
        '/movie': '/ Movie',
        '/ecomm': '/ E-Commerce',
        '/calculator': '/ Calculator',
        '/profile': '/ Profile',
        '/setting': '/ Setting',
        '/coding': '/ Coding'
    }

    const handleHomeClick = () => {
        navigate('/');
    };
    
    return (
        <div className="header-container">
            <div className="left-header">
                <FontAwesomeIcon onClick={handleHomeClick} className="header-icon" icon={faHome} />
                <span><strong>{specialCases[path]}</strong></span>
            </div>

            <div className="right-header">
                <Link to='/setting' className="header-link">
                    <FontAwesomeIcon className="header-icon" icon={faWrench} />
                    <span><strong>Setting</strong></span>
                </Link>
            </div>
        </div>
    );
}

export default Header;