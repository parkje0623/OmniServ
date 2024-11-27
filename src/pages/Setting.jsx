import React, { useEffect, useState } from "react";
import { useAutoLogout } from "../context/AutoLogoutContext";

function Setting() {
    // Auto-Logout Variables
    const { timeoutDuration, updateTimeoutDuration } = useAutoLogout();
    const [newTimeout, setNewTimeout] = useState(timeoutDuration);
    const [isTimerUpdated, setIsTimerUpdated] = useState(false);
    const timerToWord = {
        1800000: '30 Minutes',
        3600000: '1 Hour',
        7200000: '2 Hour',
        'Infinity': 'Never'
    }
    
    const handleTimerChanged = (e) => {
        const selectedTimeout = e.target.value === 'Infinity' ? Infinity : parseInt(e.target.value);
        setNewTimeout(selectedTimeout);
        setIsTimerUpdated(true);
        updateTimeoutDuration(selectedTimeout);
    };

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
                        <select name="timer" id="timer" value={newTimeout ? newTimeout : '30 Minutes'} onChange={(e) => handleTimerChanged(e)}>
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
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Setting;