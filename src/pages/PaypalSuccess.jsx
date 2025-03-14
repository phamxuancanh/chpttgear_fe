import React, { useEffect, useRef, useState } from 'react';
import { getPaypalSuccess, updateTransactionStatus } from '../routers/ApiRoutes';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const PaypalSuccess = () => {
    const [countdown, setCountdown] = useState(3);
    const paymentConfirmedRef = useRef(false);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const orderId = query.get('orderId')
        const token = query.get('token');
        const payerId = query.get('PayerID');
        const transaction_id = query.get('transactionId')

        const confirmPayment = async () => {
            if (token && payerId) {
                try {
                    if (!paymentConfirmedRef.current) {
                        const response = await getPaypalSuccess(orderId, token, payerId);
                        const res = await updateTransactionStatus(transaction_id, { status: "SUCCESS", response_message: "Payment via PayPal was successful." })
                        if (response.status === 200 && res.status === 200) {
                            paymentConfirmedRef.current = true;
                            const redirectTimeout = setTimeout(() => {
                                window.location.href = '/';
                            }, 3000);
                            return () => clearTimeout(redirectTimeout);
                        }
                    }
                } catch (error) {
                    console.error('Lỗi xác thực giao dịch:', error);
                }
            } else {
                console.error('Payment ID hoặc Payer ID không hợp lệ');
            }
        };

        confirmPayment();

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
        <div className="flex items-center justify-center h-screen bg-green-50">
            <div className="text-center bg-white p-10 rounded-lg shadow-lg border border-green-300">
                <div className="flex justify-center mb-4">
                    <AiOutlineCheckCircle className="text-6xl text-green-500 animate-bounce" />
                </div>
                <h1 className="text-3xl font-bold text-green-600 mb-2">Thanh toán thành công</h1>
                <p className="text-lg text-gray-500">Cảm ơn bạn đã thực hiện giao dịch!</p>
                <p className="text-lg text-gray-500">Bạn sẽ được chuyển trở về trang chủ trong {countdown} giây.</p>
                <a
                    href="/"
                    className="mt-4 inline-block bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition"
                >
                    Trở về trang chủ
                </a>
            </div>
        </div>
    );
};

export default PaypalSuccess;
