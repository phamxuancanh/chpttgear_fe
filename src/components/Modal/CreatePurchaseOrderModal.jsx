import { useState, useEffect, useMemo } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { debounce } from "lodash";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { createStockIn, getAllProduct, increaseQuantity } from "../../routers/ApiRoutes";
import Loading from "../../utils/Loading";
import { addProductsToInventory, upadteSelectedInventoryQuantity, updateQuantityByInventory, updateStockIn } from "../../redux/inventorySlice";
import { useDispatch } from "react-redux";

export default function CreatePurchaseOrderModal({ setShowCreateOrder, inventory }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [prices, setPrices] = useState({});
    const [products, setProducts] = useState([]);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const dispatch = useDispatch()


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading1(true)
                const res1 = await getAllProduct();
                console.log(res1.data)
                setProducts(res1.data)
                setLoading1(false)

            } catch (error) {
                console.error("Error fetching inventory:", error);
            } finally {
                setLoading1(false)
            }
        };
        fetchData();
    }, []);

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedProducts(filteredProducts.map(p => p.id));

        } else {
            setSelectedProducts([]);
        }
    };

    const handleSelectProduct = (id) => {
        console.log(id);
        setSelectedProducts(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(selectedId => selectedId !== id) // Loại bỏ id đã chọn
                : [...prevSelected, id] // Thêm id nếu chưa có
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
        setLoading2(true)
        if (selectedProducts.length === 0) {
            alert("Hãy chọn ít nhất một sản phẩm");
            return;
        }


        let productList = []
        for (let product_id of selectedProducts) {
            try {
                const quantity = quantities[product_id] || 0;
                const price = prices[product_id] ?? products.find(p => p.id === product_id)?.price ?? 0; // Đảm bảo có giá trị

                if (quantity <= 0) {
                    toast.error(`Hãy nhập số lượng sản phẩm `);
                    return;
                }
                if (price <= 0) {
                    toast.error(`Hãy nhập giá cho sản phẩm`);
                    return;
                }

                const stockInRes = await createStockIn({
                    product_id: product_id,
                    quantity: quantity,
                    price: price,
                    inventory_id: inventory?.inventory_id
                });
                const product = products.find(p => p.id === product_id);
                console.log(product)
                if (product) {
                    productList.push(product);
                }

                dispatch(updateStockIn(stockInRes.data));
                // Gọi API increase quantity
                const increaseQuantityRes = await increaseQuantity(inventory?.inventory_id, quantity)

                dispatch(updateQuantityByInventory({
                    inventory_id: inventory?.inventory_id,
                    quantity: quantity
                }));
                dispatch(upadteSelectedInventoryQuantity(quantity));

                setLoading2(false)
            } catch (error) {

                toast.error("Có lỗi xảy ra khi tạo đơn nhập hàng");
                return; // Dừng hàm nếu có lỗi xảy ra trong vòng lặp
            } finally {
                setLoading2(false)
            }
        }
        console.log(productList)
        dispatch(addProductsToInventory({ products: productList }));
        setShowCreateOrder(false);
        toast.success("Tạo đơn nhập hàng thành công");
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            {loading1 && <Loading />}
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Tạo đơn nhập hàng</h2>
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
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            aria-label="Tìm kiếm sản phẩm"
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
                                    {selectedProducts.length} lựa chọn
                                </span>
                                {selectedProducts.length > 0 && (
                                    <button
                                        onClick={clearSelection}
                                        className="text-sm text-red-600 hover:text-red-700"
                                        aria-label="Clear selection"
                                    >
                                        Xóa
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="max-h-[40vh] overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">Đang tải...</div>
                            ) : error ? (
                                <div className="p-8 text-center text-red-500">{error}</div>
                            ) : products.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">Không tìm thấy sản phẩm</div>
                            ) : (
                                <div>
                                    {filteredProducts.map((product) => (
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
                                                src={product.image.split(',')[0]}
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
                                                    defaultValue={product.price}
                                                    onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                                    className="w-28 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        {loading2 ? ` Đang tạo đơn hàng (${selectedProducts.length} sản phẩm) ...` : ` Tạo đơn hàng (${selectedProducts.length} sản phẩm)`}
                    </button>
                </div>
            </div>
        </div>
    );
}
