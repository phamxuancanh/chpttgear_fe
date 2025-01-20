import React, { useState } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiBell } from "react-icons/fi";
import { FaPlus, FaMinus } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import LOGO from "../assets/logo.png"
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../routers/ApiRoutes";
import { getFromLocalStorage, removeAllLocalStorage } from "../utils/functions";
import ROUTES from '../constants/Page';
import { toast } from "react-toastify";
export default function Header() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdownOpenCart, setIsDropdownOpenCart] = useState(false);
    const [isDropdownOpenUser, setIsDropdownOpenUser] = useState(false);
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showBellDropdown, setShowBellDropdown] = useState(false);

    const ls = getFromLocalStorage('persist:auth');
    const currentUser = ls?.currentUser

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

    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Wireless Headphones",
            price: 199.99,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
        },
        {
            id: 2,
            name: "Smart Watch",
            price: 299.99,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12"
        },
        {
            id: 3,
            name: "Wireless Earbuds",
            price: 149.99,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df"
        }
    ]);
    const updateQuantity = (id, action) => {
        setCartItems(prevItems =>
            prevItems.map(item => {
                if (item.id === id) {
                    const newQuantity = action === "increase"
                        ? Math.min(item.quantity + 1, 10)
                        : Math.max(item.quantity - 1, 0);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(item => item.quantity > 0)
        );
    };


    const setDropdownProduct = () => {
        setShowProductDropdown(!showProductDropdown)
        setShowCartDropdown(false)
        setShowUserDropdown(false)
        setShowBellDropdown(false)
    };

    const setDropdownCart = () => {
        setShowProductDropdown(false)
        setShowCartDropdown(!showCartDropdown)
        setShowUserDropdown(false)
        setShowBellDropdown(false)
    };

    const setDropdownUser = () => {
        if (currentUser) {
            setShowProductDropdown(false)
            setShowCartDropdown(false)
            setShowUserDropdown(!showUserDropdown)
            setShowBellDropdown(false)
        }
        else {
            navigate(ROUTES.LOGIN_PAGE.path)
        }
    };
    const setDropdownBell = () => {
        setShowProductDropdown(false)
        setShowCartDropdown(false)
        setShowUserDropdown(false)
        setShowBellDropdown(!showBellDropdown)
    };

    const setToggle = () => {
        setIsDropdownOpen(!isDropdownOpen)
    };
    const setToggleCart = () => {
        setIsDropdownOpenCart(!isDropdownOpenCart)
    };
    const setToggleUser = () => {
        setIsDropdownOpenUser(!isDropdownOpenUser)
    };
    const handleLogout = async () => {
        try {
            const response = await signOut()
            if (response) {
                removeAllLocalStorage()
                navigate(ROUTES.LOGIN_PAGE.path)
                toast.success('Đăng xuất thành công!')
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <div>
            <nav className="bg-black text-white shadow-lg py-2 sticky z-10 ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 ">

                        <Link to="/">
                            <img src={LOGO} width={100} height={100} />
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
                                                        <Link to="/products"
                                                            key={subIndex}

                                                            className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                                                        >
                                                            {subItem}
                                                        </Link>
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
                                    onClick={() => setDropdownBell()}
                                >
                                    <FiBell className="h-6 w-6" />

                                </button>
                                {showBellDropdown && (
                                    <div
                                        className="absolute  z-50 right-0 mt-2 w-72 rounded-md shadow-lg bg-white text-black"
                                    >
                                        <div className="p-4 min-h-[40vh] max-h-[40vh]">
                                            <span className="font-bold w-full flex justify-center items-center text-[15px]">THÔNG BÁO</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <button
                                    className="hover:text-blue-400 transition duration-300"
                                    onClick={() => setDropdownCart()}
                                >
                                    <FiShoppingCart className="h-6 w-6" />

                                    {cartItems.length > 0 && (
                                        <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </button>
                                {showCartDropdown && (
                                    <div
                                        className="absolute  z-50 right-0 mt-2 w-[48vh] rounded-md shadow-lg bg-white text-black"
                                    >
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold mb-3">Shopping Cart</h3>
                                            {cartItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="p-4 border-b border-gray-200 flex items-center gap-4"
                                                >
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "https://images.unsplash.com/photo-1576566588028-4147f3842f27";
                                                        }}
                                                    />
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                                                        <div className="mt-1 flex items-center gap-4">
                                                            <div className="flex items-center border rounded-lg">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, "decrease")}
                                                                    className="p-2 hover:bg-gray-100 transition-colors duration-200"
                                                                    aria-label="Decrease quantity"
                                                                >
                                                                    <FaMinus className="w-3 h-3 text-gray-600" />
                                                                </button>
                                                                <span className="px-4 py-2 text-gray-700">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, "increase")}
                                                                    className="p-2 hover:bg-gray-100 transition-colors duration-200"
                                                                    aria-label="Increase quantity"
                                                                >
                                                                    <FaPlus className="w-3 h-3 text-gray-600" />
                                                                </button>
                                                            </div>
                                                            <span className="text-gray-600">
                                                                ${(item.price * item.quantity).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
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
                                    <div className="p-2 flex items-center space-x-2 border border-white rounded-lg">
                                        {currentUser ? (
                                            <>
                                                <img src={currentUser.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                                                <div>
                                                    <div>Xin chào</div>
                                                    <div className="font-bold">
                                                        {currentUser.firstName || currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser.username}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <FiUser className="h-6 w-6" />
                                                <div className="font-bold">Đăng nhập</div>
                                            </div>
                                        )}
                                    </div>
                                </button>
                                {showUserDropdown && currentUser && (
                                    <div
                                        className="absolute  z-50 right-0 mt-2 w-48 rounded-md shadow-lg bg-white text-black"
                                    >
                                        {!currentUser && (
                                            <>
                                                <Link to="/login"
                                                    href="#"
                                                    className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                                                >
                                                    {"Đăng nhập"}
                                                </Link>
                                                <Link to="/register"
                                                    className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                                                >
                                                    {"Đăng kí"}
                                                </Link>
                                            </>
                                        )}
                                        {currentUser && (
                                            <>
                                                <Link to="/profile"
                                                    className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                                                >
                                                    {"Hồ sơ"}
                                                </Link>
                                                <Link to="/orders"
                                                    className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                                                >
                                                    {"Đơn hàng của tôi"}
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-start px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                                                >
                                                    {"Đăng xuất"}
                                                </button>
                                            </>
                                        )}
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
                            <Link to="/"

                                className="block px-3 py-2 rounded-md hover:bg-gray-900 transition duration-300"
                            >
                                Trang chủ
                            </Link>

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
                                            <Link to="/products"
                                                href="#"
                                                className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-900 transition duration-300"
                                            >
                                                {product.name}
                                            </Link>
                                            <div className="pl-4">
                                                {product.subItems.map((subItem, subIndex) => (
                                                    <Link to="/products"
                                                        key={subIndex}

                                                        className="block px-3 py-2 rounded-md text-gray-400 hover:bg-gray-900 transition duration-300"
                                                    >
                                                        {subItem}
                                                    </Link>
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
                            <div className=" space-x-4 px-3 py-2">
                                <button
                                    onClick={() => setToggleCart()}
                                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-900 transition duration-300 flex items-center justify-between"
                                >
                                    <FiShoppingCart className="h-6 w-6" />
                                    <IoMdArrowDropdown />
                                </button>

                                {isDropdownOpenCart && (
                                    <div className="pl-4 space-y-1">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 mb-3">
                                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-white">{item.price}</p>
                                                </div>
                                                <button className="ml-auto bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600">
                                                    Add
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                            <div className=" space-x-4 px-3 py-2">
                                <button
                                    onClick={() => setToggleUser()}
                                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-900 transition duration-300 flex items-center justify-between"
                                >
                                    <div className="p-2 flex items-center space-x-2 border border-white rounded-lg">
                                        {currentUser ? (
                                            <>
                                                <img src={currentUser.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                                                <div>
                                                    <div>Xin chào</div>
                                                    <div className="font-bold">{currentUser.firstName} {currentUser.lastName}</div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <FiUser className="h-6 w-6" />
                                                <div className="font-bold">Đăng nhập</div>
                                            </div>
                                        )}
                                    </div>
                                    <IoMdArrowDropdown />
                                </button>

                                {isDropdownOpenUser && (
                                    <div className="pl-4 space-y-1">
                                        {!currentUser && (
                                            <>
                                                <Link to="/login"
                                                    href="#"
                                                    className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                                                >
                                                    {"Đăng nhập"}
                                                </Link>
                                                <Link to="/register"
                                                    className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                                                >
                                                    {"Đăng kí"}
                                                </Link>
                                            </>
                                        )}

                                        {currentUser && (
                                            <>
                                                <Link to="/profile"
                                                    className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                                                >
                                                    {"Hồ sơ"}
                                                </Link>
                                                <Link to="/orders"
                                                    className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                                                >
                                                    {"Đơn đã đặt"}
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-start w-full px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition duration-300"
                                                >
                                                    {"Đăng xuất"}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
}
