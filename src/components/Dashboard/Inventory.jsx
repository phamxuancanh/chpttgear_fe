import React, { useEffect, useState } from "react";
import { FaPlus, FaEye, FaSearch, FaTimes } from "react-icons/fa";
import { DateConverter } from "../../utils/DateConverter";
import { MdWarehouse } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import { getAllInventory, getAllProduct, getProductsByInventoryId, getProductsByListId, getStockInByInventoryId, getStockOutByInventoryId } from "../../routers/ApiRoutes";
import CreatePurchaseOrderModal from './../Modal/CreatePurchaseOrderModal';
import { toast } from "react-toastify";
import AddInventoryModal from "../Modal/AddInventoryModal";
import { FaDongSign } from "react-icons/fa6";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAllInventory, setAllProductsInInventory, setSelectedInventory, setStockInsInInventory, setStockOutsInInventory } from "../../redux/inventorySlice";

export default function Inventory() {

    const [isOpen, setIsOpen] = useState(false);
    const [productInInventory, setProductInInventory] = useState([])
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateOrder, setShowCreateOrder] = useState(false);
    const [showCreateInventory, setShowCreateInventory] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const allInventoryInRedux = useSelector(state => state.inventory.inventories)
    const allProductsInInventoryInRedux = useSelector(state => state.inventory.productsInInventory)
    const stockInsInInventory = useSelector(state => state.inventory.stockIns)
    const stockOutsInInventory = useSelector(state => state.inventory.stockOuts)
    const selectedInventory = useSelector(state => state.inventory.selectedInventory)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchData = async () => {
            try {

                const res = await getAllInventory();
                dispatch(setAllInventory(res.data))

            } catch (error) {
                console.error("Error fetching inventory:", error);
            }
        };
        fetchData();
    }, []);

    const handleChangeInventory = async (inventory) => {
        dispatch(setSelectedInventory(inventory));
        setIsOpen(false);

        const [res, res1, res2] = await Promise.all([
            getProductsByInventoryId(inventory?.inventory_id),
            getStockInByInventoryId(inventory?.inventory_id),
            getStockOutByInventoryId(inventory?.inventory_id)
        ]);

        const queryString = res.join(",");
        const res3 = await getProductsByListId(queryString)

        dispatch(setAllProductsInInventory(res3.data || []))
        dispatch(setStockInsInInventory(res1 || []))
        dispatch(setStockOutsInInventory(res2 || []))


    };

    const filteredProducts = allProductsInInventoryInRedux.filter(
        (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Tính toán số trang
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Lấy sản phẩm của trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const handleCreateOrder = async () => {
        if (selectedInventory == null) {
            toast.error("Hãy chọn kho để nhập hàng")
            return
        }
        setShowCreateOrder(true);
    };


    const handleInventory = () => {

        setShowCreateInventory(true);
    };

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setShowDetails(true);
    };

    const getProductStock = (productId) => {
        const stockIn = stockInsInInventory
            .filter(item => item.product_id === productId)
            .reduce((acc, item) => acc + item.quantity, 0);

        const stockOut = stockOutsInInventory
            .filter(item => item.product_id === productId)
            .reduce((acc, item) => acc + item.quantity, 0);

        return stockIn - stockOut;
    };

    const getProductCost = (productId) => {
        const productStockIns = stockInsInInventory.filter(item => item.product_id === productId);

        const totalCost = productStockIns.reduce((acc, item) => acc + (item.quantity * item.price), 0);
        const totalQuantity = productStockIns.reduce((acc, item) => acc + item.quantity, 0);
        console.log(productStockIns)
        console.log(totalCost)
        return totalQuantity > 0 ? (totalCost / totalQuantity).toFixed(2) : 0;
    };


    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 mt-3">Quản lý kho</h1>
                    <div>
                        <button
                            onClick={() => handleInventory()}
                            className="text-gray-50 hover:text-indigo-900 mr-4 bg-green-500 p-3 rounded-lg"
                        >
                            <FaPlus className="inline mr-1" /> Tạo kho
                        </button>
                        <button
                            onClick={() => handleCreateOrder()}
                            className="text-gray-50 hover:text-indigo-900 mr-4 bg-green-500 p-3 rounded-lg"
                        >
                            <FaPlus className="inline mr-1" /> Nhập hàng mới
                        </button>
                    </div>

                </div>
                <div className="mb-6 flex items-center bg-white rounded-lg p-3 shadow-sm">
                    <FaSearch className="text-gray-400 mr-3" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm bằng tên"
                        className="flex-1 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="mb-8">
                    <label className="block text-lg font-semibold mb-2">Chọn Kho</label>
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full p-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex justify-between items-center"
                        >
                            <span className="flex items-center">
                                {selectedInventory ? (
                                    <>
                                        <MdWarehouse className="mr-2 text-blue-600" />
                                        Tên kho: {selectedInventory.name} - Địa chỉ: {selectedInventory.address.split('|')[0].trim()} - Tồn kho: {selectedInventory.quantity_in_stock}
                                    </>
                                ) : (
                                    "Chọn kho..."
                                )}
                            </span>
                            <FiChevronDown className={`transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
                        </button>
                        {isOpen && (
                            <div className="absolute w-full mt-1 max-h-48 overflow-y-auto bg-white border rounded-lg shadow-lg z-10">
                                {allInventoryInRedux.map((inventory) => (
                                    <button
                                        key={inventory.inventory_id}
                                        className={`w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center ${selectedInventory?.inventory_id === inventory.inventory_id ? "bg-blue-100" : ""
                                            }`}
                                        onClick={() => {
                                            handleChangeInventory(inventory)
                                        }}
                                    >
                                        <MdWarehouse className="mr-2 text-blue-600" />
                                        Tên kho: {inventory.name} - Địa chỉ: {inventory.address.split('|')[0].trim()} - Tồn kho: {inventory.quantity_in_stock}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {filteredProducts.length > 0 ? <div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr className="text-center">
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Hình ảnh</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-5/12">Tên sản phẩm</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Giá nhập</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Tồn kho</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center text-center">
                                                <img className="h-16 w-16 rounded-lg object-cover" src={product.image.split(',')[0]} alt={product.name} />
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="text-sm font-medium text-gray-900 break-words max-w-[300px] mx-auto">
                                                {product.name}
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-sm text-gray-500 text-center">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getProductCost(product.id))}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-gray-500 text-center">
                                            {getProductStock(product.id)}
                                        </td>

                                        <td className="px-4 py-4 ">
                                            <button
                                                onClick={() => handleViewDetails(product)}
                                                className="text-green-600 hover:text-green-900 flex items-center justify-center"
                                            >
                                                <FaEye className="inline mr-1" /> Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Phân trang */}
                        <div className="flex justify-center mt-4 space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 border rounded ${currentPage === 1 ? "text-gray-400 border-gray-300" : "text-blue-600 border-blue-500 hover:bg-blue-50"}`}
                            >
                                Trước
                            </button>

                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "text-blue-600 border-blue-500 hover:bg-blue-50"}`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 border rounded ${currentPage === totalPages ? "text-gray-400 border-gray-300" : "text-blue-600 border-blue-500 hover:bg-blue-50"}`}
                            >
                                Sau
                            </button>
                        </div>
                    </div> :
                        <div className="w-full flex justify-center items-center py-4 ">
                            <span className="font-normal text-lg">{"Không có sản phẩm trong kho"}</span>
                        </div>
                    }

                </div>

                {showCreateOrder && (
                    <CreatePurchaseOrderModal setShowCreateOrder={setShowCreateOrder} inventory={selectedInventory} />
                )}

                {showCreateInventory && (
                    <AddInventoryModal setShowCreateInventory={setShowCreateInventory} />
                )}

                {showDetails && selectedProduct && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
                            <div className="flex justify-between items-center mb-6">
                                <button onClick={() => setShowDetails(false)} className="text-gray-500 hover:text-gray-700">
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="mb-6">
                                <img
                                    src={selectedProduct.image.split(',')[0]}
                                    alt={selectedProduct.name}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-xl font-bold mb-2">{selectedProduct.name}</h3>
                                <div className="flex justify-start">
                                    <p className="text-gray-600 mb-4 font-bold">Giá hiện tại: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getProductCost(selectedProduct.id))}</p>
                                    <FaDongSign className="ml-1" />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold mb-3">Lịch sử nhập hàng</h4>
                                <div className="overflow-x-auto overflow-y-auto max-h-[30vh]"> {/* Added max height for vertical scrolling */}
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {stockInsInInventory?.filter(stock_in => stock_in.product_id === selectedProduct.id).length > 0 ? (
                                                stockInsInInventory
                                                    .filter(stock_in => stock_in.product_id === selectedProduct.id)
                                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                                    .map((stock_in, index) => (
                                                        <tr key={index} className="hover:bg-gray-100">
                                                            <td className="px-6 py-4 text-sm text-gray-900">{DateConverter(stock_in.createdAt)}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">{stock_in.quantity}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-900 flex justify-start"> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stock_in.price)} </td>
                                                        </tr>
                                                    ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                                        Không có dữ liệu ...
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>

                                    </table>

                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

