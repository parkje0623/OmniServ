import React from "react";

function SortSelector ({ initialOption, optionList, setSortOption }) {
    return (
        <div className="display-order-selector">
            <label htmlFor="display-option">Sort </label>
            <select 
                name="display-option" 
                id="display-option" 
                value={initialOption}
                onChange={(e) => setSortOption(e.target.value)}
            >
                {optionList.length > 0 &&
                    optionList.map((option) => (
                        <option value={option.value}>{option.title}</option>
                    ))
                }
            </select>
        </div>
    );
}

export default SortSelector;