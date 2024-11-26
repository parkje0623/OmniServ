import React, { useEffect, useState, useCallback } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, updateDoc, increment, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown, faCartPlus, faSearch, faMinus, faPlus, faTrash } from '@fortawesome/fontawesome-free-solid';
import '../stylesheets/ecomm.css';
import Modal from "../components/Modal";
import { useDebounce } from "../hooks/useDebounce";
import { ecommProductFilters } from "../utils/filters";

function Ecomm() {
    // Current User UID
    const userId = auth.currentUser ? auth.currentUser.uid : 'guests';
    // Fixed Categories and its Components
    const categorySelection = ["Electronics", "Clothings"];
    const categoryPriceRange = {
        "Electronics": ['Less Than $200', '$200 - $499.99', '$500 - $999.99', '$1,000 & Up'],
        "Clothings": ['Less Than $50', '$50 - $99.99', '$100 - $149.99', '$150 & Up'],
    };

    // Variables that may change
    const [currCategory, setCurrCategory] = useState("Electronics");
    const [productData, setProductData] = useState({});
    const [productClick, setProductClick] = useState(null);

    // Variables for Filters
    const [filteredData, setFilteredData] = useState([]);
    const [sortOption, setSortOption] = useState("low-to-high");
    const [searchFilter, setSearchFilter] = useState("");
    const debouncedTerm = useDebounce(searchFilter, 100);
    const [priceFilter, setPriceFilter] = useState([]);
    const [productType, setProductType] = useState([]);
    const [typeFilter, setTypeFilter] = useState([]);
    const [productBrand, setProductBrand] = useState([]);
    const [brandFilter, setBrandFilter] = useState([]);

    // Variables for Cart
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCartAdded, setIsCartAdded] = useState(false);
    const [cartProducts, setCartProducts] = useState([]);
    const [cartTotals, setCartTotals] = useState({ subtotal: 0, tax: 0, total: 0 });

    // Handling Checkbox onChange
    const handleCheckboxFilter = (e, setFilter) => {
        if (e.target.checked) {
            setFilter((prev) => [...prev, e.target.value]);
        } else {
            setFilter((prev) => prev.filter((b) => b !== e.target.value));
        }
    }

    // Handling Add Product to Cart
    const handleAddCart = async (product) => {
        try {
            if (userId) {
                const cartCollectionRef = collection(db, `users/${userId}/cart`);
                const existingProductQuery = doc(cartCollectionRef, product.SKU);
                const existingProductSnapshot = await getDoc(existingProductQuery);
                
                if (existingProductSnapshot.exists()) {
                    // Increment quantity if item exists
                    await updateDoc(existingProductQuery, {
                        quantity: increment(product.quantity || 1)
                    });
                    console.log("Product Quantity updated in cart.");
                } else {
                    // Add new item if it doesn't exist
                    const newProduct = { name: product.name, price: product.price, SKU: product.SKU, quantity: 1 }
                    await setDoc(existingProductQuery, newProduct);
                    console.log("New Product added to cart.");
                }
                setIsCartAdded(true);
            }
        } catch (error) {
            console.error("Error Adding Product to Cart: ", error);
        }
    };
    // Handling Cart onClick
    const handleCartClick = async () => {
        setIsCartOpen(true);
        setCurrCategory("");

        try {
            if (userId) {
                const cartCollectionRef = collection(db, `users/${userId}/cart`);
                const productSnapshot = await getDocs(cartCollectionRef);
                const cartProducts = productSnapshot.docs.map((doc) => ({
                    ...doc.data()
                }));
                setCartProducts(cartProducts);

                const subTotal = cartProducts.reduce((sum, item) => sum + parseFloat(item.price * item.quantity || 0), 0);
                const tax = subTotal * 0.12;
                const total = subTotal + tax;
                setCartTotals({
                    subtotal: subTotal,
                    tax: tax,
                    total: total
                });
                console.log("Cart Products Fetched Successfully!");
            }
        } catch (error) {
            console.error("Error Fetching User's Cart: ", error);
        }
    };
    // Handling Product Remove onClick
    const handleRemoveProduct = async (productSKU) => {
        try {
            if (userId) {
                const productRef = doc(db, `users/${userId}/cart`, productSKU);
                await deleteDoc(productRef);
                handleCartClick();
                console.log("Cart Products Removed Successfully!");
            }
        } catch (error) {
            console.error("Error Removing a product from the Cart: ", error);
        }
    };
    // Handling Product Quantity Change
    const handleQtyChange = async (productSKU, change) => {
        try {
            if (userId) {
                const productRef = doc(db, `users/${userId}/cart`, productSKU);
                const productDoc = await getDoc(productRef); 

                if (productDoc.exists()) {
                    const currentQuantity = productDoc.data().quantity;  
                    if (change === "plus") {
                        await updateDoc(productRef, {
                            quantity: increment(1)
                        });
                    } else if (change === "minus" && currentQuantity > 1) {
                        await updateDoc(productRef, {
                            quantity: increment(-1)
                        });
                    }

                    console.log("Cart Product Quantity Changed Successfully!");
                    handleCartClick();
                } else {
                    console.log("Product does not exist in cart");
                }
            }
        } catch (error) {
            console.error("Error Changing Quantity: ", error);
        }
    };

    // Clear Cart (Only for Guests) on Exit page
    const clearCartOnExit = useCallback(async () => {
        if (userId === 'guests') {
            const cartCollectionRef = collection(db, `users/${userId}/cart`);
            const cartSnapshot = await getDocs(cartCollectionRef);

            // Remove all products from the cart
            const deletePromises = cartSnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises); // Wait for all deletes to finish
            console.log("Cart cleared on exit!");
        }
    }, [userId]);
    // beforeunload: handles the user on exit
    useEffect(() => {
        const handleUnload = () => {
            // Use localStorage to store the "clear cart" flag
            if (userId === 'guests') {
                localStorage.setItem('clearCart', 'true');
            }
        };
        window.addEventListener('beforeunload', handleUnload);
    
        if (localStorage.getItem('clearCart') === 'true') {
            clearCartOnExit(); 
            localStorage.removeItem('clearCart'); 
        }
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, [userId, clearCartOnExit]);

    // Handling Filters
    useEffect(() => {
        let filtered = Object.values(productData).flat();
        // Apply Search Here
        if (debouncedTerm) {
            filtered = filtered.filter((product) => 
                product.name.toLowerCase().includes(debouncedTerm.toLowerCase())
            );
        }
        // Apply other Filters
        filtered = ecommProductFilters(
            filtered,
            { 
                searchTerm: debouncedTerm, 
                priceRanges: priceFilter, 
                brandFilter, 
                typeFilter, 
                sortOption 
            }
        );
        setFilteredData(filtered);
    }, [productData, debouncedTerm, sortOption, priceFilter, brandFilter, typeFilter]);

    // Fetch Products Depends on the Current Category
    useEffect(() => {
        async function fetchProducts() {
            try {
                const productRef = doc(db, 'products', currCategory.toLowerCase()); 
                const productDoc = await getDoc(productRef); 
                const productData = {
                    ...productDoc.data()
                };

                setProductData(productData);
                setProductType(Object.keys(productData));
                setProductBrand([...new Set(Object.values(productData).flat().map(product => product.brand))]);
            } catch (error) {
                console.error("Error Fetching Products: ", error);
            }
        }

        if (currCategory !== "") {
            fetchProducts();
        }
    }, [currCategory]);

    return (
        <div className="main-container ecomm-container">
            <div className="ecomm-header">
                <div className="ecomm-content-header">
                    {categorySelection.map((category) => (
                        <div key={category} className="content-selector">
                            <button 
                                type="button" 
                                onClick={() => {
                                    setCurrCategory(category);
                                    setIsCartOpen(false);
                                }}
                                className={currCategory === category ? 'active' : ''}
                            >
                                {category}
                            </button>
                        </div>
                    ))}
                </div>
                
                {!isCartOpen && 
                    <div className="ecomm-option-header">
                        <div className="display-order-selector">
                            <label htmlFor="display-option">Sort </label>
                            <select name="display-option" id="display-option" onClick={(e) => setSortOption(e.target.value)}>
                                <option value="low-to-high">Price Low to High</option>
                                <option value="high-to-low">Price High to Low</option>
                            </select>
                        </div>

                        <div className="search-bar">
                            <FontAwesomeIcon icon={faSearch} />
                            <input 
                                type="text"
                                placeholder="Search"
                                onChange={(e) => setSearchFilter(e.target.value)} 
                            />
                        </div>

                        <div className="cart" onClick={handleCartClick}>
                            <FontAwesomeIcon icon={faCartPlus} /> 
                            <span>Cart</span>
                        </div>
                    </div>
                }
            </div>

            {!isCartOpen && 
                <div className="ecomm-body">
                    <div className="ecomm-filter">
                        <div className="price-filter filter">
                            <p><strong>Price</strong></p>
                            {categoryPriceRange && currCategory && 
                                (categoryPriceRange[currCategory]).map((price) => (
                                    <div key={price} className="checkbox-filter">
                                        <input 
                                            id={price}
                                            value={price}
                                            name="price"
                                            type="checkbox"
                                            onChange={(e) => handleCheckboxFilter(e, setPriceFilter)}
                                        />
                                        <label htmlFor={price}>{price}</label>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="brand-filter filter">
                            <p><strong>Brand</strong></p>
                            {productBrand && productBrand.map((brand) => (
                                <div key={brand} className="checkbox-filter">
                                    <input 
                                        id={brand}
                                        value={brand}
                                        name="brand"
                                        type="checkbox"
                                        onChange={(e) => handleCheckboxFilter(e, setBrandFilter)}
                                    />
                                    <label htmlFor={brand}>{brand}</label>
                                </div>
                            ))}
                        </div>

                        <div className="type-filter filter">
                            <p><strong>Type</strong></p>
                            {productType && productType.map((type) => (
                                <div key={type} className="checkbox-filter">
                                    <input 
                                        id={type}
                                        value={type}
                                        name="type"
                                        type="checkbox"
                                        onChange={(e) => handleCheckboxFilter(e, setTypeFilter)}
                                    />
                                    <label htmlFor={type}>{type}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="ecomm-product">
                        <ul className="ecomm-product-item">
                            {filteredData ? (
                                <>
                                    {filteredData.map((product) => (
                                        <li key={product.name} 
                                            onClick={() => setProductClick(product)}
                                        >
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
                                    ))}
                                </>
                            ) : (
                                <div className="ecomm-product-not-available">
                                    <p><strong>{currCategory} Not Available. Please Try Again Later.</strong></p>
                                </div>
                            )}
                        </ul>

                        <Modal isOpen={(productClick !== null)} onClose={() => setProductClick(null)}>
                            {/* IMPLEMENT MODAL INFO HERE WITH CART */}
                            {productClick && (
                                <div className="product-modal">
                                    <img src={`/ecomm_photo/${productClick.name.toLowerCase().replace(/ +/g, "")}.jpg`} alt={productClick.name} />
                                    <h2>
                                        {productClick.name}
                                        <FontAwesomeIcon 
                                            icon={faCartArrowDown}
                                            id="product-modal-icon"
                                            onClick={() => handleAddCart(productClick)}
                                        />
                                    </h2>
                                    <Modal isOpen={isCartAdded} onClose={() => setIsCartAdded(false)}>
                                        <h3 className="success-message">{productClick.name} Has Been Added to the Cart!</h3>
                                    </Modal>
                                    <h4 className="ecomm-product-price">
                                        <strong>${productClick.price}</strong>&nbsp;
                                        {currCategory === 'Electronics' &&
                                            <span className="ecomm-product-ehf">Plus $0.45 EHF</span>
                                        }
                                    </h4>
                                    <h4>Brand: <strong>{productClick.brand}</strong></h4>
                                    <h4>SKU: <strong>{productClick.SKU}</strong></h4>
                                    <p>{productClick.description}</p>
                                </div>
                            )}
                        </Modal>
                    </div>
                </div>
            }

            {isCartOpen &&
                <div className="ecomm-cart-body">
                    {cartProducts.length > 0 ? (
                        <div>
                            <div className="ecomm-cart">
                                {cartProducts
                                    .filter((item) => item.SKU && item.SKU.trim() !== "")
                                    .map((item) => (
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
                                                <h3>Total: ${(item.quantity * item.price).toFixed(2)}</h3>
                                            </div>
                                            <FontAwesomeIcon 
                                                icon={faTrash} 
                                                className="ecomm-remove-product"
                                                onClick={() => handleRemoveProduct(item.SKU)}
                                            />
                                        </div>
                                ))}
                            </div>

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
                        </div>
                    ) : (
                        <p>
                            <strong>Your Cart is Empty!</strong>
                        </p>
                    )}
                </div>
            }
        </div>
    );
}

export default Ecomm;