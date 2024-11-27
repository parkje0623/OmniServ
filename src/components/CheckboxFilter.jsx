import React from "react";

function CheckboxFilter({ title, filterOptions=[], filterName, handleCheckboxFilter }) {
    return (
        <div className={`${filterName}-filter filter`}>
            <p><strong>{title}</strong></p>
            {filterOptions.map((option) => (
                <div key={option} className="checkbox-filter">
                    <input 
                        id={option}
                        value={option}
                        name={filterName}
                        type="checkbox"
                        onChange={handleCheckboxFilter}
                    />
                    <label htmlFor={option}>{option}</label>
                </div>
            ))}
        </div>
    );
}

export default CheckboxFilter;