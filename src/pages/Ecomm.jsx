import React, { useEffect, useState, useCallback } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, updateDoc, increment, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import '../stylesheets/ecomm.css';
import { useDebounce } from "../hooks/useDebounce";
import { ecommProductFilters } from "../utils/filters";
import { v4 as uuidv4 } from 'uuid';
import CartFinalTotals from "../components/CartFinalTotal";
import CartProduct from "../components/CartProduct";
import SortSelector from "../components/SortSelector";
import SearchBar from "../components/SearchBar";
import CartButton from "../components/CartButton";
import CheckboxFilter from "../components/CheckboxFilter";
import ProductList from "../components/ProductList";
import ProductModal from "../components/ProductModal";

function Ecomm() {
    // Current User UID
    const userId = auth.currentUser ? auth.currentUser.uid : (localStorage.getItem('guestId') || `guests-${uuidv4()}`);
    // Save the guest ID to localStorage for future sessions
    if (!auth.currentUser && !localStorage.getItem('guestId')) {
        localStorage.setItem('guestId', userId);
    }

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
    const sortOptionList = [
        { title: 'Price Low to High', value: 'low-to-high' },
        { title: 'Price High to Low', value: 'high-to-low' }
    ]
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
                setCartTotals({ subtotal: subTotal, tax: tax, total: total });
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
        if (userId.includes('guests')) {
            const cartCollectionRef = collection(db, `users/${userId}/cart`);
            const cartSnapshot = await getDocs(cartCollectionRef);

            // Remove all products from the cart
            const deletePromises = cartSnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises); // Wait for all deletes to finish
            console.log("Cart cleared on exit!");
        }
    }, [userId]);
    // Handling Guest's Cart to expire after 1 hour
    useEffect(() => {
        const handleUnload = () => {
            // Only for guests: store clear cart flag and timestamp
            if (userId.includes('guests')) {
                localStorage.setItem('clearCart', 'true');
                localStorage.setItem('clearCartTimestamp', Date.now());
            }
        };
        window.addEventListener('beforeunload', handleUnload);
    
        // Check if the user is returning within a few minutes
        const clearCartFlag = localStorage.getItem('clearCart');
        const clearCartTimestamp = localStorage.getItem('clearCartTimestamp');
        const currentTime = Date.now();

        if (clearCartFlag === 'true' && clearCartTimestamp) {
            const timeElapsed = currentTime - parseInt(clearCartTimestamp, 10);
            const timeLimit = 60 * 60 * 1000; // 1 Hour 
            console.log(timeElapsed, timeLimit, clearCartTimestamp)
            if (timeElapsed > timeLimit) {
                // If more than timeLimit have passed, reset the flag
                clearCartOnExit();
                localStorage.removeItem('clearCart');
                localStorage.removeItem('clearCartTimestamp');
            }
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
                        <SortSelector initialOption={sortOption} optionList={sortOptionList} setSortOption={setSortOption} />
                        <SearchBar searchFilter={searchFilter} setSearchFilter={setSearchFilter} />
                        <CartButton handleCartClick={handleCartClick} />
                    </div>
                }
            </div>

            {!isCartOpen && 
                <div className="ecomm-body">
                    <div className="ecomm-filter">
                        <CheckboxFilter 
                            title="Price" 
                            filterOptions={categoryPriceRange?.[currCategory]}
                            filterName="price"
                            handleCheckboxFilter={(e) => handleCheckboxFilter(e, setPriceFilter)}
                        />
                        
                        <CheckboxFilter
                            title="Brand" 
                            filterOptions={productBrand}
                            filterName="brand"
                            handleCheckboxFilter={(e) => handleCheckboxFilter(e, setBrandFilter)}
                        />

                        <CheckboxFilter
                            title="Type" 
                            filterOptions={productType}
                            filterName="type"
                            handleCheckboxFilter={(e) => handleCheckboxFilter(e, setTypeFilter)}
                        />
                    </div>

                    <div className="ecomm-product">
                        <ProductList
                            filteredData={filteredData}
                            setProductClick={setProductClick}
                            currCategory={currCategory}
                        />

                        {productClick && (
                            <ProductModal 
                                product={productClick} 
                                currCategory={currCategory} 
                                handleAddCart={handleAddCart} 
                                setProductClick={setProductClick} 
                                isCartAdded={isCartAdded} 
                                setIsCartAdded={setIsCartAdded} 
                            />
                        )}
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
                                        <CartProduct
                                            key={item.SKU}
                                            item={item}
                                            handleQtyChange={handleQtyChange}
                                            handleRemoveProduct={handleRemoveProduct}
                                        />
                                ))}
                            </div>
                            
                            <CartFinalTotals cartTotals={cartTotals} />
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