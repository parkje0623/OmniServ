import React, { createContext, useContext, useState } from "react";

const SubContentContext = createContext();
export const useSubContentContext = () => {
    return useContext(SubContentContext);
}

export const SubContentProvider = ({ children }) => {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleClickContentArr = (item) => {
        setSelectedItem(item);
    };

    return (
        <SubContentContext.Provider value={{ selectedItem, handleClickContentArr }}>
            {children}
        </SubContentContext.Provider>
    )
};
