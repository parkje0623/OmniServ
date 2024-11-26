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

// Handling Ecomm Product Filters
export const ecommProductFilters = (products, { searchTerm, priceRanges, brandFilter, typeFilter, sortOption }) => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
        filtered = filtered.filter((product) => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Sort filter
    filtered.sort((a, b) => (sortOption === "low-to-high" ? a.price - b.price : b.price - a.price));

    // Price filter
    if (priceRanges.length > 0) {
        const parsedRanges = priceRanges.map(parsePriceRange);
        filtered = filtered.filter((product) =>
            parsedRanges.some(({ min, max }) => product.price >= min && product.price <= max)
        );
    }

    // Brand filter
    if (brandFilter.length > 0) {
        filtered = filtered.filter((product) => brandFilter.includes(product.brand));
    }

    // Type filter
    if (typeFilter.length > 0) {
        filtered = filtered.filter((product) => typeFilter.includes(product.type));
    }

    return filtered;
};