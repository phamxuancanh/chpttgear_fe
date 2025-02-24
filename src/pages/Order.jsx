import React, { useState, useEffect } from "react";
import { FiSearch, FiEye, FiShoppingBag, FiCalendar, FiTruck, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getOrdersByUserId } from "../routers/ApiRoutes";
import { useSelector } from "react-redux";

export default function Order() {

    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userFromRedux = useSelector((state => state.auth.user));

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const res = await getOrdersByUserId(userFromRedux.id);
            const data = res.data
            setOrders(data);
        } catch (error) {
            console.log(error);
        }
    }

    const filteredOrders = orders?.orders?.filter((order) => {
        const orderId = order?.order_id ? order.order_id.toLowerCase() : "";
        const status = order?.status ? order.status.toLowerCase() : "";

        return (
            orderId.includes(searchQuery.toLowerCase()) ||
            status.includes(searchQuery.toLowerCase())
        );
    });


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
                        {Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <div
                                    key={order.order_id}
                                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white hover:scale-[1.01]"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-indigo-50 rounded-lg">
                                                <FiShoppingBag className="text-indigo-600 text-xl" />
                                            </div>
                                            <div className="flex ">
                                                <h3 className="font-semibold text-gray-900 text-lg mx-2">
                                                    {order.order_id}
                                                </h3>
                                                <span
                                                    className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)} shadow-sm`}
                                                >
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
                                            <span className="text-sm text-gray-600">
                                                Order Date: {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                                            <FiTruck className="text-gray-500" />
                                            <span className="text-sm text-gray-600">
                                                Delivery Date: {new Date(order.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex space-x-4 overflow-x-auto py-2">
                                        {Array.isArray(order.order_item) && order.order_item.length > 0 ? (
                                            order.order_item.map((item) => (
                                                <div key={item.order_item_id} className="flex-shrink-0">
                                                    <img
                                                        src={item.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770"}
                                                        alt={`Product ${item.product_id}`}
                                                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                                                        onError={(e) => {
                                                            e.target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770";
                                                        }}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No items found</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No orders found</p>
                        )}

                    </div>
                </div>
            </div>


        </div>
    );
};

