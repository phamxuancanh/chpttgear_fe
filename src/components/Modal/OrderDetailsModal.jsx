import React, { useEffect, useState } from 'react'
import { FaShippingFast } from "react-icons/fa";
import { findUserById, getPaymentsByOrderId, getProductsByListId } from '../../routers/ApiRoutes';
import Loading from '../loading';
import { format } from 'date-fns';

export default function OrderDetailsModal({ order, onClose }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState(null);
    const [products, setProducts] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await findUserById(order.user_id);
            setUser(res.data);
            const res1 = await getPaymentsByOrderId(order.order_id);
            const transactions = res1?.data.flatMap(payment => payment?.transaction);
            setTransaction(transactions);
            const productIds = order.order_item.map(item => item.product_id);
            if (productIds.length > 0) {
                fetchProducts(productIds)
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchProducts = async (productIds) => {
        try {
            const res = await getProductsByListId(productIds.join(','));
            setProducts(res.data);

        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!order) return null;

    const productMap = products.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
    }, {});

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            {loading && <Loading />}
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Chi Tiết Đơn Hàng {order.order_id}</h2>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Thông Tin Khách Hàng</h3>
                        <p>Tên: {user?.firstName ? user?.firstName + ' ' + user?.lastName : "Michael Tèo Lọ"}</p>
                        <p>SĐT: {user?.phone ? user?.phone : "0926789JQK"}</p>
                        <p>Địa chỉ: {order?.houseNumber}</p>
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
                                {order?.order_item.map((item, index) => {
                                    const product = productMap[item.product_id];
                                    return (
                                        <tr key={index} className="border-b">
                                            <td className="p-2">{product?.name || 'Sản phẩm'}</td>
                                            <td className="p-2 text-right">{item.quantity}</td>
                                            <td className="p-2 text-right">
                                                {item?.price.toLocaleString("vi-VN")}đ
                                            </td>
                                            <td className="p-2 text-right">
                                                {(item?.quantity * item?.price).toLocaleString("vi-VN")}đ
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="mb-6 flex justify-end">
                        <p className="text-md">Chi phí vận chuyển: {order?.shipping_amount.toLocaleString()}đ</p>
                        {/* {order.notes && <p className="mt-2">Ghi chú: {order.notes}</p>} */}
                    </div>

                    <div className="mb-6 flex justify-end">
                        <p className="text-lg font-semibold">Tổng Giá Trị: {order?.total_amount.toLocaleString()}đ</p>
                        {/* {order.notes && <p className="mt-2">Ghi chú: {order.notes}</p>} */}
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Lịch Sử Thanh Toán</h3>
                        <table className="w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="p-2 text-left border border-gray-200">Mã Giao Dịch</th>
                                    <th className="p-2 text-left border border-gray-200">Ngày Thanh Toán</th>
                                    <th className="p-2 text-right border border-gray-200">Số Tiền</th>
                                    <th className="p-2 text-left border border-gray-200">Phương Thức</th>
                                    <th className="p-2 text-center border border-gray-200">Trạng Thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transaction?.length > 0 ? (
                                    transaction.map((transaction, index) => (
                                        <tr key={index} className="border-b border-gray-200">
                                            <td className="p-2 border border-gray-200">{transaction.transaction_id}</td>
                                            <td className="p-2 border border-gray-200">
                                                {format(transaction.createdAt, "dd/MM/yyyy HH:mm")}
                                            </td>
                                            <td className="p-2 text-right border border-gray-200">
                                                {transaction.amount.toLocaleString("vi-VN")}đ
                                            </td>
                                            <td className="p-2 border border-gray-200">{transaction.transaction_type}</td>
                                            <td className="p-2 text-center border border-gray-200">
                                                {transaction.status === "SUCCESS" ? (
                                                    <span className="text-green-600 font-semibold">Hoàn tất</span>
                                                ) : (
                                                    <span className="text-red-600 font-semibold">Thất bại</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-4 text-center text-gray-500">
                                            Chưa có lịch sử giao dịch
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
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
