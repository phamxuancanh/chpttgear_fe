import React, { useState } from "react";
import { FaBox, FaCheckCircle, FaTruck, FaShippingFast, FaMapMarkerAlt } from "react-icons/fa";

export default function OrderTracking() {

  const [orderDetails] = useState({
    orderId: "ORD123456789",
    customerName: "John Doe",
    orderDate: "2024-01-15",
    estimatedDelivery: "2024-01-20",
    status: "Shipped",
    orderItems: [
      {
        id: 1,
        name: "Wireless Headphones",
        quantity: 1,
        price: "$129.99",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
      },
      {
        id: 2,
        name: "Smart Watch",
        quantity: 1,
        price: "$199.99",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12"
      }
    ],
    address: {
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      line1: "123 Tech Street",
      line2: "Apt 4B",
      city: "Silicon Valley",
      state: "CA",
      zipCode: "94025",
      country: "United States"
    }
  });

  const orderStages = [
    { id: 1, name: "Order Placed", icon: <FaBox />, completed: true },
    { id: 2, name: "Order Confirmed", icon: <FaCheckCircle />, completed: true },
    { id: 3, name: "Shipped", icon: <FaTruck />, completed: true },
    { id: 4, name: "Out for Delivery", icon: <FaShippingFast />, completed: false },
    { id: 5, name: "Delivered", icon: <FaCheckCircle />, completed: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Order Header */}
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Order Tracking</h1>
        </div>

        {/* Order Details */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-500">Order ID</h2>
              <p className="text-lg font-medium text-gray-900">{orderDetails.orderId}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-500">Order Date</h2>
              <p className="text-lg font-medium text-gray-900">{orderDetails.orderDate}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-500">Estimated Delivery</h2>
              <p className="text-lg font-medium text-gray-900">{orderDetails.estimatedDelivery}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-500">Status</h2>
              <p className="text-lg font-medium text-blue-600">{orderDetails.status}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {orderDetails.orderItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-gray-900 font-medium">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Progress */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">Order Progress</h2>
          <div className="relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: "60%" }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
              ></div>
            </div>
            <div className="flex justify-between">
              {orderStages.map((stage) => (
                <div key={stage.id} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${stage.completed ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"}`}
                  >
                    {stage.icon}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">{stage.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-blue-600 mt-1 mr-3" />
              <div>
                <p className="font-semibold text-gray-900">{orderDetails.address.name}</p>
                <p className="text-gray-600">{orderDetails.address.phone}</p>
                <p className="text-gray-600">{orderDetails.address.line1}</p>
                {orderDetails.address.line2 && (
                  <p className="text-gray-600">{orderDetails.address.line2}</p>
                )}
                <p className="text-gray-600">
                  {orderDetails.address.city}, {orderDetails.address.state} {orderDetails.address.zipCode}
                </p>
                <p className="text-gray-600">{orderDetails.address.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


