import React, {useEffect} from "react";
import { useSubContentContext } from "../context/SubContentContext";

function SubContentBar({ subContentArr }) {
    const { selectedItem, handleClickContentArr } = useSubContentContext();

    // Set the first item as selected on initial render
    useEffect(() => {
        if (!selectedItem && subContentArr.length > 0) {
            handleClickContentArr(subContentArr[0]);
        }
    }, [selectedItem, subContentArr, handleClickContentArr]);

    return (
        <>
            <ul>
                {subContentArr.map((item) => (
                    <li key={item}
                        className={selectedItem === item ? 'selected' : ''}
                        onClick={() => handleClickContentArr(item)}
                    >
                        <h3>{item}</h3>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default SubContentBar;