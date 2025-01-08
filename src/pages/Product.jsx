import React, { useState, useEffect } from "react";
import { FiSearch, FiSliders, FiStar, FiShoppingCart, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from './../components/ProductCard';
import { Link } from "react-router-dom";

export default function Product() {

    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState(1000);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const productsPerPage = 6;

    const categories = [
        "Graphics Cards",
        "Processors",
        "Motherboards",
        "RAM",
        "Storage",
        "Power Supply",
    ];

    const dummyProducts = [
        {
            id: 1,
            name: "RTX 4090 Graphics Card",
            price: 1499.99,
            rating: 4.8,
            reviews: 245,
            image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
            category: "Graphics Cards",
        },
        {
            id: 2,
            name: "Intel i9 13900K Processor",
            price: 599.99,
            rating: 4.9,
            reviews: 189,
            image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea",
            category: "Processors",
        },
        {
            id: 3,
            name: "ROG STRIX Z790-E Gaming Motherboard",
            price: 499.99,
            rating: 4.7,
            reviews: 156,
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
            category: "Motherboards",
        },
        {
            id: 4,
            name: "Corsair Vengeance 32GB RAM",
            price: 129.99,
            rating: 4.6,
            reviews: 320,
            image: "https://images.unsplash.com/photo-1562976540-1502c2145186",
            category: "RAM",
        },
        {
            id: 5,
            name: "Samsung 2TB NVMe SSD",
            price: 199.99,
            rating: 4.9,
            reviews: 427,
            image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b",
            category: "Storage",
        },
        {
            id: 6,
            name: "Seasonic 850W Power Supply",
            price: 149.99,
            rating: 4.8,
            reviews: 265,
            image: "https://images.unsplash.com/photo-1587202372555-e229f172b9d7",
            category: "Power Supply",
        },
        {
            id: 7,
            name: "RTX 4080 Graphics Card",
            price: 1199.99,
            rating: 4.7,
            reviews: 178,
            image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
            category: "Graphics Cards",
        },
        {
            id: 8,
            name: "AMD Ryzen 9 7950X",
            price: 699.99,
            rating: 4.8,
            reviews: 234,
            image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea",
            category: "Processors",
        },
        {
            id: 9,
            name: "MSI MPG B550 Motherboard",
            price: 189.99,
            rating: 4.5,
            reviews: 145,
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
            category: "Motherboards",
        },
        {
            id: 10,
            name: "G.Skill Trident Z5 RGB 64GB",
            price: 299.99,
            rating: 4.9,
            reviews: 89,
            image: "https://images.unsplash.com/photo-1562976540-1502c2145186",
            category: "RAM",
        },
        {
            id: 11,
            name: "WD Black 4TB NVMe SSD",
            price: 399.99,
            rating: 4.8,
            reviews: 156,
            image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b",
            category: "Storage",
        },
        {
            id: 12,
            name: "Corsair 1000W Power Supply",
            price: 229.99,
            rating: 4.7,
            reviews: 198,
            image: "https://images.unsplash.com/photo-1587202372555-e229f172b9d7",
            category: "Power Supply",
        }
    ];

    useEffect(() => {
        let filtered = [...dummyProducts];

        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product =>
                selectedCategories.includes(product.category)
            );
        }

        filtered = filtered.filter(product => product.price <= priceRange);

        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [searchQuery, selectedCategories, priceRange]);

    const handleCategoryToggle = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };



    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search computer components..."
                            className="w-full py-3 px-4 pr-12 rounded-lg bg-card text-foreground border border-input focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <button className="bg-gray-500 text-white  px-6 py-3 rounded-lg hover:bg-accent transition-colors duration-300">
                        Search
                    </button>
                </div>

                <div className="flex gap-8">
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-card p-4 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <FiSliders className="text-accent" />
                                <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-foreground font-medium mb-3">Categories</h3>
                                {categories.map((category) => (
                                    <label
                                        key={category}
                                        className="flex items-center gap-2 mb-2 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryToggle(category)}
                                            className="rounded border-input text-primary focus:ring-ring"
                                        />
                                        <span className="text-foreground">{category}</span>
                                    </label>
                                ))}
                            </div>

                            <div>
                                <h3 className="text-foreground font-medium mb-3">Price Range</h3>
                                <input
                                    type="range"
                                    min="0"
                                    max="2000"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className="w-full accent-primary"
                                />
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>$0</span>
                                    <span>${priceRange}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-foreground mb-6">Products</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                                {currentProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center items-center mt-8 gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-md   disabled:opacity-50"
                                    >
                                        <FiChevronLeft />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-4 py-2 rounded-md ${currentPage === page
                                                ? " "
                                                : "bg-card text-foreground hover:bg-accent"}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-md   disabled:opacity-50"
                                    >
                                        <FiChevronRight />
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
