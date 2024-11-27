import React from "react";
import ProductCard from "./ProductCard";

function ProductList({ filteredData, setProductClick, currCategory }) {
    return (
        <ul className="ecomm-product-item">
            {filteredData?.length ? (
                filteredData.map((product) => (
                    <ProductCard 
                        key={product.name} 
                        product={product} 
                        currCategory={currCategory} 
                        setProductClick={setProductClick} 
                    />
                ))
            ) : (
                <div className="ecomm-product-not-available">
                    <p><strong>{currCategory} Not Available. Please Try Again Later.</strong></p>
                </div>
            )}
        </ul>
    );
}

export default ProductList;