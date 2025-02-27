import React, { useState, useEffect } from "react";
import { FiSearch, FiSliders, FiStar, FiShoppingCart, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from './../components/ProductCard';
import { Link } from "react-router-dom";
import { getAllProduct } from "../routers/ApiRoutes";
import { FaDongSign } from "react-icons/fa6";
import BANNER1 from "../assets/banner1.webp"

export default function Product() {

    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState(1000);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [products, setProducts] = useState([])
    const [maxPrice, setMaxPrice] = useState(0)
    const productsPerPage = 6;


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res1 = await getAllProduct();

                setProducts(res1.data)
                setMaxPrice(Math.max(...res1.data.map(product => product.price)))
                setSearchQuery("")
                setPriceRange(1000)
                setSelectedCategories([])
            } catch (error) {
                console.error("Error fetching inventory:", error);
            }
        };
        fetchData();
    }, []);

    const categories = [
        "Card đồ họa",
        "Bộ vi xử lý",
        "Bo mạch chủ",
        "RAM",
        "Lưu trữ",
        "Nguồn máy tính",
    ];

    useEffect(() => {
        let filtered = [...products];

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
        <div className="min-h-screen bg-background p-6 bg-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 ">
                    <img src={BANNER1} alt="" className="rounded-lg" />
                </div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm linh kiện sản phẩm ..."
                            className="w-full py-3 px-4 pr-12 rounded-lg bg-card text-foreground border border-input focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <button className="bg-gray-500 text-white  px-6 py-3 rounded-lg hover:bg-accent transition-colors duration-300">
                        Tìm kiếm
                    </button>
                </div>

                <div className="flex gap-8">
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-card p-4 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <FiSliders className="text-accent" />
                                <h2 className="text-lg font-semibold text-foreground">Bộ lọc</h2>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-foreground font-medium mb-3">Danh mục</h3>
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
                                <h3 className="text-foreground font-medium mb-3">Khoảng giá</h3>
                                <input
                                    type="range"
                                    min="0"
                                    max={maxPrice}
                                    value={priceRange} // Giữ nguyên số, không format
                                    onChange={(e) => setPriceRange(Number(e.target.value))} // Chuyển thành số
                                    className="w-full accent-primary"
                                />
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <div className="flex justify-start">
                                        <span>0</span>
                                        < FaDongSign className="font-thin" />
                                    </div>{/* Chỉ format khi hiển thị */}
                                    <div className="flex justify-start">
                                        <span>{priceRange.toLocaleString('en-US')}</span>
                                        < FaDongSign className="font-thin" />
                                    </div>{/* Chỉ format khi hiển thị */}
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="flex-1">
                        <section className="mb-12">

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
