import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRetweet } from "@fortawesome/fontawesome-free-solid";
import SearchDropDown from "../SearchDropDown";

function MeasurementCalc() {
    const [fromAmount, setFromAmount] = useState(0);
    const [toAmount, setToAmount] = useState(0);
    const [fromUnit, setFromUnit] = useState('m');
    const [toUnit, setToUnit] = useState('km');
    const [category, setCategory] = useState('Length'); 
    const [currencyChange, setCurrencyChanged] = useState({ from: true, to: false });

    const conversionFactors = useMemo(() => ({
        Length: {
            base: 'm',
            units: {
                mm: 0.001, // 1m = 0.001mm
                cm: 0.01,  // etc.
                m: 1,
                km: 1000,
                mile: 1609.34,
                inch: 0.0254,
                foot: 0.3048,
                yard: 0.9144
            }
        },
        Mass: {
            base: 'kg',
            units: {
                g: 0.001, // 1kg = 0.001g
                kg: 1,    // etc.
                tonne: 1000,
                pound: 0.453592,
                ounce: 0.0283495
            }
        },
        Volume: {
            base: 'L',
            units: {
                ml: 0.001, // 1L = 0.001ml
                L: 1,      // etc.
                gallon: 3.78541,
                teaspoon: 0.00492892,
                tablespoon: 0.0147868,
                ounce: 0.0295734,
                cup: 0.24,
                pint: 0.473176
            }
        },
        Temperature: {
            base: 'Celsius',
            units: {
                Celsius: (c) => (c * 9 / 5) + 32,
                Fahrenheit: (f) => (f - 32) * 5 / 9
            }
        }
    }), []);

    // Calculator for Converting Length/Mass/Volume
    const convertLengthMassVolume = useCallback((value, fromUnit, toUnit, category) => {
        // Return the same value if the units are the same (e.g., m to m)
        if (fromUnit === toUnit) {
            return value;
        }
        // Perform the conversion calculation (e.g., m to km).
        const units = conversionFactors[category].units;
        const baseUnit = value * units[fromUnit];
        const convertValue = baseUnit / units[toUnit];

        return convertValue;
    }, [conversionFactors]);
    // Calculator for Converting Temperature
    const convertTemperature = useCallback((value, fromUnit, toUnit) => {
        // Return the same value if the units are the same (e.g., C to C)
        if (fromUnit === toUnit) {
            return value;
        }
        // Perform the conversion calculation (e.g., C to F).
        if (fromUnit === 'Fahrenheit' && toUnit === 'Celsius') {
            return conversionFactors['Temperature'].units.Fahrenheit(value);
        } else if (fromUnit === 'Celsius' && toUnit === 'Fahrenheit') {
            return conversionFactors['Temperature'].units.Celsius(value);
        }
    }, [conversionFactors]);

    // Handle Selecting Categories
    const handleCategorySelect = (category) => {
        setFromUnit(Object.keys(conversionFactors[category].units)[0]);
        setToUnit(Object.keys(conversionFactors[category].units)[1]);
        setCategory(category);
    };
    // Handle Selecting Units
    const handleUnitSelect = (unit, type) => {
        if (type === 'from') {
            setFromUnit(unit);
        } else if (type === 'to') {
            setToUnit(unit);
        }
    };
    // Handle Fliping Units (from -> to, to -> from)
    const handleFlipUnit = () => {
        const temp = fromUnit;
        setFromUnit(toUnit);
        setToUnit(temp);
        setCurrencyChanged({ from: true, to: false });
    };

    useEffect(() => {
        console.log(toUnit)
        if (currencyChange.from) {
            if (category === 'Temperature') {
                const toTemp = convertTemperature(fromAmount, fromUnit, toUnit);
                setToAmount(toTemp);
            } else {
                const toUnitAmount = convertLengthMassVolume(fromAmount, fromUnit, toUnit, category);
                setToAmount(toUnitAmount);
            }
        } else if (currencyChange.to) {
            if (category === 'Temperature') {
                const fromTemp = convertTemperature(toAmount, toUnit, fromUnit);
                setFromAmount(fromTemp);
            } else {
                const fromUnitAmount = convertLengthMassVolume(toAmount, toUnit, fromUnit, category);
                setFromAmount(fromUnitAmount);
            }
        }
    }, [category, fromAmount, fromUnit, toAmount, toUnit, currencyChange, convertTemperature, convertLengthMassVolume]);

    return (
        <>
            <div className="content-description">
                <p>
                    Quickly convert between measurement units like pounds to kilograms, inches to centimeters, and more.
                </p>
                <p>
                    <strong>Note: </strong>
                    Only basic unit conversions are supported.
                </p>
            </div>

            <div className="content-detail">
                <div className="result">
                    <p>
                        <strong>{new Intl.NumberFormat().format(fromAmount)} </strong> 
                        <span>{fromUnit}</span>
                        <strong> = {new Intl.NumberFormat().format(toAmount)} </strong>
                        <span>{toUnit}</span>
                    </p>
                </div>

                <div className="measurement-calculator">
                    <div className="measurement-category">
                        <SearchDropDown 
                            items={Object.keys(conversionFactors)}
                            initialItem={category}
                            onSelect={(category) => handleCategorySelect(category)}
                        />
                    </div>

                    <div className="calculator measurement-section">
                        <div className="measurement-from">
                            <input 
                                className="input-currency"
                                type="number"
                                value={fromAmount}
                                onChange={(e) => {
                                    setFromAmount(e.target.value);
                                    setCurrencyChanged({ from: true, to: false });
                                }}
                            />
                            <SearchDropDown 
                                items={Object.keys(conversionFactors[category].units)} 
                                initialItem={fromUnit} 
                                onSelect={(unit) => handleUnitSelect(unit, "from")} 
                            />
                        </div>

                        <div className="measurement-flip">
                            <button type="button" onClick={handleFlipUnit}>
                                <FontAwesomeIcon icon={faRetweet} />
                            </button>
                        </div>

                        <div className="measurement-to">
                            <input 
                                className="input-currency"
                                type="number"
                                value={toAmount}
                                onChange={(e) => {
                                    setToAmount(e.target.value);
                                    setCurrencyChanged({ from: false, to: true });
                                }}
                            />
                            <SearchDropDown 
                                items={Object.keys(conversionFactors[category].units)} 
                                initialItem={toUnit} 
                                onSelect={(unit) => handleUnitSelect(unit, "to")} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MeasurementCalc;