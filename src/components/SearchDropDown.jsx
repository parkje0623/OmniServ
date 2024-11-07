import React, { useState, useRef, useEffect } from "react";

function SearchDropDown({ items, description=[], initialItem, onSelect }) {
    const [search, setSearch] = useState(initialItem);
    const [isOptionOpen, setIsOptionOpen] = useState(false);
    const inputRef = useRef(null); 
    const dropdownRef = useRef(null); 

    // Filter Options when being Searched
    const filteredOptions = items.filter(option =>
        option.toLowerCase().includes(search.toLowerCase())
    );

    // Handle Option being Clicked
    const handleOptionSelect = (option) => {
        onSelect(option);
        setSearch(option);
        setIsOptionOpen(false);
    };

    // Update Search whenever initialItem changes by Fliping Currencies
    useEffect(() => {
        setSearch(initialItem); 
    }, [initialItem]);

    // Handle Hiding Dropdown Options when Clicked outside of Input and Dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOptionOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    return (
        <div className="search-dropdown">
            <input
                type="text"
                value={search + (description[search] ? (' - ' + description[search]) : '')}
                onChange={(e) => setSearch(e.target.value)} 
                onFocus={() => setIsOptionOpen(true)}
                ref={inputRef}
            />
            {isOptionOpen && (
                <ul className="search-dropdown-list" ref={dropdownRef}>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((item) => (
                            <li key={item} onClick={() => handleOptionSelect(item)}>
                                {item} 
                                {description[item] ? ' - ' + description[item] : ''}
                            </li>
                        ))
                    ) : (
                        <></>
                    )}
                </ul>
            )}
        </div>
    );
}

export default SearchDropDown;