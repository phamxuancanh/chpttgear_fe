import { useState, useEffect, useMemo } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { debounce } from "lodash";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { createStockIn, getAllProduct, increaseQuantity } from "../../routers/ApiRoutes";

export default function CreatePurchaseOrderModal({ setShowCreateOrder, inventory }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [prices, setPrices] = useState({});
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res1 = await getAllProduct();
                console.log(res1.data)
                setProducts(res1.data)
            } catch (error) {
                console.error("Error fetching inventory:", error);
            }
        };
        fetchData();
    }, []);

    const debouncedSearch = debounce((term) => {
        setLoading(true);
        try {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(term.toLowerCase())
            );
            setProducts(filtered);
        } catch (err) {
            setError("Failed to search products");
        } finally {
            setLoading(false);
        }
    }, 200);

    useEffect(() => {
        debouncedSearch(searchTerm);
        return () => debouncedSearch.cancel();
    }, [searchTerm]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedProducts(products.map(p => p.id));
            console.log(products)
        } else {
            setSelectedProducts([]);
        }
    };

    const handleSelectProduct = (id) => {
        setSelectedProducts(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(id => id !== id)
                : [...prevSelected, id]
        );
    };

    const handleQuantityChange = (id, value) => {
        const quantity = parseInt(value) || 0;
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(0, quantity)
        }));
    };
    const handlePriceChange = (id, value) => {
        const quantity = parseInt(value) || 0;
        setPrices(prev => ({
            ...prev,
            [id]: Math.max(0, quantity)
        }));
    };

    const clearSelection = () => {
        setSelectedProducts([]);
    };

    const handleCreateOrder = async () => {
        if (selectedProducts.length === 0) {
            alert("Please select at least one product");
            return;
        }

        for (let product_id of selectedProducts) {
            try {
                const quantity = quantities[product_id] || 0; // Sử dụng giá trị mặc định là 0 nếu chưa nhập
                const price = prices[product_id] || 0;
                if (quantity <= 0) {
                    toast.error(`Please enter a quantity for product with ID ${product_id}`);
                    return;
                }
                if (price <= 0) {
                    toast.error(`Please enter a price for product with ID ${product_id}`);
                    return;
                }

                const inventory_id = "2f4593b7-654b-430c-a55c-19b37dbeb45d";

                // const stockInData = 
                // Gọi API stock-in
                const stockInRes = await createStockIn({
                    product_id: product_id,
                    quantity: quantity,
                    price: price,
                    inventory_id: inventory_id
                });
                console.log('Stock-in successful:', stockInRes.data);

                // Gọi API increase quantity
                const increaseQuantityRes = await increaseQuantity(inventory_id, quantity)
                console.log('Stock quantity increased successfully:', increaseQuantityRes.data);

            } catch (error) {
                console.error("Error while creating order:", error);
                toast.error("Có lỗi xảy ra khi tạo đơn nhập hàng");
                return; // Dừng hàm nếu có lỗi xảy ra trong vòng lặp
            }
        }

        setShowCreateOrder(false);
        toast.success("Tạo đơn nhập hàng thành công");
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Create Purchase Order</h2>
                    <button onClick={() => setShowCreateOrder(false)} className="text-gray-500 hover:text-gray-700">
                        <FaTimes />
                    </button>
                </div>
                <div className="container mx-auto px-4 py-8 max-w-4xl max-h-[70vh]">
                    <div className="relative mb-6">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            aria-label="Search products"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                aria-label="Clear search"
                            >
                                <FiX />
                            </button>
                        )}
                    </div>

                    <div className="bg-white-300 rounded-lg shadow">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <input
                                    type="checkbox"
                                    checked={selectedProducts.length === products.length}
                                    ref={input => {
                                        if (input) {
                                            input.indeterminate = selectedProducts.length > 0 && selectedProducts.length < products.length;
                                        }
                                    }}
                                    onChange={handleSelectAll}
                                    className="h-5 w-5 text-blue-600 rounded"
                                    aria-label="Select all products"
                                />
                                <span className="text-sm text-gray-600">
                                    {selectedProducts.length} selected
                                </span>
                                {selectedProducts.length > 0 && (
                                    <button
                                        onClick={clearSelection}
                                        className="text-sm text-red-600 hover:text-red-700"
                                        aria-label="Clear selection"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="max-h-[40vh] overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">Loading...</div>
                            ) : error ? (
                                <div className="p-8 text-center text-red-500">{error}</div>
                            ) : products.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No products found</div>
                            ) : (
                                <div>
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center p-4 hover:bg-gray-50 border-b border-gray-200"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(product.id)}
                                                onChange={() => handleSelectProduct(product.id)}
                                                className="h-5 w-5 text-blue-600 rounded"
                                                aria-label={`Select ${product.name}`}
                                            />
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-16 h-16 object-cover mx-4 rounded"
                                                onError={(e) => e.target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770"}
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{product.name}</h3>
                                            </div>
                                            <div className="flex items-center space-x-2 mr-4">
                                                <label htmlFor={`price-${product.id}`} className="text-sm text-gray-600">Đơn giá:</label>
                                                <input
                                                    id={`price-${product.id}`}
                                                    type="number"
                                                    min="0"
                                                    value={prices[product.id] || 0}
                                                    onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                                    className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    aria-label={`price for ${product.name}`}
                                                />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <label htmlFor={`quantity-${product.id}`} className="text-sm text-gray-600">Số lượng:</label>
                                                <input
                                                    id={`quantity-${product.id}`}
                                                    type="number"
                                                    min="0"
                                                    value={quantities[product.id] || 0}
                                                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                    className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    aria-label={`Quantity for ${product.name}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleCreateOrder}
                        disabled={selectedProducts.length === 0}
                        className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        aria-label="Create order"
                    >
                        Create Order ({selectedProducts.length} items)
                    </button>
                </div>
            </div>
        </div>
    );
}
