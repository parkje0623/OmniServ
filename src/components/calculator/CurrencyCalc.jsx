import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRetweet } from "@fortawesome/fontawesome-free-solid";
import SearchDropDown from "../SearchDropDown";

function CurrencyCalc() {
    const [fromCurrency, setFromCurrency] = useState("CAD"); 
    const [toCurrency, setToCurrency] = useState("USD"); 
    const [fromAmount, setFromAmount] = useState(1);
    const [toAmount, setToAmount] = useState(2);
    const [currencyChange, setCurrencyChanged] = useState({ from: true, to: false });
    const [currencyRate, setCurrencyRate] = useState({});
    const [currencyArr] = useState([
        'AED', 'AUD', 'BRL', 'CAD', 'CHF',
        'CNY', 'EUR', 'GBP', 'HKD', 'INR',
        'JPY', 'KRW', 'MXN', 'MYR', 'SEK',
        'SGD', 'THB', 'TWD', 'USD', 'ZAR'
    ]);
    const currencyDescription = {
        'AED': 'United Arab Emirates Dirham', 'AUD': 'Australian Dollar', 'BRL': 'Brazilian Real', 'CAD': 'Canadian Dollar', 'CHF': 'Swiss Franc',
        'CNY': 'Chinese Yuan', 'EUR': 'Euro', 'GBP': 'Pound Sterling', 'HKD': 'Hong Kong Dollar', 'INR': 'Indian Rupee',
        'JPY': 'Japanese Yen', 'KRW':'South Korean Won', 'MXN': 'Mexican Peso', 'MYR': 'Malaysian Ringgit', 'SEK': 'Swedish Krona/Kronor',
        'SGD': 'Singapore Dollar', 'THB': 'Thai Baht ', 'TWD': 'New Taiwan Dollar', 'USD': 'United States Dollar', 'ZAR': 'South African Rand',
    };
    const [error, setError] = useState(); 

    // Handle Selecting either From/To Currency
    const handleOptionSelect = (option, type) => {
        if (type === 'from') {
            setFromCurrency(option);
        } else if (type === 'to') {
            setToCurrency(option);
        }
        setCurrencyChanged({ from: true, to: false });
    };
    // Handle Switching Currency (from -> to, to -> from)
    const handleFlipCurrency = () => {
        const temp = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(temp);
        setCurrencyChanged({ from: true, to: false });
    };

    useEffect(() => {
        const fetchCurrency = async () => {
            const options = {
                method: "GET",
                url: `https://api.fxratesapi.com/latest?api_key=${process.env.REACT_APP_CURRENCY_RATES_API}
                        &base=${fromCurrency}&currencies=${currencyArr.toString()}
                        &resolution=1d&amount=1&places=2&format=json`
            };

            try {
                const response = await axios.request(options);
                console.log("Fetching Currency Successful: ", response.data);
                // Set the Currency rate, and update the toAmount.
                setCurrencyRate(response.data.rates);
            } catch (error) {
                console.error("Error Fetching Currency: ", error);
                setFromCurrency("CAD");
                setCurrencyRate({
                    'AED': 2.65, 'AUD': 1.09, 'BRL': 4.11, 'CAD': 1, 'CHF': 0.63,
                    'CNY': 5.15, 'EUR': 0.67, 'GBP': 0.56, 'HKD': 5.61, 'INR': 60.73,
                    'JPY': 110.41, 'KRW': 996.14, 'MXN': 14.32, 'MYR': 3.14, 'SEK': 7.66,
                    'SGD': 0.96, 'THB': 24.41, 'TWD': 23.15, 'USD': 0.72, 'ZAR': 12.85,
                });
                setError("Error while Fetching Current Currency Rate. Base currency is fixed to CAD and the rate is the rate from 2024-10-24. Sorry for the inconvenience.");
            }
        };

        fetchCurrency();
    }, [fromCurrency, currencyArr]);

    useEffect(() => {
        const roundToFour = (num) => Math.round((num + Number.EPSILON) * 10000) / 10000;
        if (currencyChange.from) {
            const calcToAmount = fromAmount * currencyRate[toCurrency];
            setToAmount(roundToFour(calcToAmount));
        } else if (currencyChange.to) {
            const calcFromAmount = toAmount / currencyRate[toCurrency];
            setFromAmount(roundToFour(calcFromAmount));
            setCurrencyChanged({ from: false, to: false });
        }
    }, [toAmount, fromAmount, currencyRate, toCurrency, currencyChange]);

    return (
        <>
            <div className="content-description">
                <p>
                    Quickly convert major currencies with up-to-date exchange rates.
                </p>
                <p>
                    <strong>Note: </strong>
                    Historical data is not available due to API limitations.
                </p>
                {error && <p className="error">{error}</p>}
            </div>

            <div className="content-detail">
                <div className="result">
                    <p>
                        <strong>{new Intl.NumberFormat().format(fromAmount)} </strong> 
                        <span>{currencyDescription[fromCurrency]}</span>
                        <strong> = {new Intl.NumberFormat().format(toAmount)} </strong>
                        <span>{currencyDescription[toCurrency]}</span>
                    </p>
                </div>

                <div className="calculator">
                    <div className="currency-from">
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
                            items={currencyArr} 
                            description={currencyDescription} 
                            initialItem={fromCurrency} 
                            onSelect={(option) => handleOptionSelect(option, "from")} 
                        />
                    </div>

                    <div className="currency-flip">
                        <button type="button" onClick={handleFlipCurrency}>
                            <FontAwesomeIcon icon={faRetweet} />
                        </button>
                    </div>

                    <div className="currency-to">
                        <input 
                            className="input-currency"
                            type="number"
                            value={isNaN(toAmount) ? 0 : toAmount}
                            onChange={(e) => {
                                setToAmount(e.target.value);
                                setCurrencyChanged({ from: false, to: true });
                            }}
                        />
                        <SearchDropDown 
                            items={currencyArr} 
                            description={currencyDescription} 
                            initialItem={toCurrency} 
                            onSelect={(option) => handleOptionSelect(option, "to")} 
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CurrencyCalc;