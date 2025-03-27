import React, { useEffect, useRef, useState } from 'react';
import { getPaypalCancel, updateTransactionStatus } from '../routers/ApiRoutes';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const PaypalCancel = () => {
    const [countdown, setCountdown] = useState(3);
    const cancelConfirmedRef = useRef(false);
    const redirectTimeoutRef = useRef(null);

    const handleRedirect = async () => {
        if (cancelConfirmedRef.current) return; // Ngăn gọi API nhiều lần

        const query = new URLSearchParams(window.location.search);
        const orderId = query.get('orderId');
        const transactionId = query.get('transactionId');

        if (!orderId || !transactionId) {
            console.error('Thiếu orderId hoặc transactionId');
            return;
        }

        try {
            cancelConfirmedRef.current = true;
            await getPaypalCancel(orderId);
            await updateTransactionStatus(transactionId, {
                status: "FAILED",
                response_message: "Payment via PayPal failed.",
            });

            window.location.href = '/';
        } catch (error) {
            console.error('Lỗi xác thực hủy giao dịch:', error);
        }
    };

    useEffect(() => {
        handleRedirect();

        // Bắt đầu đếm ngược
        const countdownInterval = setInterval(() => {
            setCountdown(prev => (prev > 1 ? prev - 1 : prev));
        }, 1000);

        // Chuyển hướng sau 3 giây
        redirectTimeoutRef.current = setTimeout(handleRedirect, 3000);

        return () => {
            clearInterval(countdownInterval);
            clearTimeout(redirectTimeoutRef.current);
        };
    }, []);

    return (
        <div className="flex items-center justify-center h-screen bg-red-50">
            <div className="text-center bg-white p-10 rounded-lg shadow-lg border border-red-300">
                <div className="flex justify-center mb-4">
                    <AiOutlineCloseCircle className="text-6xl text-red-500 animate-bounce" />
                </div>
                <h1 className="text-3xl font-bold text-red-600 mb-2">Giao dịch đã bị hủy</h1>
                <p className="text-lg text-gray-500">Giao dịch của bạn không thành công.</p>
                <p className="text-lg text-gray-500">Bạn sẽ được chuyển về trang chủ trong {countdown} giây.</p>
                <button
                    onClick={() => {
                        clearTimeout(redirectTimeoutRef.current); // Hủy timeout nếu bấm nút
                        handleRedirect();
                    }}
                    className="mt-4 inline-block bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition"
                >
                    Trở về trang chủ
                </button>
            </div>
        </div>
    );
};

export default PaypalCancel;
