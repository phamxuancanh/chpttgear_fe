import React, { useEffect, useRef, useState } from 'react';
import { getPaypalCancel } from '../routers/ApiRoutes';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const PaypalCancel = () => {
    const [countdown, setCountdown] = useState(3);
    const cancelConfirmedRef = useRef(false);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const orderId = query.get('orderId');

        const cancelPayment = async () => {
            if (orderId) {
                try {
                    if (!cancelConfirmedRef.current) {
                        const response = await getPaypalCancel(orderId);
                        if (response.status === 200) {
                            cancelConfirmedRef.current = true;
                            const redirectTimeout = setTimeout(() => {
                                window.location.href = '/';
                            }, 3000);
                            return () => clearTimeout(redirectTimeout);
                        }
                    }
                } catch (error) {
                    console.error('Lỗi xác thực hủy giao dịch:', error);
                }
            } else {
                console.error('Payment ID hoặc Payer ID không hợp lệ');
            }
        };

        cancelPayment();

        const countdownInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev === 1) {
                    clearInterval(countdownInterval);
                    return prev;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownInterval);
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
                <a
                    href="/"
                    className="mt-4 inline-block bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition"
                >
                    Trở về trang chủ
                </a>
            </div>
        </div>
    );
};

export default PaypalCancel;
