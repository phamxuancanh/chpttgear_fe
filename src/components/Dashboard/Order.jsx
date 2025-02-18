import React, { useState } from "react";
import { format } from "date-fns";
import { FaSearch, FaEye, FaEdit } from "react-icons/fa";
import OrderDetailsModal from "../Modal/OrderDetailsModal";

export default function Order() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const dummyOrders = [
        {
            id: "ORD001",
            date: new Date(),
            total: 1500000,
            paymentMethod: "Thanh toán khi nhận hàng",
            status: "Đang Chuẩn Bị",
            customer: {
                name: "Nguyễn Văn A",
                phone: "0123456789",
                address: "123 Đường ABC, Quận 1, TP.HCM"
            },
            items: [
                { name: "Sản phẩm 1", quantity: 2, price: 500000 },
                { name: "Sản phẩm 2", quantity: 1, price: 500000 }
            ],
            notes: "Giao hàng giờ hành chính"
        },
        {
            id: "ORD002",
            date: new Date(),
            total: 2000000,
            paymentMethod: "Chuyển khoản ngân hàng",
            status: "Đã Xác Nhận",
            customer: {
                name: "Trần Thị B",
                phone: "0987654321",
                address: "456 Đường XYZ, Quận 2, TP.HCM"
            },
            items: [
                { name: "Sản phẩm 3", quantity: 1, price: 2000000 }
            ],
            notes: ""
        }
    ];

    const statusColors = {
        "Đang Chuẩn Bị": "bg-yellow-100 text-yellow-800",
        "Đã Xác Nhận": "bg-blue-100 text-blue-800",
        "Đang Vận Chuyển": "bg-purple-100 text-purple-800",
        "Đã Giao": "bg-green-100 text-green-800",
        "Đã Hủy": "bg-red-100 text-red-800"
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const filteredOrders = dummyOrders.filter((order) => {
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
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {format(order.date, "dd/MM/yyyy HH:mm")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {order.total.toLocaleString()}đ
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.paymentMethod}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                                                    {order.status}
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

            {isModalOpen && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

