import React from "react";

function CartFinalTotals({ cartTotals }) {
    return (
        <div className="cart-total">
            <div className="cart-total-item">
                <div className="label"><h3>Sub-Total:</h3></div>
                <div><h3>${cartTotals.subtotal.toFixed(2)}</h3></div>
            </div>
            <div className="cart-total-item">
                <div className="label"><h3>Tax:</h3></div>
                <div><h3>${cartTotals.tax.toFixed(2)}</h3></div>
            </div>
            <div className="cart-total-item ecomm-product-price">
                <div className="label"><h3>Total:</h3></div>
                <div><h3>${cartTotals.total.toFixed(2)}</h3></div>
            </div>
        </div>
    )
}

export default CartFinalTotals;