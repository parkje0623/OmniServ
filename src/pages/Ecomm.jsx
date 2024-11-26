import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown, faCartPlus, faSearch } from '@fortawesome/fontawesome-free-solid';
import '../stylesheets/ecomm.css';
import Modal from "../components/Modal";

function Ecomm() {
    // Fixed Categories and its Components
    const categorySelection = ["Electronics", "Clothings"];
    const categoryPriceRange = {
        "Electronics": ['Less Than $200', '$200 - $499.99', '$500 - $999.99', '$1000 & Up'],
        "Clothings": ['Less Than $50', '$50 - $99.99', '$100 - $149.99', '$150 & Up'],
    };

    // Variables that may change
    const [currCategory, setCurrCategory] = useState("Electronics");
    const [productData, setProductData] = useState({});
    const [productClick, setProductClick] = useState(null);
    const [isProductOpen, setIsProductOpen] = useState(false);
    const [error, setError] = useState();

    // Variables for Filters
    const [filteredData, setFilteredData] = useState([]);
    const [sortOption, setSortOption] = useState("low-to-high");
    const [searchFilter, setSearchFilter] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");
    const [priceFilter, setPriceFilter] = useState([]);
    const [productType, setProductType] = useState([]);
    const [typeFilter, setTypeFilter] = useState([]);
    const [productBrand, setProductBrand] = useState([]);
    const [brandFilter, setBrandFilter] = useState([]);

    // Variables for Cart
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Parsing Price Range
    const parsePriceRange = (range) => {
        if (range.includes('Less Than')) {
            const max = parseFloat(range.match(/\d+/)[0]);
            return { min: 0, max };
        } else if (range.includes('& Up')) {
            const min = parseFloat(range.match(/\d+/)[0]);
            return { min, max: Infinity };
        } else {
            const [min, max] = range.split('-').map((str) => parseFloat(str.replace(/[^\d.]/g, '')));
            return { min, max };
        }
    };
    // Handling Price Filter Checkbox onChange
    const handlePriceFilter = (e) => {
        if (e.target.checked) {
            setPriceFilter((prevPrices) => [...prevPrices, e.target.value]);
        } else {
            setPriceFilter((prevPrices) => prevPrices.filter((b) => b !== e.target.value));
        }
    };
    // Handling Brand Filter Checkbox onChange
    const handleBrandFilter = (e) => {
        if (e.target.checked) {
            setBrandFilter((prevBrands) => [...prevBrands, e.target.value]);
        } else {
            setBrandFilter((prevBrands) => prevBrands.filter((b) => b !== e.target.value));
        }
    };
    // Handling Type Filter Checkbox onChange
    const handleTypeFilter = (e) => {
        if (e.target.checked) {
            setTypeFilter((prevTypes) => [...prevTypes, e.target.value]);
        } else {
            setTypeFilter((prevTypes) => prevTypes.filter((b) => b !== e.target.value));
        }
    };

    // Handling Closing Move Details
    const handleCloseProduct = () => {
        setIsProductOpen(false);
        setProductClick(null);
    };

    // Handling Add Product to Cart
    const handleAddCart = (product) => {
        
    };
    // Handling Cart onClick
    const handleCartClick = () => {
        setIsCartOpen(true);
        setCurrCategory("");

        try {
            console.log("Fetch Cart Data");
        } catch (error) {
            console.error("Error Fetching User's Cart: ", error);
            setError(error);
        }
    };

    // Debounced Search Term - To not search too oftern (while user is still typing)
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedTerm(searchFilter), 100);
        return () => clearTimeout(handler); // Clear debounce timeout
    }, [searchFilter]);

    // Apply Other Filters
    useEffect(() => {
        let filtered = Object.values(productData).flat();
        
        // Apply Search Here
        if (debouncedTerm) {
            filtered = filtered.filter((product) => 
                product.name.toLowerCase().includes(debouncedTerm.toLowerCase())
            );
        }

        // Combine products across all categories for sorting (low-to-high or high-to-low)
        filtered.sort((a, b) => {
            if (sortOption === "low-to-high") {
                return a.price - b.price;
            } else if (sortOption === "high-to-low") {
                return b.price - a.price;
            }
            return 0;
        });

        // Apply Price Filter Here
        if (priceFilter.length > 0) {
            const parsedRanges = priceFilter.map((range) => parsePriceRange(range));
            filtered = filtered.filter((product) =>
                parsedRanges.some(({ min, max }) => product.price >= min && product.price <= max)
            );
        }
        // Apply Brand Filter Here
        if (brandFilter.length > 0) {
            filtered = filtered.filter((product) => brandFilter.includes(product.brand));
        }
        // Apply Type Filter Here
        if (typeFilter.length > 0) {
            filtered = filtered.filter((product) => typeFilter.includes(product.type));
        }

        setFilteredData(filtered);
    }, [productData, debouncedTerm, sortOption, priceFilter, brandFilter, typeFilter]);

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
                setError("Products Cannot be Retrived, Please Try Again later.");
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
                                            onChange={(e) => handlePriceFilter(e)}
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
                                        onChange={(e) => handleBrandFilter(e)}
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
                                        onChange={(e) => handleTypeFilter(e)}
                                    />
                                    <label htmlFor={type}>{type}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="ecomm-product">
                        <ul className="ecomm-product-item">
                            {filteredData.length > 0 ? (
                                <>
                                    {filteredData.map((product) => (
                                        <li key={product.name} 
                                            onClick={() => {
                                                setProductClick(product);
                                                setIsProductOpen(true); 
                                            }}
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

                        <Modal isOpen={isProductOpen} onClose={handleCloseProduct}>
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
                    ECOMM CART UNDER DEVELOPMENT
                </div>
            }
        </div>
    );
}

export default Ecomm;