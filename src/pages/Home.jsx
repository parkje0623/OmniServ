import React from "react";

function Home() {
    return (
        <div className="main-container">
            <div className="about-container">
                <div className="about-topic">
                    <h4>Dashboard (Ready)</h4>
                    <p>Learning Purposes for Dashboard Page:</p>
                    <ul>
                        <li>
                            <strong>Chart Types (Ready):</strong>
                            <ul>
                                <li>
                                    Handling Different Types of Charts in ChartJS in React
                                </li>
                                <li>
                                    Handling Separate Chart Options for each Charts
                                </li>
                                <li>
                                    Practice of composing multiple smaller components to create a complex UI
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>Analytics (Ready):</strong>
                            <ul>
                                <li>
                                    Handling simple KPI, Line, Doughnut Charts using ChartJS
                                </li>
                                <li>
                                    Handling table element to display variety data in one element
                                </li>
                                <li>
                                    Displaying a clean dashboard at a glance.
                                </li>
                            </ul>  
                        </li>
                        {/* <li>
                            <strong>Project Management (Not Ready):</strong>
                            <ul>
                                <li>
                                    In Progress
                                </li>
                            </ul>  
                        </li> */}
                    </ul>
                </div>

                <div className="about-topic">
                    <h4>Movie (Ready)</h4>
                    <p>Learning Purposes for Movie Page:</p>
                    <ul>
                        <li>
                            Fetching/Handling APIs with Custom Hooks
                        </li>
                        <li>
                            Conditional Rendering with Modals and Dynamic Content
                        </li>
                        <li>
                            Context API for Global State Management (Selected Movie Category)
                        </li>
                    </ul>
                </div>

                <div className="about-topic">
                    <h4>E-Commerce (Ready)</h4>
                    <p>Learning Purposes for E-Commerce Page:</p>
                    <ul>
                        <li>
                            <strong>Products Display</strong>
                            <ul>
                                <li>
                                    Fetching Data from Firebase Database
                                </li>
                                <li>
                                    Handling Cloud Firestore Rule to dynamically control access permission to the Database for read and write actions
                                </li>
                                <li>
                                    Applying real-time filtering of the products using 'filter()' method and debounce method (for search bar) inside the useEffect
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>User's Cart</strong>
                            <ul>
                                <li>
                                    Handling Changes to the Firebase Database (adding, removing, editing, etc.)
                                </li>
                                <li>
                                    Handling Cloud Firestore Rule to dynamically control access permission to the Database for read and write actions
                                </li>
                                <li>
                                    Use of 'beforeunload' and 'localStorage' for Guest users to keep their products in Cart for an Hour.
                                </li>
                            </ul>
                        </li>
                        {/* <li>
                            Web Socket (Chatting like ChatBot)
                        </li> */}
                    </ul>
                </div>

                <div className="about-topic">
                    <h4>Calculator (Ready)</h4>
                    <p>Learning Purposes for Calculator Page:</p>
                    <ul>
                        <li>
                            <strong>Currency Calculator: </strong> 
                            <ul>
                                <li>
                                    Fetching/Handling API Calls with 'useEffect'
                                </li>
                                <li>
                                    State Management and Conditional Logic
                                </li>
                                <li>
                                    Passing Props and Component Composition
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>Measurement Calculator: </strong> 
                            <ul>
                                <li>
                                    'useState' and Controlled Components
                                </li> 
                                <li>
                                    'useMemo' for Efficient Data Handling
                                </li>
                                <li>
                                    'useCallback' to Memoize Conversion Functions
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div className="about-topic">
                    <h4>Profile (Ready)</h4>
                    <p>Learning Purposes for Profile Page:</p>
                    <ul>
                        <li>
                            Displaying User Information by using Firebase 'auth' methods
                        </li>
                        <li>
                            Update User Information by using Firebase 'auth' methods through 'Form' submission
                        </li>
                        <li>
                            Safely Deleting User and data associated with the use (by re-asking user for confirmation) from the Firebase System
                        </li>
                    </ul>
                </div>

                <div className="about-topic">
                    <h4>Setting (In Progress)</h4>
                    <p>Learning Purposes for Setting Page:</p>
                    <ul>
                        <li>
                            Dark Mode (NOT READY)
                        </li>
                        <li>
                            Auto-Logout (In Progress)
                        </li>
                        <li>
                            Reset Setting (NOT READY)
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Home;