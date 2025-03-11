import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import PAYPAL_IMG from "../assets/paypal.jpg";
import CASH_IMG from "../assets/cash.webp";
import GHN_IMG from "../assets/ghn.webp";
import { FaTruck, FaRedo, FaCreditCard, FaComments } from "react-icons/fa";
import LOGO from "../assets/logo.png"

export default function Footer() {
    const policies = [
        {
            icon: <FaTruck className="text-red-500 text-3xl" />,
            title: "CHÍNH SÁCH GIAO HÀNG",
            description: "Nhận hàng và thanh toán tại nhà",
        },
        {
            icon: <FaRedo className="text-red-500 text-3xl" />,
            title: "ĐỔI TRẢ DỄ DÀNG",
            description: "1 đổi 1 trong 15 ngày",
        },
        {
            icon: <FaCreditCard className="text-red-500 text-3xl" />,
            title: "THANH TOÁN TIỆN LỢI",
            description: "Trả tiền mặt, Thanh toán bằng Paypal",
        },
        {
            icon: <FaComments className="text-red-500 text-3xl" />,
            title: "HỖ TRỢ NHIỆT TÌNH",
            description: "Tư vấn, giải đáp mọi thắc mắc",
        },
    ];


    return (
        <footer className="bg-white text-black pb-12 w-full">
            <div className="bg-gray-100 p-6 flex justify-center items-center rounded-lg border border-b ">
                <div className="w-10/12 flex justify-between items-center ">
                    {policies.map((policy, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            {policy.icon}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">{policy.title}</h3>
                                <p className="text-xs text-gray-600">{policy.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="container mx-auto px-4 w-10/12 mt-7">
                <div className="grid md:grid-cols-5 gap-8">
                    <div className="">

                        <h3 className="text-lg font-bold mb-4">Về chúng tôi</h3>

                        <p className="text-gray-600">Nhà cung cấp linh kiện máy tính hiệu suất cao hàng đầu.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Hỗ trợ khách hàng</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li><a href="#" className="hover:text-white">Liên hệ với chúng tôi</a></li>
                            <li><a href="#" className="hover:text-white">FAQ</a></li>
                            <li><a href="#" className="hover:text-white">Thông tin giao hàng</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Pháp lý</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li><a href="#" className="hover:text-white">Chính sách quyền riêng tư</a></li>
                            <li><a href="#" className="hover:text-white">Điều khoản dịch vụ</a></li>
                            <li><a href="#" className="hover:text-white">Chính sách hoàn trả</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Kết nối với chúng tôi</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-blue-400"><FaFacebook size={24} /></a>
                            <a href="#" className="hover:text-blue-400"><FaTwitter size={24} /></a>
                            <a href="#" className="hover:text-blue-400"><FaInstagram size={24} /></a>
                            <a href="#" className="hover:text-blue-400"><FaLinkedin size={24} /></a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Đơn vị vận chuyển</h3>
                        <div className="flex space-x-4">
                            <img src={GHN_IMG} />
                        </div>
                        <h3 className="text-lg font-bold mb-4 mt-2">Cách thức thanh toán</h3>
                        <div className="flex">
                            <img src={PAYPAL_IMG} className="w-[10vh] h-[8vh]" />
                            <img src={CASH_IMG} className="w-[10vh] h-[5vh] mt-3" />
                        </div>


                    </div>
                </div>
            </div>
        </footer>
    );
};



