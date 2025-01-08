import React, { useState } from "react";
import { FiShoppingCart, FiUser, FiMenu } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import LOGO from "../assets/logo.png"
import { Link } from "react-router-dom";

export default function Header() {

    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const products = [
        {
            name: "Microcontrollers",
            subItems: ["Arduino", "Raspberry Pi", "ESP32", "STM32"]
        },
        {
            name: "Sensors",
            subItems: ["Temperature", "Humidity", "Motion", "Pressure"]
        },
        {
            name: "LED Components",
            subItems: ["RGB LEDs", "LED Strips", "LED Modules", "Drivers"]
        },
        {
            name: "Resistors & Capacitors",
            subItems: ["Carbon Film", "Metal Film", "Ceramic", "Electrolytic"]
        },
        {
            name: "Development Boards",
            subItems: ["NodeMCU", "Arduino Nano", "Mega 2560", "PIC"]
        }
    ];

    const cartItems = [
        { id: 1, name: "Arduino UNO", price: "$24.99", image: "https://images.unsplash.com/photo-1608564697071-ddf911d81370" },
        { id: 2, name: "Sensor Kit", price: "$34.99", image: "https://images.unsplash.com/photo-1601132359864-c974e79890ac" }
    ];



    const setDropdownProduct = () => {
        setShowProductDropdown(!showProductDropdown)
        setShowCartDropdown(false)
        setShowUserDropdown(false)
    };

    const setDropdownCart = () => {
        setShowProductDropdown(false)
        setShowCartDropdown(!showCartDropdown)
        setShowUserDropdown(false)
    };

    const setDropdownUser = () => {
        setShowProductDropdown(false)
        setShowCartDropdown(false)
        setShowUserDropdown(!showUserDropdown)
    };

    const setToggle = () => {
        setIsDropdownOpen(!isDropdownOpen)
    };

    return (
        <div>
            <nav className="bg-black text-white shadow-lg py-2 sticky z-10 ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 ">

                        <Link to="/">
                            <img src={LOGO} width={200} height={200} />
                        </Link>

                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className="hover:text-blue-400 transition duration-300">
                                Trang chủ
                            </Link>
                            <div className="relative">
                                <button
                                    className="hover:text-blue-400 transition duration-300 flex items-center"
                                    onClick={() => setDropdownProduct()}
                                >
                                    Sản phẩm
                                    <IoMdArrowDropdown className="ml-1" />
                                </button>
                                {showProductDropdown && (
                                    <div
                                        className="absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white text-black"
                                    >
                                        {products.map((product, index) => (
                                            <div key={index} className="relative group">
                                                <Link
                                                    to="/products"
                                                    className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                                                >
                                                    {product.name}
                                                </Link>
                                                <div className="absolute left-full top-0 w-48 hidden group-hover:block rounded-md shadow-lg bg-white text-black">
                                                    {product.subItems.map((subItem, subIndex) => (
                                                        <a
                                                            key={subIndex}
                                                            href="#"
                                                            className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                                                        >
                                                            {subItem}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <a href="#" className="hover:text-blue-400 transition duration-300">
                                Tin tức
                            </a>
                        </div>

                        <div className="hidden md:flex items-center space-x-6">
                            <div className="relative">
                                <button
                                    className="hover:text-blue-400 transition duration-300"
                                    onClick={() => setDropdownCart()}
                                >
                                    <FiShoppingCart className="h-6 w-6" />
                                </button>
                                {showCartDropdown && (
                                    <div
                                        className="absolute  z-50 right-0 mt-2 w-72 rounded-md shadow-lg bg-white text-black"
                                    >
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold mb-3">Shopping Cart</h3>
                                            {cartItems.map((item) => (
                                                <div key={item.id} className="flex items-center gap-3 mb-3">
                                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                                    <div>
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-gray-600">{item.price}</p>
                                                    </div>
                                                    <button className="ml-auto bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600">
                                                        Add
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="w-full flex justify-center items-center ">
                                                <Link to="/cart">
                                                    <button className=" bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600">
                                                        Xem giỏ hàng
                                                    </button>
                                                </Link>

                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <button
                                    className="hover:text-blue-400 transition duration-300"
                                    onClick={() => setDropdownUser()}
                                >
                                    <FiUser className="h-6 w-6" />
                                </button>
                                {showUserDropdown && (
                                    <div
                                        className="absolute  z-50 right-0 mt-2 w-48 rounded-md shadow-lg bg-white text-black"
                                    >
                                        <Link to="/login"
                                            href="#"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                                        >
                                            {"Đăng nhập"}
                                        </Link>
                                        <Link to="/register"
                                            href="#"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                                        >
                                            {"Đăng kí"}
                                        </Link>

                                        <Link to="/orders"
                                            href="#"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                                        >
                                            {"Đơn đã đặt"}
                                        </Link>

                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md hover:text-blue-400 hover:bg-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            >
                                <FiMenu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <a
                                href="#"
                                className="block px-3 py-2 rounded-md hover:bg-gray-900 transition duration-300"
                            >
                                Trang chủ
                            </a>
                            <button
                                onClick={() => setToggle()}
                                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-900 transition duration-300 flex items-center justify-between"
                            >
                                Sản phẩm
                                <IoMdArrowDropdown />
                            </button>
                            {isDropdownOpen && (
                                <div className="pl-4 space-y-1">
                                    {products.map((product, index) => (
                                        <div key={index}>
                                            <a
                                                href="#"
                                                className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-900 transition duration-300"
                                            >
                                                {product.name}
                                            </a>
                                            <div className="pl-4">
                                                {product.subItems.map((subItem, subIndex) => (
                                                    <a
                                                        key={subIndex}
                                                        href="#"
                                                        className="block px-3 py-2 rounded-md text-gray-400 hover:bg-gray-900 transition duration-300"
                                                    >
                                                        {subItem}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <a
                                href="#"
                                className="block px-3 py-2 rounded-md hover:bg-gray-900 transition duration-300"
                            >
                                Tin tức
                            </a>
                            <div className="flex space-x-4 px-3 py-2">
                                <button className="hover:text-blue-400 transition duration-300">
                                    <FiShoppingCart className="h-6 w-6" />
                                </button>
                                <button className="hover:text-blue-400 transition duration-300">
                                    <FiUser className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
}
