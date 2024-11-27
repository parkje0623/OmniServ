import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from '@fortawesome/fontawesome-free-solid';

function CartProduct({ item, handleQtyChange, handleRemoveProduct }) {
    const total = (item.quantity * item.price).toFixed(2);

    return (
        <div key={item.name} className="ecomm-cart-product">
            <div>
                <img src={`/ecomm_photo/${item.name.toLowerCase().replace(/ +/g, "")}.jpg`} alt={item.name} />
            </div>

            <div className="item">
                <h3>{item.name}</h3>
                <h4>SKU: {item.SKU}</h4>
            </div>

            <div className="item">
                <p>Price: ${item.price}</p>
            </div>

            <div className="item">
                <button className="minus-btn" onClick={() => handleQtyChange(item.SKU, "minus")}><FontAwesomeIcon icon={faMinus} /></button>
                <span className="quantity">{item.quantity}</span>
                <button className="plus-btn" onClick={() => handleQtyChange(item.SKU, "plus")}><FontAwesomeIcon icon={faPlus} /></button>
            </div>

            <div className="ecomm-last-item item">
                <h3>Total: ${total}</h3>
            </div>

            <FontAwesomeIcon 
                icon={faTrash} 
                className="ecomm-remove-product"
                onClick={() => handleRemoveProduct(item.SKU)}
            />
        </div>
    );
}

export default CartProduct;