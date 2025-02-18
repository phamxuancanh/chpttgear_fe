import { useState } from "react";
import { FaGift } from "react-icons/fa";

export default function ConfirmCheckout() {
    const [quantity, setQuantity] = useState(1);

    // Dữ liệu mẫu đơn hàng
    const orderDetails = {
        items: [
            {
                id: 1,
                name: "LOCOMOTIVE Men Blue Slim Fit Mid-Rise Clean Look Stretchable Jeans",
                size: "32",
                quantity: 2,
                price: 2499,
                discount: 1625,
                finalPrice: 874,
                image: "https://esx.bigo.sg/live/4hb/0r2AqY.jpg"
            },
            {
                id: 2,
                name: "LOCOMOTIVE222 Men Blue Slim Fit Mid-Rise Clean Look Stretchable Jeans",
                size: "33",
                quantity: 3,
                price: 1499,
                discount: 1625,
                finalPrice: 174,
                image: "https://esx.bigo.sg/live/4hb/0r2AqY.jpg"
            },
            {
                id: 3,
                name: "LOCOMOTIVE222 Men Blue Slim Fit Mid-Rise Clean Look Stretchable Jeans",
                size: "34",
                quantity: 2,
                price: 1499,
                discount: 1625,
                finalPrice: 174,
                image: "https://esx.bigo.sg/live/4hb/0r2AqY.jpg"
            }
        ],
    };

    // Tính tổng giá trị sản phẩm
    const bagTotal = orderDetails.items.reduce((total, item) => total + item.finalPrice * item.quantity, 0);

    // Tính các giá trị phụ
    const bagDiscount = bagTotal * 0.05; // 5% discount
    const taxableAmount = bagTotal - bagDiscount; // Sau khi trừ discount
    const tax = taxableAmount * 0.08; // 8% thuế
    const deliveryCharges = taxableAmount * 0.10; // 10% phí vận chuyển

    // Tính tổng đơn hàng
    const orderTotal = taxableAmount + tax + deliveryCharges;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-100 flex gap-6">

            {/* Left Column - Shopping Bag */}
            <div className="w-2/3 bg-white p-4 shadow rounded-lg">
                <h2 className="text-lg font-semibold border-b pb-2">My Shopping Bag ({orderDetails.items.length} Items)</h2>

                {orderDetails.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-4 border-b">
                        <div className="flex items-center gap-4">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 rounded"
                            />
                            <div>
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-sm text-gray-600">Size: {item.size}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-semibold text-red-500">₹{item.finalPrice}</p>
                            <p className="text-sm line-through text-gray-400">₹{item.price}</p>
                        </div>
                    </div>
                ))}


            </div>

            {/* Right Column - Price Details */}
            <div className="w-1/3 bg-white p-4 shadow rounded-lg">
                <h3 className="text-lg font-semibold">Price Details</h3>
                <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Bag Total</span>
                        <span>₹{bagTotal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Bag Discount</span>
                        <span className="text-green-500">-₹{bagDiscount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax</span>
                        <span>₹{tax}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Coupon Discount</span>
                        <button className="text-blue-500 text-sm">Apply Coupon</button>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Order Total</span>
                        <span>₹{orderTotal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery Charges</span>
                        <span>₹{deliveryCharges}</span>
                    </div>
                </div>
                <div className="mt-4 flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>₹{orderTotal + deliveryCharges}</span>
                </div>

                <button className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
                    PLACE ORDER
                </button>
            </div>
        </div>
    );
}
