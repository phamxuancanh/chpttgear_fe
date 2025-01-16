import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import LOGO from "../assets/logo.png"
import { Link, useNavigate } from "react-router-dom";
import { sendOTP } from "../routers/ApiRoutes";
import { toast } from "react-toastify";
import ROUTES from "../constants/Page";
import OTPModal from "../components/Modal/OTPModal";
export default function ForgotPassword() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        alert("Submit");
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            try {
                const response = await sendOTP(formData);
                if (response.status === 200) {
                    toast.success("OTP sent successfully");
                    setIsModalOpen(true);
                }
            } catch (error) {
                console.error("Registration error:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    const handleCloseModal = () => {
        setFormData({ email: "" })
        setErrors({})
        setIsModalOpen(false)
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            {isModalOpen && <OTPModal onClose={handleCloseModal} email={formData.email} />}
            <div className="max-w-6xl w-full flex bg-white rounded-2xl shadow-xl overflow-hidden ">
                {/* Left Side - Logo/Image */}
                <div className="hidden md:flex md:w-1/2 bg-black 0 p-12 items-center justify-center">
                    <img
                        src={LOGO}
                        alt="Forgotpassword Banner"

                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3";
                        }}
                    />
                </div>

                {/* Right Side - Sign Up Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-12">
                    <div className="w-full max-w-md mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                            Quên mật khẩu
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Nhập email bạn đã đăng ký
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Gửi yêu cầu khôi phục"
                                )}
                            </button>

                            <Link to="/login">
                                <button
                                    type="button"
                                    className=" mt-7 w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Trở về trang đăng nhập
                                </button>
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

