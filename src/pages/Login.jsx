

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import LOGO from "../assets/logo.png"
import { Link, useNavigate } from "react-router-dom";
import { googleSignIn, signIn } from "../routers/ApiRoutes";
import { setToLocalStorage } from "../utils/functions";
import { toast } from "react-toastify";
import ROUTES from '../constants/Page';
import CryptoJS from 'crypto-js'

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
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
        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            try {
                // Simulating API call
                const response = await signIn(formData);
                console.log("Login response:", response);
                if (response.status === 200) {
                    const currentUser = {
                        accessToken: response.data.accessToken,
                        currentUser: response.data.user
                    }
                    console.log(currentUser)
                    setToLocalStorage('persist:auth', JSON.stringify(currentUser))
                    // loginState(currentUser.currentUser)
                    // dispatch(loginState(currentUser.currentUser))
                    navigate(ROUTES.HOME_PAGE.path)
                    toast.success('Đăng nhập thành công')
                }
            } catch (error) {
                console.error("Login error:", error);
                toast.error('Đăng nhập thất bại')
                if (error.message.includes("Username")) {
                    setErrors({
                        username: "Username is incorrect",
                    });
                }
                if (error.message.includes("Password")) {
                    setErrors({
                        password: "Password is incorrect",
                    });
                }
            } finally {
                setIsLoading(false);
            }
        }
    };
    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();
            if (result) {
                const currentUser = {
                    accessToken: result.accessToken,
                    currentUser: result.currentUser
                };
                let data;
                const userRole = currentUser?.currentUser.key;
                if (userRole) {
                    try {
                        const decrypted = CryptoJS.AES.decrypt(
                            userRole,
                            process.env.REACT_APP_CRYPTO
                        );
                        data = decrypted.toString(CryptoJS.enc.Utf8);
                    } catch (error) {
                        console.error('Decryption error:', error);
                    }
                }
                console.log(currentUser);
                setToLocalStorage('persist:auth', JSON.stringify(currentUser));
    
                if (data !== 'R1' && data !== 'R2' && currentUser.currentUser.grade === null) {
                    navigate(ROUTES.grade_choose);
                    return;
                }
    
                // dispatch(loginState(currentUser.currentUser));
    
                if (data === 'R1' || data === 'R2') {
                    navigate(ROUTES.admin);
                } else {
                    navigate(ROUTES.home);
                }
    
                // socket.on('connection', () => {
                //     console.log('User Connect');
                // });
                toast.success('Đăng nhập thành công');
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl w-full flex bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Left Side - Logo/Image */}
                <div className="hidden md:flex md:w-1/2 bg-black p-12 items-center justify-center">
                    <img
                        src={LOGO}
                        alt="Login Banner"
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3";
                        }}
                    />
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-12">
                    <div className="w-full max-w-md mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                            Welcome Back
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Username
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.username && (
                                        <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <AiOutlineEye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">



                                <button
                                    type="button"
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Forgot your password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Sign In"
                                )}
                            </button>

                            <Link to="/register">
                                <button
                                    type="button"
                                    className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Đăng kí
                                </button>
                            </Link>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <FcGoogle className="w-5 h-5" />
                                Sign in with Google
                            </button>

                            <Link to="/">
                                <button
                                    type="button"
                                    className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Trở về trang chủ
                                </button>
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};


