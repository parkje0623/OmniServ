import React from "react";

function Home() {
    return (
        <div className="main-container">
            <div className="about-container">
                <div className="about-topic">
                    <h4>Dashboard (In Progress)</h4>
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
                        <li>
                        <strong>Project Management (Not Ready):</strong>
                            <ul>
                                <li>
                                    In Progress
                                </li>
                            </ul>  
                        </li>
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
                    <h4>E-Commerce (In Progress)</h4>
                    <p>Learning Purposes for E-Commerce Page:</p>
                    <ul>
                        <li>
                            Products
                        </li>
                        <li>
                            Sales Order  
                        </li>
                        <li>
                            Web Socket (Chatting, ???)
                        </li>
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
                    <h4>Profile (Not Ready)</h4>
                    <p>Learning Purposes for Profile Page:</p>
                </div>

                <div className="about-topic">
                    <h4>Setting (Not Ready)</h4>
                    <p>Learning Purposes for Setting Page:</p>
                </div>
            </div>
        </div>
    );
}

export default Home;