import React, { useEffect, useRef, useState } from 'react';
import { getPaypalSuccess, updateTransactionStatus } from '../routers/ApiRoutes';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const PaypalSuccess = () => {
    const [countdown, setCountdown] = useState(3);
    const paymentConfirmedRef = useRef(false);
    const redirectTimeoutRef = useRef(null);

    const handleRedirect = async () => {
        if (paymentConfirmedRef.current) return; // Ngăn gọi API nhiều lần

        const query = new URLSearchParams(window.location.search);
        const orderId = query.get('orderId');
        const token = query.get('token');
        const payerId = query.get('PayerID');
        const transactionId = query.get('transactionId');

        try {
            paymentConfirmedRef.current = true;
            await getPaypalSuccess(orderId, token, payerId);
            await updateTransactionStatus(transactionId, {
                status: "SUCCESS",
                response_message: "Payment via PayPal was successful.",
            });

            window.location.href = '/';
        } catch (error) {
            console.error('Lỗi xác thực giao dịch:', error);
        }
    };

    useEffect(() => {
        // Gọi API ngay khi trang load
        handleRedirect();

        // Bắt đầu đếm ngược
        const countdownInterval = setInterval(() => {
            setCountdown(prev => (prev > 1 ? prev - 1 : prev));
        }, 1000);

        // Chuyển trang sau 3 giây
        redirectTimeoutRef.current = setTimeout(handleRedirect, 3000);

        return () => {
            clearInterval(countdownInterval);
            clearTimeout(redirectTimeoutRef.current);
        };
    }, []);

    return (
        <div className="flex items-center justify-center h-screen bg-green-50">
            <div className="text-center bg-white p-10 rounded-lg shadow-lg border border-green-300">
                <div className="flex justify-center mb-4">
                    <AiOutlineCheckCircle className="text-6xl text-green-500 animate-bounce" />
                </div>
                <h1 className="text-3xl font-bold text-green-600 mb-2">Thanh toán thành công</h1>
                <p className="text-lg text-gray-500">Cảm ơn bạn đã thực hiện giao dịch!</p>
                <p className="text-lg text-gray-500">Bạn sẽ được chuyển về trang chủ trong {countdown} giây.</p>
                <button
                    onClick={() => {
                        clearTimeout(redirectTimeoutRef.current); // Hủy timeout nếu bấm nút
                        handleRedirect();
                    }}
                    className="mt-4 inline-block bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition"
                >
                    Trở về trang chủ
                </button>
            </div>
        </div>
    );
};

export default PaypalSuccess;
