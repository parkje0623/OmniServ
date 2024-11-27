import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/fontawesome-free-solid';

function SearchBar({ searchFilter, setSearchFilter }) {
    return (
        <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} />
            <input 
                type="text"
                value={searchFilter}
                placeholder="Search"
                onChange={(e) => setSearchFilter(e.target.value)} 
            />
        </div>
    );
}

export default SearchBar;