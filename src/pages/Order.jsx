import React, { useState, useEffect } from "react";
import { FiSearch, FiEye, FiShoppingBag, FiCalendar, FiTruck, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getOrdersByUserId } from "../routers/ApiRoutes";
import { useSelector } from "react-redux";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaDongSign } from "react-icons/fa6";
import Loading from "../utils/Loading";

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
    const [loading, setLoading] = useState(false);

    const toggleExpand = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    useEffect(() => {
        setLoading(true); // Bắt đầu loading
        fetchOrder(page)
            .then(() => setLoading(false)) // Hoàn tất
            .catch(() => setLoading(false)); // Xử lý lỗi
    }, [page]);

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
            {loading && <Loading />}
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
                <div className="">
                    <div className="grid gap-6 p-6">
                        {Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => {
                                return (
                                    <div
                                        key={order.order_id}
                                        className="border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 bg-white hover:scale-[1.01]"
                                    >
                                        {/* Header Order */}
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center">
                                                <div className="p-3 bg-indigo-50 rounded-lg mr-5">
                                                    <FiShoppingBag className="text-indigo-600 text-xl" />
                                                </div>
                                                <div>

                                                    <h3 className="font-semibold text-lg">Đơn hàng #{order.order_id}</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                                                    <FiCalendar className="text-gray-500" />
                                                    <span className="text-sm text-gray-600">
                                                        Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <span className={`px-3 py-1 text-center rounded-full text-sm ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>

                                            </div>
                                        </div>

                                        {/* Order Date & Delivery Date */}


                                        {/* Danh sách sản phẩm */}
                                        <div className="mt-6 space-y-6">
                                            {Array.isArray(order.order_item) && order.order_item.length > 0 ? (
                                                <div key={order.order_id} className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                                                    {/* Sản phẩm đầu tiên */}
                                                    <div className="flex items-center gap-5 p-4 border-b border-gray-200">
                                                        <img
                                                            src={order.order_item[0]?.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770"}
                                                            alt={`Product ${order.order_item[0]?.product_id}`}
                                                            className="w-20 h-20 object-cover rounded-md border border-gray-100"
                                                            onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770")}
                                                        />
                                                        <div className="flex flex-col">
                                                            <h3 className="text-[16px] font-semibold text-gray-900">{order.order_item[0]?.name || "Sản phẩm"}</h3>
                                                            <p className="text-gray-600 text-[14px]">{(Number(order.order_item[0]?.price.toFixed(2))).toLocaleString("vi-VN")}₫</p>
                                                        </div>
                                                    </div>

                                                    {/* Danh sách sản phẩm mở rộng */}
                                                    {order.order_item.length > 1 && (
                                                        <div>
                                                            {expandedOrders[order.order_id] && (
                                                                <div className="mt-4 space-y-3">
                                                                    {order.order_item.slice(1).map((item) => (
                                                                        <div
                                                                            key={item.order_item_id}
                                                                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-md border border-gray-200"
                                                                        >
                                                                            <img
                                                                                src={item.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770"}
                                                                                alt={`Product ${item.product_id}`}
                                                                                className="w-16 h-16 object-cover rounded-md border border-gray-100"
                                                                                onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770")}
                                                                            />
                                                                            <div>
                                                                                <h3 className="text-[15px] font-medium text-gray-900">{item.name || "Sản phẩm"}</h3>
                                                                                <p className="text-gray-600 text-[13px]">{(Number(item.price.toFixed(2))).toLocaleString("vi-VN")}₫</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {/* Nút Xem Thêm */}
                                                            <div className="flex justify-center mt-3">
                                                                <button
                                                                    onClick={() => toggleExpand(order.order_id)}
                                                                    className="flex items-center gap-2 text-gray-700 hover:text-black text-[14px] font-medium transition-colors"
                                                                >
                                                                    <span>{expandedOrders[order.order_id] ? "Ẩn bớt" : `Xem thêm (${order.order_item.length - 1} sản phẩm)`}</span>
                                                                    {expandedOrders[order.order_id] ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-center text-[14px]">Không có sản phẩm nào</p>
                                            )}
                                        </div>



                                        {/* Thành tiền */}
                                        {/* <div className="mt-6 p-4 bg-gray-100 rounded-xl flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-800">Thành tiền:</span>
                                            <span className="text-xl font-bold text-indigo-600">${order.total_amount}</span>
                                            <Link to={`/order_tracking/${order.order_id}`}>
                                                <button
                                                    className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-10 py-5 rounded-lg transition-colors duration-200 shadow-md"
                                                >
                                                    <FiEye />
                                                    <span>Xem chi tiết</span>
                                                </button>
                                            </Link>
                                        </div> */}
                                        <div className="flex justify-between items-center pt-3 border-t">
                                            <div className="font-semibold text-xl">
                                                Thành tiền: <span className="text-red-500">
                                                    {(Number(order.total_amount.toFixed(2))).toLocaleString("vi-VN")}₫
                                                </span>
                                            </div>

                                            <Link to={`/order_tracking/${order.order_id}`}>
                                                <button
                                                    className="flex items-center space-x-2 text-white hover:text-black bg-red-500 px-10 py-5 rounded-lg transition-colors duration-200 shadow-md"
                                                >
                                                    <FiEye />
                                                    <span>Xem chi tiết</span>
                                                </button>
                                            </Link>

                                        </div>

                                        {/* Nút View Details */}
                                        <div className="flex justify-end mt-4">

                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-center">Không có đơn hàng nào.</p>
                        )}
                    </div>
                </div>
            </div >
            <div className="flex justify-center mt-5">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    {/* Nút Trang Trước */}
                    <button
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        Trang trước
                    </button>

                    {/* Hiển thị số trang */}
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        {`Trang ${page} / ${totalPages}`}
                    </span>

                    {/* Nút Trang Sau */}
                    <button
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        Trang sau
                    </button>
                </nav>
            </div>

        </div >

    );
};

