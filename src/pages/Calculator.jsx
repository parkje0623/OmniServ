import React, { useEffect, useMemo } from "react";
import SubContentBar from "../components/SubContentBar";
import { useSubContentContext } from "../context/SubContentContext";
import CurrencyCalc from "../components/calculator/CurrencyCalc";
import MeasurementCalc from "../components/calculator/MeasurementCalc";
import '../stylesheets/calculator.css';

function Calculator() {
    const contentArr = useMemo(() => {
        return ['Currency', 'Measurement'];
    }, []);
    const { selectedItem, handleClickContentArr } = useSubContentContext();

    const renderContent = () => {
        switch (selectedItem) {
            case 'Currency':
                return <CurrencyCalc />;
            case 'Measurement':
                return <MeasurementCalc />;
            default:
                return <CurrencyCalc />;
        } 
    };

    // Handle Default selectedItem at Initial
    useEffect(() => {
        if (!contentArr.includes(selectedItem)) {
            handleClickContentArr('Currency');
        }
    }, [selectedItem, handleClickContentArr, contentArr]);

    return (
        <div className="main-container">
            <div className="sub-content-bar">
                <SubContentBar subContentArr={contentArr} />
            </div>

            <div className="main-content">
                <div className="content-title">
                    <h2>{selectedItem} Calculator</h2>
                </div>

                <div className="content-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default Calculator;