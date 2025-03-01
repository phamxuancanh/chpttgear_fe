import React, { useState, useEffect } from "react";
import { FiSearch, FiEye, FiShoppingBag, FiCalendar, FiTruck, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getOrdersByUserId } from "../routers/ApiRoutes";
import { useSelector } from "react-redux";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Order() {

    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userFromRedux = useSelector((state => state.auth.user));
    const [page, setPage] = useState(1);
    const [limit] = useState(5); // Số lượng đơn hàng mỗi trang
    const [totalPages, setTotalPages] = useState(1);
    const [expandedOrders, setExpandedOrders] = useState({});
    const userId = userFromRedux.id;

    const toggleExpand = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    useEffect(() => {
        fetchOrder(page);
    }, [page]); // Gọi API khi `page` thay đổi

    const fetchOrder = async (pageNumber) => {
        try {
            const res = await getOrdersByUserId(userId, pageNumber, limit);
            const data = res.data;
            console.log(data);
            setOrders(data.orders);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng:", error);
        }
    };

    // Lọc và sắp xếp đơn hàng theo ngày tạo mới nhất
    const filteredOrders = orders
        ?.filter((order) => {
            const orderId = order?.order_id ? order.order_id.toLowerCase() : "";
            const status = order?.status ? order.status.toLowerCase() : "";
            return (
                orderId.includes(searchQuery.toLowerCase()) ||
                status.includes(searchQuery.toLowerCase())
            );
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "CANCEL":
                return "bg-emerald-100 text-emerald-800";
            case "PENDING":
                return "bg-amber-100 text-amber-800";
            case "PAID":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-slate-100 text-slate-800";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tất cả đơn hàng</h1>
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="grid gap-6 p-6">
                        {Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => {

                                return (
                                    <div
                                        key={order.order_id}
                                        className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white hover:scale-[1.01]"
                                    >
                                        {/* Header Order */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 bg-indigo-50 rounded-lg">
                                                    <FiShoppingBag className="text-indigo-600 text-xl" />
                                                </div>
                                                <div className="flex ">
                                                    <h3 className="font-semibold text-gray-900 text-lg mx-2">
                                                        Đơn hàng #{order.order_id}
                                                    </h3>
                                                    <span
                                                        className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)} shadow-sm`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Date & Delivery Date */}
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                                                <FiCalendar className="text-gray-500" />
                                                <span className="text-sm text-gray-600">
                                                    Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                                                <FiTruck className="text-gray-500" />
                                                <span className="text-sm text-gray-600">
                                                    Ngày giao: {new Date(order.updatedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Danh sách sản phẩm */}
                                        <div className="mt-4 py-2">
                                            {Array.isArray(order.order_item) && order.order_item.length > 0 ? (
                                                <div key={order.order_id} className="bg-white shadow-md rounded-lg p-4">
                                                    {/* Sản phẩm đầu tiên */}
                                                    <div className="flex items-center space-x-4 p-4 border-b">
                                                        <img
                                                            src={order.order_item[0]?.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770"}
                                                            alt={`Product ${order.order_item[0]?.product_id}`}
                                                            className="w-24 h-24 object-cover rounded-lg shadow-sm"
                                                            onError={(e) => {
                                                                e.target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770";
                                                            }}
                                                        />
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">{order.order_item[0]?.name || "Sản phẩm"}</h3>
                                                            <p className="text-gray-600 font-medium">${order.order_item[0]?.price}</p>
                                                        </div>
                                                    </div>

                                                    {/* Xem thêm sản phẩm */}
                                                    {order.order_item.length > 1 && (
                                                        <div>
                                                            {expandedOrders[order.order_id] && (
                                                                <div className="mt-4 space-y-4">
                                                                    {order.order_item.slice(1).map((item) => (
                                                                        <div key={item.order_item_id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                                                                            <img
                                                                                src={item.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770"}
                                                                                alt={`Product ${item.product_id}`}
                                                                                className="w-20 h-20 object-cover rounded-lg shadow-sm"
                                                                                onError={(e) => {
                                                                                    e.target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770";
                                                                                }}
                                                                            />
                                                                            <div>
                                                                                <h3 className="text-md font-medium text-gray-900">{item.name || "Sản phẩm"}</h3>
                                                                                <p className="text-gray-600 font-medium">${item.price}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {/* Nút Xem Thêm */}
                                                            <div className="flex justify-center mt-4">
                                                                <button
                                                                    onClick={() => toggleExpand(order.order_id)}
                                                                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition"
                                                                >
                                                                    <span className="font-medium">
                                                                        {expandedOrders[order.order_id] ? "Ẩn bớt" : `Xem thêm (${order.order_item.length - 1} sản phẩm)`}
                                                                    </span>
                                                                    {expandedOrders[order.order_id] ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">Không có sản phẩm nào</p>
                                            )}
                                        </div>

                                        {/* Thành tiền */}
                                        <div className="mt-6 p-4 bg-gray-100 rounded-xl flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-800">Thành tiền:</span>
                                            <span className="text-xl font-bold text-indigo-600">${order.total_amount}</span>
                                        </div>

                                        {/* Nút View Details */}
                                        <div className="flex justify-end mt-4">
                                            <Link to={`/order_tracking/${order.order_id}`}>
                                                <button
                                                    className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-10 py-5 rounded-lg transition-colors duration-200 shadow-md"
                                                >
                                                    <FiEye />
                                                    <span>Xem chi tiết</span>
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-center">Không có đơn hàng nào.</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-5">
                <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-300" : "bg-indigo-500 text-white"}`}
                >
                    Trang trước
                </button>
                <span>{`Trang ${page} / ${totalPages}`}</span>
                <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded ${page === totalPages ? "bg-gray-300" : "bg-indigo-500 text-white"}`}
                >
                    Trang sau
                </button>

            </div>
        </div>

    );
};

