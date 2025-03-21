import React, { useEffect, useState } from 'react'
import { FaShippingFast } from "react-icons/fa";
import { createShippingOrder, findUserById, getPaymentsByOrderId, getProductsByListId } from '../../routers/ApiRoutes';
import Loading from '../loading';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { FcCancel } from "react-icons/fc";
import { toast } from 'react-toastify';

export default function OrderDetailsModal({ order, onClose }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState(null);
    const [products, setProducts] = useState([]);
    const stockIns = useSelector(state => state.inventory.stockIns)
    const stockOuts = useSelector(state => state.inventory.stockOuts)
    const [selectedValue, setSelectedValue] = useState("");
    const requiredNoteOptions = {
        CHOTHUHANG: "Cho thử hàng",
        CHOXEMHANGKHONGTHU: "Cho xem hàng, không thử",
        KHONGCHOXEMHANG: "Không cho xem hàng",
    };
    const handleChange = (event) => {
        const selectedKey = event.target.value;
        setSelectedValue(selectedKey);
        console.log("Người dùng đã chọn:", selectedKey);
    };
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

    const getProductStock = (productId) => {
        // Nhóm số lượng nhập kho theo inventory_id
        const stockInMap = stockIns
            .filter(item => item.product_id === productId)
            .reduce((acc, item) => {
                acc[item.inventory_id] = acc[item.inventory_id] || { stock: 0, name: item.inventory.name };
                acc[item.inventory_id].stock += item.quantity;
                return acc;
            }, {});

        // Nhóm số lượng xuất kho theo inventory_id
        const stockOutMap = stockOuts
            .filter(item => item.product_id === productId)
            .reduce((acc, item) => {
                acc[item.inventory_id] = acc[item.inventory_id] || { stock: 0, name: item.inventory.name };
                acc[item.inventory_id].stock += item.quantity;
                return acc;
            }, {});

        // Lấy danh sách tất cả inventory_id liên quan đến productId
        const allInventoryIds = new Set([
            ...Object.keys(stockInMap),
            ...Object.keys(stockOutMap)
        ]);



        return Array.from(allInventoryIds).map(inventory_id => ({
            name: stockInMap[inventory_id]?.name || stockOutMap[inventory_id]?.name, // Lấy name từ bất kỳ object nào có inventory_id
            stock: (stockInMap[inventory_id]?.stock || 0) - (stockOutMap[inventory_id]?.stock || 0)
        }))
    };

    const fetchProducts = async (productIds) => {
        try {
            const res = await getProductsByListId(productIds.join(','));
            setProducts(res.data);

        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        }
    };

    useEffect(() => {
        console.log(order)
        fetchData();
    }, []);

    if (!order) return null;

    const productMap = products.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
    }, {});

    const checkStock = () => {
        const isOutOfStock = order?.order_item.some((item) => {
            const product = productMap[item.product_id];
            const stockInfo = getProductStock(product?.id);
            console.log(product)
            // Kiểm tra nếu tồn kho không có dữ liệu hoặc tổng số lượng tồn kho nhỏ hơn số lượng đặt hàng
            if (!Array.isArray(stockInfo) || stockInfo.reduce((sum, stock) => sum + stock.stock, 0) < item.quantity) {
                return true; // Có ít nhất một sản phẩm không đủ hàng
            }
            return false;
        });
        return isOutOfStock
    }

    const handleCreateShipping = async () => {
        if (!selectedValue) {
            toast.error("Vui lòng chọn đề xuất khi nhận hàng")
            return
        }
        setLoading(true)
        console.log(order)
        const parts = order.houseNumber.split(",").map((part) => part.trim());
        const productIds = order.order_item.map(item => item.product_id);
        const queryString = productIds.join(",");
        const res3 = await getProductsByListId(queryString)

        const filteredProducts = order.order_item.map(item => {
            const product = res3.data?.find(p => p.id === item.product_id);
            return {
                product_id: product?.product_id || item.product_id,
                name: product?.name || "Unknown",
                weight: product?.weight || 0,
                quantity: item.quantity,
                price: item.price
            };
        });

        // Tạo chuỗi chứa danh sách tên sản phẩm
        const productNames = filteredProducts.map(p => p.name).join(", ");
        const total_weight = filteredProducts.reduce((sum, p) => sum + p.weight, 0);
        const orderData = {
            note: "",
            required_note: selectedValue,
            to_name: "TinTest124",
            to_phone: "0987654321",
            to_address: order.houseNumber + ', Vietnam',
            to_ward_name: parts[1] || "",
            to_district_name: parts[2] || "",
            to_province_name: parts[3] || "",
            order_name: productNames,
            // cod_amount: order.total_amount,
            cod_amount: 3000000,
            length: 4,
            width: 4,
            height: 4,
            total_weight: total_weight,
            service_type_id: 2,
            ShopId: 195800,
            order_id: order.order_id,
            user_id: order.user_id,
            status: "CONFIRMED",
            total_price: order.total_amount,
            payment_method: order.payment_method,
            items: filteredProducts
        };
        try {
            const result = await createShippingOrder(orderData);
            console.log("Kết quả đơn hàng:", result);
            setLoading(false)
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        } finally {
            setLoading(false)
        }

        alert("Lên đơn thành công!");
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            {loading && <Loading />}
            <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Chi Tiết Đơn Hàng {order.order_id}</h2>
                    <h3 className="text-lg font-semibold mb-2"><strong>Thông Tin Khách Hàng</strong></h3>
                    <div className="mb-6 flex justify-between px-9">
                        <div>
                            <p><strong>Tên:</strong> {user?.firstName ? user?.firstName + ' ' + user?.lastName : "Michael Tèo Lọ"}</p>
                            <p><strong>SĐT:</strong> {user?.phone ? user?.phone : "0926789JQK"}</p>
                            <p><strong>Địa chỉ:</strong> {order?.houseNumber}</p>
                        </div>
                        <div className='leading-7'>
                            <p><strong>Phương thức thanh toán:</strong> {order?.payment_method == 'COD' ? 'Thanh toán khi nhận hàng' : 'Thanh toán bằng Paypal'}</p>
                            <h2 >Chọn đề xuất khi nhận hàng</h2>
                            <select value={selectedValue} onChange={handleChange} className='p-2 border rounded-lg border-black mt-2'>
                                <option value="">Chọn đề xuất</option>
                                {Object.entries(requiredNoteOptions).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Danh Sách Sản Phẩm</h3>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="p-2 text-left w-1/4">Sản Phẩm</th>
                                    <th className="p-2 text-right w-1/12">Số Lượng</th>
                                    <th className="p-2 text-right w-1/4">Tồn kho</th>
                                    <th className="p-2 text-right w-1/6">Đơn Giá</th>
                                    <th className="p-2 text-right w-1/6">Thành Tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order?.order_item.map((item, index) => {
                                    const product = productMap[item.product_id];
                                    const stockList = getProductStock(product?.id); // Gọi 1 lần duy nhất

                                    return (
                                        <tr key={index} className="border-b">
                                            <td className="p-2">{product?.name || 'Sản phẩm'}</td>
                                            <td className="p-2 text-right">{item.quantity}</td>
                                            <td className="p-2 text-right">
                                                <ul className="mt-1 ml-12 text-gray-600 leading-relaxed">
                                                    {Array.isArray(stockList) && stockList.length > 0 ? (
                                                        stockList.map((item, index) => (
                                                            <li key={index}>
                                                                {item.name}: <strong>{item.stock} sản phẩm</strong>

                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li>0</li>
                                                    )}
                                                </ul>
                                            </td>
                                            <td className="p-2 text-right">
                                                {item?.price.toLocaleString("vi-VN")}đ
                                            </td>
                                            <td className="p-2 text-right">
                                                {(item?.quantity * item?.price).toLocaleString("vi-VN")}đ
                                            </td>
                                        </tr>
                                    );
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
                    {order?.payment_method != 'COD' && <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Lịch Sử Thanh Toán</h3>
                        <table className="w-full border-collapse border border-gray-200 ">
                            <thead>
                                <tr className="bg-gray-50 text-center">
                                    <th className="p-2 text-center border border-gray-200">Mã Giao Dịch</th>
                                    <th className="p-2 text-center border border-gray-200">Ngày Thanh Toán</th>
                                    <th className="p-2 text-center border border-gray-200">Số Tiền</th>
                                    <th className="p-2 text-center border border-gray-200">Phương Thức</th>
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
                    </div>}



                    <div className="flex justify-end gap-2">
                        {!checkStock ? <button
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-200 flex justify-center items-center"
                            onClick={() => handleCreateShipping()}
                            disabled={true}
                        >

                            <FcCancel className="inline mr-2 font-bold text-xl" />
                            Không đủ số lượng
                        </button> :
                            <button
                                className="px-4 py-2 bg-green-500  rounded text-white hover:bg-green-600 flex justify-center items-center"
                                onClick={() => handleCreateShipping()}

                            >

                                <FaShippingFast className="inline mr-2 font-bold text-xl " />
                                Lên đơn vận chuyển
                            </button>}

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
