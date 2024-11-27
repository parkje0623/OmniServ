import React from "react";
import Modal from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown } from '@fortawesome/fontawesome-free-solid';

function ProductModal({ product, currCategory, handleAddCart, setProductClick, isCartAdded, setIsCartAdded }) {
    return (
        <Modal isOpen={!!product} onClose={() => setProductClick(null)}>
            <div className="product-modal">
            <img src={`/ecomm_photo/${product.name.toLowerCase().replace(/ +/g, "")}.jpg`} alt={product.name} />
                <h2>
                    {product.name}
                    <FontAwesomeIcon 
                        icon={faCartArrowDown} 
                        id="product-modal-icon" 
                        onClick={() => handleAddCart(product)} 
                    />
                </h2>
                {isCartAdded && (
                    <Modal isOpen={isCartAdded} onClose={() => setIsCartAdded(false)}>
                        <h3 className="success-message">{product.name} Has Been Added to the Cart!</h3>
                    </Modal>
                )}
                <h4 className="ecomm-product-price">
                    <strong>${product.price}</strong>
                    {currCategory === 'Electronics' && (
                        <span className="ecomm-product-ehf">Plus $0.45 EHF</span>
                    )}
                </h4>
                <h4>Brand: <strong>{product.brand}</strong></h4>
                <h4>SKU: <strong>{product.SKU}</strong></h4>
                <p>{product.description}</p>
            </div>
        </Modal>
    );
}

export default ProductModal;