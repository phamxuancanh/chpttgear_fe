import React, { useState, useEffect } from "react";
import { FiSearch, FiSliders, FiStar, FiShoppingCart, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from './../components/ProductCard';
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { findAllCategory, getAllProduct, getAllProductWithCategory, getAllStockIn, getAllStockOut } from "../routers/ApiRoutes";
import { FaDongSign } from "react-icons/fa6";
import BANNER1 from "../assets/banner1.webp"
import Loading from "../utils/Loading";
import { useSelector } from "react-redux";

export default function Product() {
    const [searchParams] = useSearchParams();
    const categoryParams = searchParams.get("category");
    const categoriesFromURL = categoryParams ? categoryParams.split(",") : [];

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [products, setProducts] = useState([])
    const productsPerPage = 6;
    const location = useLocation();
    const [categories, setCategories] = useState([])
    const [maxPrice, setMaxPrice] = useState(0);
    const [priceRange, setPriceRange] = useState(0); // Đặt 0 ban đầu để tránh lỗi
    const [loading, setLoading] = useState(false)
    const stockInsInInventory = useSelector(state => state.inventory.stockIns)
    const stockOutsInInventory = useSelector(state => state.inventory.stockOuts)

    useEffect(() => {
        const updateCategories = async () => {
            if (categoriesFromURL.length > 0) {
                setLoading(true)

                await new Promise(resolve => setTimeout(resolve, 700)); // Chờ 500ms

                setSelectedCategories(categoriesFromURL);
                setLoading(false)
            } else {
                setSelectedCategories([]);
            }
        };

        updateCategories();
    }, [categoryParams]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allCategory, allProductWithCategory] = await Promise.all([
                    findAllCategory(),
                    getAllProductWithCategory(),

                ]);

                setCategories(allCategory.data);
                setProducts(allProductWithCategory.data);
                // Tìm giá lớn nhất trong danh sách sản phẩm
                const highestPrice = Math.max(...allProductWithCategory.data.map(product => product.price), 0);
                // Cập nhật maxPrice và priceRange
                setMaxPrice(highestPrice);
                setPriceRange(highestPrice); // Đặt mặc định bằng giá lớn nhất

                setSearchQuery("");
                setSelectedCategories([]);
            } catch (error) {
                console.error("Error fetching inventory:", error);
            }
        };

        fetchData();
    }, []);

    // Khi maxPrice thay đổi, cập nhật lại priceRange
    useEffect(() => {
        if (maxPrice > 0) {
            setPriceRange(maxPrice);
        }
    }, [maxPrice]);

    const getProductStock = (productId) => {
        const stockIn = stockInsInInventory
            .filter(item => item.product_id === productId)
            .reduce((acc, item) => acc + item.quantity, 0);

        const stockOut = stockOutsInInventory
            .filter(item => item.product_id === productId)
            .reduce((acc, item) => acc + item.quantity, 0);

        return stockIn - stockOut;
    };

    useEffect(() => {
        let filtered = [...products];

        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product =>
                selectedCategories.includes(product.categoryName)
            );
        }

        filtered = filtered.filter(product => product.price <= priceRange);

        // Sắp xếp theo số lượng từ lớn đến bé
        filtered.sort((a, b) => getProductStock(b.id) - getProductStock(a.id));

        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [searchQuery, selectedCategories, priceRange, products]);



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
            {loading ? <Loading /> : <div className="max-w-7xl mx-auto">
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
                                            checked={selectedCategories.includes(category.name)}
                                            onChange={() => handleCategoryToggle(category.name)}
                                            className="rounded border-input text-primary focus:ring-ring"
                                        />
                                        <span className="text-foreground">{category.name_Vi}</span>
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
                                <div className="flex justify-center mt-4 space-x-2">
                                    {/* Nút "Trước" */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 border rounded ${currentPage === 1 ? "text-gray-400 border-gray-300" : "text-blue-600 border-blue-500 hover:bg-blue-50"}`}
                                    >
                                        Trước
                                    </button>

                                    {/* Trang 1 luôn hiển thị */}
                                    <button
                                        onClick={() => setCurrentPage(1)}
                                        className={`px-3 py-1 border rounded ${currentPage === 1 ? "bg-blue-500 text-white" : "text-blue-600 border-blue-500 hover:bg-blue-50"}`}
                                    >
                                        1
                                    </button>

                                    {/* Nếu currentPage >= 4 thì hiển thị dấu "..." sau trang 1 */}
                                    {currentPage > 3 && <span className="px-2">...</span>}

                                    {/* Hiển thị các trang ở giữa */}
                                    {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                                        .filter(page => page > 1 && page < totalPages)
                                        .map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1 border rounded ${currentPage === page
                                                    ? "bg-blue-500 text-white"
                                                    : "text-blue-600 border-blue-500 hover:bg-blue-50"}`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                    {/* Nếu currentPage <= totalPages - 3 thì hiển thị dấu "..." trước trang cuối */}
                                    {currentPage < totalPages - 2 && <span className="px-2">...</span>}

                                    {/* Trang cuối luôn hiển thị nếu có nhiều trang */}
                                    {totalPages > 1 && (
                                        <button
                                            onClick={() => setCurrentPage(totalPages)}
                                            className={`px-3 py-1 border rounded ${currentPage === totalPages ? "bg-blue-500 text-white" : "text-blue-600 border-blue-500 hover:bg-blue-50"}`}
                                        >
                                            {totalPages}
                                        </button>
                                    )}

                                    {/* Nút "Sau" */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 border rounded ${currentPage === totalPages ? "text-gray-400 border-gray-300" : "text-blue-600 border-blue-500 hover:bg-blue-50"}`}
                                    >
                                        Sau
                                    </button>
                                </div>
                            )}


                        </section>
                    </div>
                </div>
            </div>}
        </div>
    );
};
