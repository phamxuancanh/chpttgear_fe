import React from 'react'
import { useState } from "react";
import { FiHome, FiUsers, FiBox, FiShoppingCart, FiEdit, FiTrash2, FiLogOut, FiPackage, FiEye, FiX } from "react-icons/fi";

export default function Order() {
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const products = [
        { id: 1, name: "Product 1", category: "Electronics", price: "$999", stock: 50, image: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?ixlib=rb-1.2.1" },
        { id: 2, name: "Product 2", category: "Clothing", price: "$59", stock: 100, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-1.2.1" },
        { id: 3, name: "Product 3", category: "Accessories", price: "$29", stock: 75, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1" }
    ];
    const orderDetails = [
        {
            id: "ORD001",
            customer: "Alice Brown",
            status: "Pending",
            date: "2024-01-15",
            items: [
                { productId: 1, quantity: 2, price: "$1998" },
                { productId: 2, quantity: 1, price: "$59" }
            ]
        },
        {
            id: "ORD002",
            customer: "Bob Wilson",
            status: "Completed",
            date: "2024-01-14",
            items: [
                { productId: 3, quantity: 3, price: "$87" }
            ]
        },
        {
            id: "ORD003",
            customer: "Carol White",
            status: "Processing",
            date: "2024-01-13",
            items: [
                { productId: 1, quantity: 1, price: "$999" },
                { productId: 3, quantity: 2, price: "$58" }
            ]
        }
    ];

    const ActionButton = ({ icon: Icon, onClick, color }) => (
        <button
            onClick={onClick}
            className={`p-2 rounded-full ${color} text-white hover:opacity-80 transition-opacity mr-2`}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    const Modal = ({ show, onClose, title, children }) => {
        if (!show) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">{title}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        );
    };


    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };
    return (
        <div className="flex-1 p-8">

            <Modal
                show={showOrderModal}
                onClose={() => setShowOrderModal(false)}
                title="Order Details"
            >
                {selectedOrder && (
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <div>
                                <p className="font-medium">Order ID: {selectedOrder.id}</p>
                                <p>Customer: {selectedOrder.customer}</p>
                                <p>Date: {selectedOrder.date}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${selectedOrder.status === "Completed" ? "bg-green-100 text-green-800" : selectedOrder.status === "Processing" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}>
                                {selectedOrder.status}
                            </span>
                        </div>
                        <div className="border-t pt-4">
                            <h4 className="font-medium mb-2">Order Items</h4>
                            <div className="space-y-2">
                                {selectedOrder.items.map((item, index) => {
                                    const product = products.find(p => p.id === item.productId);
                                    return (
                                        <div key={index} className="flex items-center space-x-4 border-b pb-2">
                                            <img src={product?.image} alt={product?.name} className="w-16 h-16 object-cover rounded" />
                                            <div className="flex-1">
                                                <p className="font-medium">{product?.name}</p>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                <p className="text-sm text-gray-600">Price: {item.price}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>


            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Orders</h2>
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="px-4 py-2 border rounded-lg mr-4"
                        />
                        <select className="px-4 py-2 border rounded-lg">
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orderDetails.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4">{order.id}</td>
                                    <td className="px-6 py-4">{order.customer}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${order.status === "Completed" ? "bg-green-100 text-green-800" : order.status === "Processing" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{order.date}</td>
                                    <td className="px-6 py-4">
                                        <ActionButton icon={FiEye} color="bg-green-500" onClick={() => handleViewOrder(order)} />
                                        <ActionButton icon={FiEdit} color="bg-blue-500" onClick={() => { }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
