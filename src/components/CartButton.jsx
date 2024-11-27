import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from '@fortawesome/fontawesome-free-solid';

function CartButton({ handleCartClick }) {
    return (
        <div className="cart" onClick={handleCartClick}>
            <FontAwesomeIcon icon={faCartPlus} /> 
            <span>Cart</span>
        </div>
    );
}

export default CartButton;