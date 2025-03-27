import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { FaSearch, FaEye, FaEdit } from "react-icons/fa";
import OrderDetailsModal from "../Modal/OrderDetailsModal";
import { getAllOrders } from "../../routers/ApiRoutes";
import Loading from "../loading";

export default function Order() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);


    const fetchAllOrder = async (pageNumber) => {
        try {
            const res = await getAllOrders(pageNumber, pageSize);
            setOrders(res.data.orders);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };

    // useEffect sẽ quản lý việc gọi API
    useEffect(() => {
        setLoading(true);
        fetchAllOrder(page)
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, [page]); // Chỉ gọi lại khi `page` thay đổi


    const statusColors = {
        "PENDING": "bg-yellow-100 text-yellow-800",
        "PAID": "bg-blue-100 text-blue-800",
        "SHIPPED": "bg-purple-100 text-purple-800",
        "DELIVERED": "bg-green-100 text-green-800",
        "CANCELLED": "bg-red-100 text-red-800",
        "PENDING_PAYMENT": "bg-orange-100 text-orange-800",
        "PARTIALLY_PAID": "bg-cyan-100 text-cyan-800"
    };

    const statusMap = {
        "PENDING": "Đặt hàng thành công",
        "PAID": "Đã thanh toán",
        "SHIPPED": "Đang giao hàng",
        "DELIVERED": "Giao hàng thành công",
        "CANCELLED": "Đã hủy",
        "PENDING_PAYMENT": "Chờ thanh toán tiền cọc",
        "PARTIALLY_PAID": "Thanh toán một phần"
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const filteredOrders = orders?.filter((order) => {
        const matchesSearchQuery =
            searchQuery === "" ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.phone.includes(searchQuery);

        const matchesStatus = statusFilter === "all" || order.status === statusFilter;

        const matchesDateRange =
            (!dateRange.start || new Date(order.date) >= new Date(dateRange.start)) &&
            (!dateRange.end || new Date(order.date) <= new Date(dateRange.end));

        return matchesSearchQuery && matchesStatus && matchesDateRange;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {loading && <Loading />}
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Quản Lý Đơn Hàng</h1>

                <div className="bg-white rounded-lg shadow mb-6 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng Thái</label>
                            <select
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Tất Cả</option>
                                <option value="Đang Chuẩn Bị">Đang Chuẩn Bị</option>
                                <option value="Đã Xác Nhận">Đã Xác Nhận</option>
                                <option value="Đang Vận Chuyển">Đang Vận Chuyển</option>
                                <option value="Đã Giao">Đã Giao</option>
                                <option value="Đã Hủy">Đã Hủy</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Từ Ngày</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Đến Ngày</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm đơn hàng..."
                            className="w-full border border-gray-300 rounded-md p-2 pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Mã Đơn Hàng</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Ngày Đặt</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Tổng Giá</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Phương Thức Thanh Toán</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Trạng Thái</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders?.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{order.order_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {format(order.createdAt, "dd/MM/yyyy HH:mm")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {order.total_amount.toLocaleString()}đ
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.payment_method}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                                                    {statusMap[order.status]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                                <button
                                                    onClick={() => handleViewDetails(order)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <FaEye className="inline mr-1" /> Xem
                                                </button>
                                                {/* <button className="text-green-600 hover:text-green-900">
                                                    <FaEdit className="inline mr-1" /> Cập nhật
                                                </button> */}
                                            </td>
                                        </tr>
                                    ))
                                ) : (<tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-500">Không tìm thấy đơn hàng phù hợp</td>
                                </tr>)}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
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

            {isModalOpen && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

