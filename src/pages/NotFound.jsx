import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Không tìm thấy trang</h2>
                <p className="text-gray-600 mb-8">Xin lỗi, Trang web bạn tìm không tồn tại.</p>
                <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    Trở về trang chủ
                </Link>
            </div>
        </div>
    );
};

export default NotFound;