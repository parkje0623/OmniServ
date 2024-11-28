import React, { useEffect, useMemo } from "react";
import { useSubContentContext } from "../context/SubContentContext";
import SubContentBar from "../components/SubContentBar";
import Analytics from "../components/dashboard/Analytics";
// import ProjectManagement from "../components/dashboard/ProjectManagement";
import ChartTypes from "../components/dashboard/ChartTypes";
import '../stylesheets/dashboard.css';

function Dashboard() {
    const contentArr = useMemo(() => {
        return ['Chart Types', 'Analytics'];
        // return ['Chart Types', 'Analytics', 'Project Management'];
    }, []);
    const { selectedItem, handleClickContentArr } = useSubContentContext();

    const renderContent = () => {
        switch (selectedItem) {
            case 'Chart Types':
                return <ChartTypes />;
            case 'Analytics':
                return <Analytics />;
            // case 'Project Management':
            //     return <ProjectManagement />;
            default:
                return <ChartTypes />;
        } 
    };

    // Handle Default selectedItem at Initial
    useEffect(() => {
        if (!contentArr.includes(selectedItem)) {
            handleClickContentArr('Chart Types');
        }
    }, [selectedItem, handleClickContentArr, contentArr]);

    return (
        <div className="main-container">
            <div className="sub-content-bar">
                <SubContentBar subContentArr={contentArr} />
            </div>

            <div className="main-content">
                <div className="content-title">
                    <h2>{selectedItem} Dashboard</h2>
                </div>

                <div className="content-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;