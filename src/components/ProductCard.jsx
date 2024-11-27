import React from "react";

function ProductCard({ product, currCategory, setProductClick }) {
    return (
        <li onClick={() => setProductClick(product)}>
            <img src={`/ecomm_photo/${product.name.toLowerCase().replace(/ +/g, "")}.jpg`} 
                    alt={product.name}
                    loading="lazy" />
            <strong>{product.name}</strong>
            <p>
                <strong className="ecomm-product-price">{`$${product.price}`}</strong><br/>
                {currCategory === 'Electronics' &&
                    <span className="ecomm-product-ehf">Plus $0.45 EHF</span>
                }
            </p>
        </li>
    );
}

export default ProductCard;