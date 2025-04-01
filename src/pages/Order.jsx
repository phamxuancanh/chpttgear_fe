import React, { useState, useEffect } from "react";
import { FiSearch, FiEye, FiShoppingBag, FiCalendar, FiTruck, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getOrdersByUserId, getProductsByListId } from "../routers/ApiRoutes";
import { useSelector } from "react-redux";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaDongSign } from "react-icons/fa6";
import Loading from "../utils/Loading";

export default function Order() {

    const [orders, setOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("Tất cả");
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
    const [products, setProducts] = useState([]);

    const toggleExpand = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    useEffect(() => {
        setLoading(true);
        fetchOrder(page)
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, [page]);

    const fetchOrder = async (pageNumber) => {
        try {
            const res = await getOrdersByUserId(userId, pageNumber, limit);
            const data = res.data;


            // Kiểm tra nếu data.orders không phải là mảng thì gán giá trị mặc định []
            const orders = Array.isArray(data.orders) ? data.orders : [];

            setOrders(orders);
            setTotalPages(data.totalPages);

            // 📌 Lấy danh sách productIds từ `order_item`
            const productIds = orders
                .flatMap((order) => order.order_item?.map((item) => item.product_id) || []) // Kiểm tra order_item có tồn tại không
                .filter((id, index, self) => self.indexOf(id) === index); // Loại bỏ ID trùng


            if (productIds.length > 0) {
                fetchProducts(productIds);
            }
        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng:", error);
        }
    };


    const fetchProducts = async (productIds) => {
        try {
            const res = await getProductsByListId(productIds.join(','));
            setProducts(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        }
    };
    // 
    // Lọc và sắp xếp đơn hàng theo ngày tạo mới nhất
    const uniqueStatuses = ["Tất cả", "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED", "PENDING_PAYMENT", "PARTIALLY_PAID"];

    // Lọc đơn hàng theo status và searchQuery
    const filteredOrders = orders
        ?.filter((order) => {
            if (selectedStatus !== "Tất cả" && order.status !== selectedStatus) {
                return false;
            }
            const orderId = order?.order_id ? order.order_id.toLowerCase() : "";
            const status = order?.status ? order.status.toLowerCase() : "";
            return orderId.includes(searchQuery.toLowerCase()) || status.includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const getStatusColor = (status) => {
        switch (status.toUpperCase()) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "PAID":
                return "bg-blue-100 text-blue-800";
            case "SHIPPED":
                return "bg-purple-100 text-purple-800";
            case "DELIVERED":
                return "bg-green-100 text-green-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            case "PENDING_PAYMENT":
                return "bg-orange-100 text-orange-800";
            case "PARTIALLY_PAID":
                return "bg-cyan-100 text-cyan-800";
            case "REFUND":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };


    const statusMap = {
        "PENDING": "Đặt hàng thành công",
        "PAID": "Đã thanh toán",
        "SHIPPED": "Đang giao hàng",
        "DELIVERED": "Giao hàng thành công",
        "CANCELLED": "Đã hủy",
        "PENDING_PAYMENT": "Chờ thanh toán tiền cọc",
        "PARTIALLY_PAID": "Thanh toán một phần",
        "REFUND": "Trả hàng / Hoàn tiền",
    };

    const productMap = products.reduce((acc, product) => {
        acc[product.id] = product; // Lưu cả object product để dễ dàng lấy các thông tin khác
        return acc;
    }, {});

    const orderCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});


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

                <div className="flex space-x-1 border-b pb-2 justify-between">
                    {uniqueStatuses.map((status) => {
                        const count = orderCounts[status] ?? 0;
                        return (
                            <button
                                key={status}
                                onClick={() => setSelectedStatus(status)}
                                className={`text-base  px-4 py-2 rounded-t-lg border-b-2 transition-colors duration-200 ${selectedStatus === status
                                    ? "border-orange-600 text-orange-600 font-semibold"
                                    : "border-transparent text-gray-600 hover:text-orange-600"
                                    }`}
                            >
                                {statusMap[status] ?? status}
                                {count > 0 && (
                                    <span className="ml-2 text-md font-semibold text-orange-600">
                                        ({count})
                                    </span>
                                )}
                            </button>
                        )
                    })}
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
                                                <span className={`px-3 py-1 text-center rounded-full text-sm uppercase ${getStatusColor(order.status)}`}>
                                                    {statusMap[order.status] || "Không xác định"}
                                                </span>

                                            </div>
                                        </div>

                                        {/* Danh sách sản phẩm */}
                                        <div className="mt-6 space-y-6">
                                            {Array.isArray(order.order_item) && order.order_item.length > 0 ? (
                                                <div key={order.order_id} className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                                                    {/* Sản phẩm đầu tiên */}
                                                    <div className="flex items-center justify-between gap-5 p-4 border-b border-gray-200">
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-20 h-20 flex items-center justify-center border border-gray-100 rounded-md overflow-hidden">
                                                                <img
                                                                    src={productMap[order.order_item[0]?.product_id]?.image.split(",")[0] || "https://via.placeholder.com/100"}
                                                                    alt={productMap[order.order_item[0]?.product_id]?.name || "Sản phẩm"}
                                                                    className="w-full h-full object-contain"
                                                                    onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
                                                                />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <h3 className="text-[16px] font-semibold text-gray-900">
                                                                    {productMap[order.order_item[0]?.product_id]?.name || "Sản phẩm"}
                                                                </h3>
                                                                <p className="text-gray-600 text-[14px]">Số lượng: {order.order_item[0]?.quantity || 1}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-[16px] font-semibold text-orange-600">
                                                            {(Number(order.order_item[0]?.price?.toFixed(2)) || 0).toLocaleString("vi-VN")}₫
                                                        </p>
                                                    </div>

                                                    {/* Danh sách sản phẩm mở rộng */}
                                                    {order.order_item.length > 1 && (
                                                        <div>
                                                            {expandedOrders[order.order_id] && (
                                                                <div className="mt-4 space-y-3">
                                                                    {order.order_item.slice(1).map((item) => (
                                                                        <div key={item.order_item_id} className="flex items-center justify-between gap-5 p-4 border-b border-gray-200">
                                                                            <div className="flex items-center gap-5">
                                                                                <div className="w-20 h-20 flex items-center justify-center border border-gray-100 rounded-md overflow-hidden">
                                                                                    <img
                                                                                        src={productMap[item.product_id]?.image.split(",")[0] || "https://via.placeholder.com/100"}
                                                                                        alt={productMap[item.product_id]?.name || "Sản phẩm"}
                                                                                        className="w-full h-full object-contain"
                                                                                        onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <h3 className="text-[16px] font-semibold text-gray-900">
                                                                                        {productMap[item.product_id]?.name || "Sản phẩm"}
                                                                                    </h3>
                                                                                    <p className="text-gray-600 text-[14px]">Số lượng: {item.quantity || 1}</p>
                                                                                </div>
                                                                            </div>
                                                                            <p className="text-[16px] font-semibold text-orange-600">
                                                                                {(Number(item.price?.toFixed(2)) || 0).toLocaleString("vi-VN")}₫
                                                                            </p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
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
                                            ) : (
                                                <p className="text-gray-500 text-center text-[14px]">Không có sản phẩm nào</p>
                                            )}
                                        </div>

                                        <div className="flex justify-end gap-3 pt-3 border-t">
                                            {/* Tổng tiền */}
                                            <div className="font-semibold text-xl">
                                                Thành tiền: <span className="text-red-500">
                                                    {(Number(order.total_amount.toFixed(2))).toLocaleString("vi-VN")}₫
                                                </span>
                                            </div>
                                        </div>


                                        {/* Nút View Details */}
                                        <div className="flex justify-end mt-4 space-x-2">
                                            <Link to={`/order_tracking/${order.order_id}`}>
                                                <button
                                                    className="text-white bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg transition font-medium"
                                                >
                                                    <span>Xem chi tiết</span>
                                                </button>
                                            </Link>
                                            <Link to={`/order_tracking/${order.order_id}`}>
                                                <button
                                                    className="text-black bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg transition font-medium"
                                                >
                                                    <span>Đánh giá</span>
                                                </button>
                                            </Link>
                                            <Link to={`/order_tracking/${order.order_id}`}>
                                                <button
                                                    className="text-black bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg transition font-medium"
                                                >
                                                    <span>Yêu cầu trả hàng/Hoàn tiền</span>
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

