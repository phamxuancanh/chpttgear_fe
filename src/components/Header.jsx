/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiBell } from "react-icons/fi";
import { FaPlus, FaMinus } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import LOGO from "../assets/logo.png"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { calculateShippingFee, getSuggestions, signOut } from "../routers/ApiRoutes";
import { IoMenu } from "react-icons/io5";
import ROUTES from '../constants/Page';
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash'
import { FiSearch } from "react-icons/fi";
import { logout, setToken } from '../redux/authSlice';
import Loading from "../utils/Loading";
import { useCategory } from "../context/CategoryContext";
import CryptoJS from 'crypto-js';
import { setCartRedux, setCartItemsRedux, clearCart } from "../redux/cartSlice";
import { findCartByUserId, findCartItemsByCartId, findAllProduct } from "../routers/ApiRoutes";
import MenuModal from "./Modal/MenuModal";

// import { setCartRedux, setCartItemsRedux, removeItemFromCart, increaseQuantityItem, decrementQuantityItem } from "../redux/cartSlice";
// import { findCartByUserId, findCartItemsByCartId, findAllProduct, updateQuantityCartItem, deleteCartItem } from "../routers/ApiRoutes";
// import MenuModal from "./Modal/MenuModal";

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdownOpenCart, setIsDropdownOpenCart] = useState(false);
    const [isDropdownOpenUser, setIsDropdownOpenUser] = useState(false);
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showBellDropdown, setShowBellDropdown] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const userRoleEncrypted = user?.key;
     let userRole;
        if (userRoleEncrypted) {
          try {
            const decrypted = CryptoJS.AES.decrypt(
              userRoleEncrypted,
              process.env.REACT_APP_CRYPTO
            );
            userRole = decrypted.toString(CryptoJS.enc.Utf8);
          } catch (error) {
            console.error('Decryption error:', error);
          }
        }
    const cartItemRedux = useSelector(state => state.shoppingCart.items);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const searchRef = useRef(null);
    const [loading, setLoading] = useState(false)
    const { isCategoryOpen, setIsCategoryOpen } = useCategory();
    const location = useLocation();

    const fetchSuggestions = debounce(async (value) => {
        try {
            const response = await getSuggestions(value);
            console.log(response);
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }, 1000);

    const handleSearchClick = async () => {
        setSuggestions([])
        const encodedSearchTerm = encodeURIComponent(searchTerm);
        navigate(`${ROUTES.SEARCH_RESULTS.path}?name=${encodedSearchTerm}`);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length > 1) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    // const [cartItems, setCartItems] = useState([
    //     {
    //         id: 1,
    //         name: "Wireless Headphones",
    //         price: 199.99,
    //         quantity: 1,
    //         image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    //     },
    //     {
    //         id: 2,
    //         name: "Smart Watch",
    //         price: 299.99,
    //         quantity: 1,
    //         image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12"
    //     },
    //     {
    //         id: 3,
    //         name: "Wireless Earbuds",
    //         price: 149.99,
    //         quantity: 1,
    //         image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df"
    //     }
    // ]);
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
        setIsCategoryOpen(!isCategoryOpen)
        if (showProductDropdown) {
            setShowProductDropdown(false)
        } else {
            setShowProductDropdown(true)
        }
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
        if (user) {
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
        setLoading(true)
        dispatch(logout())
        dispatch(clearCart());
        try {
            const response = await signOut()
            if (response) {

                // removeAllLocalStorage()
                navigate(ROUTES.LOGIN_PAGE.path)
                toast.success('Đăng xuất thành công!')
            }
            setLoading(false)
        }
        catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const cartResponse = await findCartByUserId(user.id);
                if (cartResponse.data) {
                    // Gọi API song song để tăng tốc độ
                    const [cartItemResponse, productsResponse] = await Promise.all([
                        findCartItemsByCartId(cartResponse.data.id),
                        findAllProduct()
                    ]);
                    const cartItemsMapped = cartItemResponse.data.map(item => {
                        const product = productsResponse.data.find(p => p.id === item.productId);
                        return {
                            itemId: item.id,
                            productId: item.productId,
                            name: product?.name,
                            price: parseFloat(product?.price),
                            quantity: parseInt(item.quantity),
                            image: product?.image
                        };
                    });
                    setCartItems(cartItemsMapped);
                    console.log(cartItemsMapped)
                    console.log(cartResponse.data)
                    dispatch(setCartRedux({ cart: cartResponse.data }));
                    dispatch(setCartItemsRedux({ items: cartItemsMapped }));
                }
            } catch (error) {
                console.log(error)
                toast.error("1 Lỗi khi load dữ liệu giỏ hàng");
            }
        };
        if (user?.id) {
            fetchCart();
        }
    }, [user?.id]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            dispatch(setToken(token))
        }
    }, [dispatch])

    const handleLinkClick = async () => {
        setShowProductDropdown(false);
        setShowBellDropdown(false);
        setShowCartDropdown(false);
        setShowUserDropdown(false);
    };
    useEffect(() => {
        const fetchCart = async () => {
            try {
                console.log("USer current: ", user);
                const cartResponse = await findCartByUserId(user.id);
                console.log(cartResponse.data)
                if (cartResponse.data) {
                    // Gọi API song song để tăng tốc độ
                    const [cartItemResponse, productsResponse] = await Promise.all([
                        findCartItemsByCartId(cartResponse.data.id),
                        findAllProduct()
                    ]);
                    const cartItemsMapped = cartItemResponse.data.map(item => {
                        const product = productsResponse.data.find(p => p.id === item.productId);
                        return {
                            itemId: item.id,
                            productId: item.productId,
                            name: product?.name,
                            price: parseFloat(product?.price),
                            quantity: parseInt(item.quantity),
                            image: product?.image
                        };
                    });
                    setCartItems(cartItemsMapped);
                    console.log(cartResponse.data)
                    dispatch(setCartRedux({ cart: cartResponse.data }));
                    dispatch(setCartItemsRedux({ items: cartItemsMapped }));
                }
            } catch (error) {
                console.log(error)
                toast.error("2 Lỗi load dữ liệu giỏ hàng");
            }
        };
        if (user?.id) {
            fetchCart();
        }
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSuggestions([]);
                setShowProductDropdown(false)
                // setIsCategoryOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);
    return (
        <div>
            {loading ? <Loading /> : <nav className="bg-black text-white shadow-lg py-2 sticky flex items-center justify-center z-20 ">
                <div className="w-11/12">
                    <div className="w-full flex items-center justify-between h-16  ">
                        <div className="w-1/12 ">
                            <Link to="/">
                                <img src={LOGO} width={150} height={150} />
                            </Link>
                        </div>
                        <div className="hidden md:flex w-8/12 items-center space-x-5  justify-between px-8">
                            <Link
                                to="/"
                                onClick={handleLinkClick}
                                className="relative  font-semibold text-white px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl text-base w-2/12 flex justify-center items-center"
                            >
                                <p className="text-base">Trang chủ</p>
                            </Link>
                            <div className="relative w-3/12 ">
                                <button
                                    className="relative group flex items-center gap-2 font-semibold text-white px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl text-base  "
                                    onClick={() => setDropdownProduct()}
                                >
                                    <IoMenu className={`text-xl  transition-transform duration-300 ${showProductDropdown ? "rotate-90" : ""}`} />
                                    <span>Danh mục</span>
                                </button>
                                {isCategoryOpen && location.pathname !== ROUTES.HOME_PAGE.path && (
                                    <div className="absolute top-full -left-48 w-[35vh] mt-5">
                                        <MenuModal />
                                    </div>
                                )}
                            </div>

                            <div className="container w-7/12 mx-auto px-4 py-4 flex items-center justify-between text-black ">
                                <div className="flex-1 w-10/12 flex items-center" ref={searchRef}>

                                    <div className="relative flex-grow">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            onKeyDown={handleKeyPress}
                                            placeholder="Tìm kiếm sản phẩm..."
                                            className="w-full py-2 px-4 pr-10 text-base rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring bg-card text-foreground"
                                        />
                                        <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />

                                        {suggestions?.length > 0 && (
                                            <ul className="absolute left-0 top-full mt-1 bg-white border border-gray-300 w-full max-h-96 overflow-y-auto z-50 shadow-2xl rounded-b-lg">
                                                {suggestions.map((suggestion) => (
                                                    <li
                                                        key={suggestion.id}
                                                        className="p-2 hover:bg-gray-100 hover:font-bold cursor-pointer"
                                                        onClick={() => setSearchTerm(suggestion.name)}
                                                    >
                                                        {suggestion.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleSearchClick}
                                        className="ml-1 px-4 py-2 w-[15vh] bg-green-200 text-base font-semibold  text-black rounded-md hover:bg-primary-dark transition-colors"
                                    >
                                        Tìm kiếm
                                    </button>
                                </div>
                            </div>
                            <a
                                href="#"
                                className="relative font-semibold w-[17vh] flex justify-center items-center text-white px-4 py-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Tin tức
                            </a>
                        </div>

                        <div className="w-3/12 hidden md:flex items-center justify-between px-10 space-x-6 ">
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

                                    {cartItemRedux.length >= 0 && (
                                        <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartItemRedux.length}
                                        </span>
                                    )}
                                </button>
                                {showCartDropdown && (
                                    <div
                                        className="absolute  z-50 right-0 mt-2 w-[48vh]  rounded-md shadow-lg bg-white text-black"
                                    >
                                        <div className="py-4 px-2">
                                            <h3 className="font-medium mb-3 text-base text-gray-400 ml-2">Sản phẩm mới thêm</h3>
                                            {cartItemRedux.length > 0 && cartItemRedux.slice(0, 3).map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="p-4 border-b border-gray-200 flex items-center gap-4"
                                                >
                                                    <img
                                                        src={item.image ? item.image.split(',')[0] : "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3"}
                                                        alt={item.name}
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "https://images.unsplash.com/photo-1576566588028-4147f3842f27";
                                                        }}
                                                    />
                                                    <div className="flex-1 w-8/12 ">
                                                        <h3 className="font-medium text-gray-800 truncate ">{item.name}</h3>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="w-full flex justify-between items-center px-2">
                                                <h5 className="font-normal mb-3 text-xs text-gray-500 mt-5">{cartItemRedux.length} sản phẩm thêm vào vỏ hàng</h5>
                                                <Link to="/cart" onClick={handleLinkClick}>
                                                    <button className=" bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 mt-3">
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
                                        {isLoggedIn ? (
                                            <>
                                                <img src={user.avatar ? user?.avatar : "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3"} alt="avatar" className="w-8 h-8 rounded-full" />
                                                <div>
                                                    <div>Xin chào</div>
                                                    <div className="font-bold">
                                                        {user.firstName || user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
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
                                {showUserDropdown && user && (
                                    <div className="absolute z-50 right-0 mt-2 w-48 rounded-md shadow-lg bg-white text-black">
                                        {!user ? (
                                            <>
                                                <Link onClick={handleLinkClick}
                                                    to="/login"
                                                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300 rounded-md"
                                                >
                                                    Đăng nhập
                                                </Link>
                                                <Link onClick={handleLinkClick}
                                                    to="/register"
                                                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300 rounded-md"
                                                >
                                                    Đăng kí
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link onClick={handleLinkClick}
                                                    to="/profile"
                                                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300 rounded-md"
                                                >
                                                    Hồ sơ
                                                </Link>

                                                    {userRole === 'R1' && (
                                                        <Link
                                                            onClick={handleLinkClick}
                                                            to="/dashboard"
                                                            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300 rounded-md"
                                                        >
                                                            Vào trang quản lý
                                                        </Link>
                                                    )}

                                                <Link
                                                    onClick={handleLinkClick}
                                                    to="/orders"
                                                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300 rounded-md"
                                                >
                                                    Đơn đã đặt
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-start px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300 rounded-md"
                                                >
                                                    Đăng xuất
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
                                                <img src={item.image ? item.image.split(',')[0] : "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3"} alt={item.name} className="w-12 h-12 object-cover rounded" />
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
                                        {user ? (
                                            <>
                                                <img src={user.avatar ? user.avatar : "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3"} alt="avatar" className="w-8 h-8 rounded-full" />
                                                <div>
                                                    <div>Xin chào</div>
                                                    <div className="font-bold">{user.firstName} {user.lastName}</div>
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
                                        {!user ? (
                                            <>
                                                <Link
                                                    onClick={handleLinkClick}
                                                    to="/login"
                                                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300 rounded-md"
                                                >
                                                    Đăng nhập
                                                </Link>
                                                <Link
                                                    onClick={handleLinkClick}
                                                    to="/register"
                                                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300 rounded-md"
                                                >
                                                    Đăng kí
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    onClick={handleLinkClick}
                                                    to="/profile"
                                                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300 rounded-md"
                                                >
                                                    Hồ sơ
                                                </Link>
                                                <Link
                                                    onClick={handleLinkClick}
                                                    to="/dashboard"
                                                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300 rounded-md"
                                                >
                                                    Vào trang quản lý
                                                </Link>
                                                <Link
                                                    onClick={handleLinkClick}
                                                    to="/orders"
                                                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300 rounded-md"
                                                >
                                                    Đơn đã đặt
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        handleLogout();
                                                    }}
                                                    className="flex items-start w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300 rounded-md"
                                                >
                                                    Đăng xuất
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </nav>}
        </div>
    );
}