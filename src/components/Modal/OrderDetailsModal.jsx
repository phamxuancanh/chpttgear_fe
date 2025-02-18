import React from 'react'
import { FaShippingFast } from "react-icons/fa";

export default function OrderDetailsModal({ order, onClose }) {
    if (!order) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Chi Tiết Đơn Hàng {order.id}</h2>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Thông Tin Khách Hàng</h3>
                        <p>Tên: {order.customer.name}</p>
                        <p>SĐT: {order.customer.phone}</p>
                        <p>Địa chỉ: {order.customer.address}</p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Danh Sách Sản Phẩm</h3>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="p-2 text-left">Sản Phẩm</th>
                                    <th className="p-2 text-right">Số Lượng</th>
                                    <th className="p-2 text-right">Đơn Giá</th>
                                    <th className="p-2 text-right">Thành Tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-2">{item.name}</td>
                                        <td className="p-2 text-right">{item.quantity}</td>
                                        <td className="p-2 text-right">{item.price.toLocaleString()}đ</td>
                                        <td className="p-2 text-right">{(item.quantity * item.price).toLocaleString()}đ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mb-6">
                        <p className="text-lg font-semibold">Tổng Giá Trị: {order.total.toLocaleString()}đ</p>
                        {order.notes && <p className="mt-2">Ghi chú: {order.notes}</p>}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button

                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                            <FaShippingFast className="inline mr-2" />
                            Lên đơn vận chuyển
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
