import React, { useState, useEffect } from "react";
import { FiSearch, FiEye, FiShoppingBag, FiCalendar, FiTruck, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Order() {

    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Enhanced mock data with more products and images
        const mockOrders = [
            {
                id: 1,
                orderNumber: "ORD-2024-001",
                status: "Delivered",
                orderDate: "2024-01-15",
                deliveryDate: "2024-01-20",
                customer: {
                    name: "John Doe",
                    email: "john@example.com",
                    address: "123 Main St, City, Country"
                },
                items: [
                    { id: 1, name: "Premium Headphones", quantity: 1, price: 299.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" },
                    { id: 2, name: "Wireless Mouse", quantity: 2, price: 49.99, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46" },
                    { id: 3, name: "Mechanical Keyboard", quantity: 1, price: 159.99, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae" }
                ],
                total: 559.96
            },
            {
                id: 2,
                orderNumber: "ORD-2024-002",
                status: "Processing",
                orderDate: "2024-01-16",
                deliveryDate: "2024-01-22",
                customer: {
                    name: "Jane Smith",
                    email: "jane@example.com",
                    address: "456 Oak St, City, Country"
                },
                items: [
                    { id: 4, name: "Smart Watch", quantity: 1, price: 199.99, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12" },
                    { id: 5, name: "Wireless Earbuds", quantity: 1, price: 149.99, image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb" },
                    { id: 6, name: "Phone Stand", quantity: 2, price: 29.99, image: "https://images.unsplash.com/photo-1586105251261-72a756497a11" }
                ],
                total: 409.96
            },
            {
                id: 3,
                orderNumber: "ORD-2024-003",
                status: "Shipped",
                orderDate: "2024-01-17",
                deliveryDate: "2024-01-23",
                customer: {
                    name: "Mike Johnson",
                    email: "mike@example.com",
                    address: "789 Pine St, City, Country"
                },
                items: [
                    { id: 7, name: "Gaming Monitor", quantity: 1, price: 499.99, image: "https://images.unsplash.com/photo-1527219525722-f9767a7f2884" },
                    { id: 8, name: "USB-C Hub", quantity: 1, price: 79.99, image: "https://images.unsplash.com/photo-1619506118360-947b3f13c30f" }
                ],
                total: 579.98
            }
        ];
        setOrders(mockOrders);
    }, []);

    const filteredOrders = orders.filter(
        (order) =>
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "delivered":
                return "bg-emerald-100 text-emerald-800";
            case "processing":
                return "bg-amber-100 text-amber-800";
            case "shipped":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-slate-100 text-slate-800";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
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

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="grid gap-6 p-6">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white hover:scale-[1.01]"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-indigo-50 rounded-lg">
                                            <FiShoppingBag className="text-indigo-600 text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">{order.orderNumber}</h3>
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)} shadow-sm`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    <Link to="/order_tracking">
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setIsModalOpen(true);
                                            }}
                                            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg transition-colors duration-200"
                                        >
                                            <FiEye />
                                            <span>View Details</span>
                                        </button>
                                    </Link>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                                        <FiCalendar className="text-gray-500" />
                                        <span className="text-sm text-gray-600">Order Date: {order.orderDate}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                                        <FiTruck className="text-gray-500" />
                                        <span className="text-sm text-gray-600">Delivery Date: {order.deliveryDate}</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex space-x-4 overflow-x-auto py-2">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-lg shadow-md"
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770";
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </div>
    );
};

