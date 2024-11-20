import React, { useEffect, useMemo } from "react";
import { useSubContentContext } from "../context/SubContentContext";
import SubContentBar from "../components/SubContentBar";
import Python from "../components/coding/Python";
import LearnReact from "../components/coding/LearnReact";
import JavaScript from "../components/coding/JavaScript";
import HTML from "../components/coding/HTML";
import CSS from "../components/coding/CSS";
import Interview from "../components/coding/Interview";

function Coding() {
    const contentArr = useMemo(() => {
        return ['Python', 'React', 'JavaScript', 'HTML', 'CSS', 'Interview'];
    }, []);
    const { selectedItem, handleClickContentArr } = useSubContentContext();

    const renderContent = () => {
        switch (selectedItem) {
            case 'Python':
                return <Python />;
            case 'React':
                return <LearnReact />;
            case 'JavaScript':
                return <JavaScript />;
            case 'HTML':
                return <HTML />;
            case 'CSS':
                return <CSS />;
            case 'Interview':
                return <Interview />;
            default:
                return <Python />;
        } 
    };

    // Handle Default selectedItem at Initial
    useEffect(() => {
        if (!contentArr.includes(selectedItem)) {
            handleClickContentArr('Python');
        }
    }, [selectedItem, handleClickContentArr, contentArr]);

    return (
        <div className="main-container">
            <div className="sub-content-bar">
                <SubContentBar subContentArr={contentArr} />
            </div>

            <div className="main-content">
                <div className="content-title">
                    <h2>{selectedItem}</h2>
                </div>

                <div className="content-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default Coding;