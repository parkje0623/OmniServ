import React, { useContext } from "react";
import SidebarLink from "./SideBarLink";
import { faStar, faChartPie, faFilm, faCalculator, faCartPlus, faUser, faBolt, faArrowRight, faReply } from '@fortawesome/fontawesome-free-solid';
import { UserContext } from "../context/UserContext";

function SideBar() {
    const { user } = useContext(UserContext);

    return (
        <div className="sidebar-container">
            <div className="sidebar-title">
                <h1>OmniServ</h1>
            </div>

            <div className="sidebar-crossing-line">
                <hr className="fading-hr"></hr>
            </div>

            <ul className="sidebar-content">
                {/* About Us */}
                <li>
                    <SidebarLink to='/' icon={faStar} label="About" />
                </li>

                {/* Main Content */}
                <li>
                    <SidebarLink to='/dashboard' icon={faChartPie} label="Dashboard" />
                </li>
                <li>
                    <SidebarLink to='/movie' icon={faFilm} label="Movie" />
                </li>
                <li>
                    <SidebarLink to='/ecomm' icon={faCartPlus} label="E-Commerce" />
                </li>
                <li>
                    <SidebarLink to='/calculator' icon={faCalculator} label="Calculator" />
                </li>
                
                {/* Account Content */}
                <li className="sidebar-content-title">
                    <h4>Account Pages</h4>
                </li>
                <li>
                    <SidebarLink to='/profile' icon={faUser} label="Profile" />
                </li>
                {user ? (
                    <>
                        <li>
                            <SidebarLink to='/signin' icon={faReply} label="Sign Out" />
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <SidebarLink to='/signin' icon={faBolt} label="Sign In" />
                        </li>
                        <li>
                            <SidebarLink to='/signup' icon={faArrowRight} label="Sign Up" />
                        </li>
                    </>
                )}
            </ul>

            <ul className="sidebar-icon-content">
                {/* About Us */}
                <li>
                    <SidebarLink to='/' icon={faStar} />
                </li>

                {/* Main Content */}
                <li>
                    <SidebarLink to='/dashboard' icon={faChartPie} />
                </li>
                <li>
                    <SidebarLink to='/movie' icon={faFilm} />
                </li>
                <li>
                    <SidebarLink to='/ecomm' icon={faCartPlus} />
                </li>
                <li>
                    <SidebarLink to='/calculator' icon={faCalculator} />
                </li>
                
                {/* Account Content */}
                <li className="sidebar-content-title">
                    
                </li>
                <li>
                    <SidebarLink to='/profile' icon={faUser} />
                </li>
                {user ? (
                    <>
                        <li>
                            <SidebarLink to='/signin' icon={faReply} />
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <SidebarLink to='/signin' icon={faBolt} />
                        </li>
                        <li>
                            <SidebarLink to='/signup' icon={faArrowRight} />
                        </li>
                    </>
                )}
            </ul>
        </div>
    ); 
}

export default SideBar;