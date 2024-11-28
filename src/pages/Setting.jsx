import React, { useEffect, useState } from "react";
import { useAutoLogout } from "../context/AutoLogoutContext";
import { useDarkMode } from "../context/DarkModeContext";
import useAuthRedirect from "../hooks/useAuthRedirect";
import Modal from "../components/Modal";

function Setting() {
    // Redirect if user is logged in
    useAuthRedirect('/setting', '/signin');

    // Dark Mode Variables
    const { defaultDarkMode, updateDarkMode } = useDarkMode();
    const [isDarkModeOn, setIsDarkModeOn] = useState(defaultDarkMode === "on" ? true : false);

    // Auto-Logout Variables
    const { timeoutDuration, updateTimeoutDuration } = useAutoLogout();
    const [newTimeout, setNewTimeout] = useState(timeoutDuration);
    const [isTimerUpdated, setIsTimerUpdated] = useState(false);
    const timerToWord = {
        1800000: '30 Minutes',
        3600000: '1 Hour',
        7200000: '2 Hour',
        'Infinity': 'Never'
    };

    // Reset Variables
    const defaultTimeoutDuration = 1800000;
    const [resetClicked, setResetClicked] = useState(false);
    
    // Handling DarkMode Switch Toggle
    const handleSwitchChange = () => {
        if (isDarkModeOn) {
            setIsDarkModeOn(false);
            updateDarkMode("off");
        } else {
            setIsDarkModeOn(true);
            updateDarkMode("on");
        }
    };

    // Handling Timer Change
    const handleTimerChanged = (timerValue) => {
        const selectedTimeout = timerValue === 'Infinity' ? Infinity : parseInt(timerValue);
        setNewTimeout(selectedTimeout);
        updateTimeoutDuration(selectedTimeout);

        // Update Message not shown upon setting reset
        if (!resetClicked) {
            setIsTimerUpdated(true);
        } else {
            setIsTimerUpdated(false);
        }
    };

    // Handling Setting Reset
    const handleSettingReset = () => {
        // Reset to Default Timeout Duration (30 Minutes)
        handleTimerChanged(defaultTimeoutDuration);
        setResetClicked(false);
        // Reset to Default DarkMode (OFF)
        updateDarkMode("off");
        setIsDarkModeOn(false);
    };

    // Updating DarkMode On/Off (from the database)
    useEffect(() => {
        if (defaultDarkMode !== null) {
            setIsDarkModeOn(defaultDarkMode === "on" ? true : false);
        }
    }, [defaultDarkMode]);

    // Updating Timeout for Auto-Logout
    useEffect(() => {
        if (timeoutDuration !== null) {
            setNewTimeout(timeoutDuration);
        }
    }, [timeoutDuration]);

    return (
        <div className="main-container setting">
            <div>
                <div className="setting-title">
                    <h2>Dark Mode</h2>
                </div>

                <div className="setting-body">
                    <div>
                        <p>Switch between Light and Dark mode for your preferred viewing experience.</p>
                        <label className="switch">
                            <input type="checkbox" onChange={handleSwitchChange} checked={isDarkModeOn}/>
                            <span className={`slider round ${isDarkModeOn ? "on" : "off"}`}>
                                {isDarkModeOn ? "ON" : "OFF"}
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            <div>
                <div className="setting-title">
                    <h2>Auto-Logout Timer</h2>
                </div>

                <div className="setting-body">
                    <div>
                        <p>Set the auto-logout timer when you are inactive!</p>
                        <h3>Current Timer: {timerToWord[newTimeout]}</h3>
                        {isTimerUpdated && <p className="success-message">Timer has Successfully Updated!</p>}
                        <select name="timer" id="timer" value={newTimeout ? newTimeout : '30 Minutes'} onChange={(e) => handleTimerChanged(e.target.value)}>
                            <option value={1800000}>30 Minutes</option>
                            <option value={3600000}>1 Hour</option>
                            <option value={7200000}>2 Hour</option>
                            <option value={Infinity}>Never</option>
                        </select>
                    </div>
                </div>
            </div>

            <div>
                <div className="setting-title">
                    <h2>Reset Setting</h2>
                </div>

                <div className="setting-body">
                    <div>
                        <p>**This action will reset the above settings to default setting.</p>
                        <button type="button" className="warning-button" onClick={() => setResetClicked(true)}>
                            Reset Setting
                        </button>
                        {resetClicked &&
                            <Modal isOpen={resetClicked} onClose={() => setResetClicked(false)}>
                                <h3>Are you sure you want to reset the setting?</h3>
                                <button type="button" className="warning-button" onClick={handleSettingReset}>
                                    Reset
                                </button>
                            </Modal>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Setting;