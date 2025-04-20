import { useState, useEffect } from "react";
import { FiHome, FiUsers, FiBox, FiShoppingCart, FiEdit, FiTrash2, FiLogOut, FiPackage, FiEye, FiX, FiMessageCircle, FiBookmark  } from "react-icons/fi";
import LOGO from '../assets/logo.png'
import Employee from "../components/Dashboard/Employee";
import Products from "../components/Dashboard/Products";
import Order from "../components/Dashboard/Order";
import Analysis from "../components/Dashboard/Analysis";
import Inventory from './../components/Dashboard/Inventory';
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../routers/ApiRoutes";
import { removeAllLocalStorage } from "../utils/functions";
import { toast } from "react-toastify";
import ROUTES from "../constants/Page";
import Chats from "../components/Dashboard/Chats";
import Loading from "../utils/Loading";
import { useDispatch } from "react-redux";
import { setAllProductsInInventory, setSelectedInventory } from "../redux/inventorySlice";
import Reviews from "../components/Dashboard/Reviews";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("analysis");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const logout = async () => {
        try {
            setLoading(true)
            const response = await signOut();
            if (response) {
                removeAllLocalStorage();
                navigate(ROUTES.LOGIN_PAGE.path);
                toast.success("Đăng xuất thành công!");
            }
            setLoading(false)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    };

    // Use useEffect to handle logout
    useEffect(() => {
        if (activeTab === "logout") {
            logout();
        }
    }, [activeTab]); // Trigger logout when activeTab changes to 'logout'

    const NavItem = ({ icon: Icon, text, tabName }) => (
        <button
            onClick={() => {
                setActiveTab(tabName)
                dispatch(setAllProductsInInventory([]))
                dispatch(setSelectedInventory(null));
            }}
            className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors ${activeTab === tabName ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }`}
        >
            <Icon className="w-5 h-5 mr-3 font-bold" />
            <span>{text}</span>
        </button>
    );

    return (
        <div>
            {loading ? <Loading /> : <div className="flex min-h-screen bg-gray-50">
                <div className="w-64 bg-white p-4 shadow-lg">
                    <div className="mb-8">
                        <img src={LOGO} alt="Logo" width={200} height={200} />
                    </div>
                    <Link

                        to="/"
                        className="flex items-center w-full p-3 mb-2 rounded-lg transition-colors bg-gray-200 shadow-md font-semibold"
                    >
                        Quay lại trang chủ
                    </Link>

                    <nav>
                        <NavItem icon={FiHome} text="Thống kê" tabName="analysis" />
                        {/* <NavItem icon={FiUsers} text="Quản lý nhân viên" tabName="employees" /> */}
                        <NavItem icon={FiBox} text="Quản lý sản phẩm" tabName="products" />
                        <NavItem icon={FiShoppingCart} text="Quản lý đơn hàng" tabName="orders" />
                        <NavItem icon={FiPackage} text="Quản lý kho" tabName="inventories" />
                        {/* <NavItem icon={FiMessageCircle} text="Quản lý tin nhắn" tabName="chats" /> */}
                        <NavItem icon={FiBookmark} text="Phân tích đánh giá" tabName="reviews" />
                        <NavItem icon={FiLogOut} text="Đăng xuất" tabName="logout" />
                    </nav>
                </div>

                <div className="flex-1 p-8">
                    {/* {activeTab === "employees" && <Employee />} */}
                    {activeTab === "products" && <Products />}
                    {activeTab === "orders" && <Order />}
                    {activeTab === "analysis" && <Analysis />}
                    {activeTab === "inventories" && <Inventory />}
                    {activeTab === "reviews" && <Reviews />}
                    {activeTab === "chats" && <Chats />}
                </div>
            </div>}
        </div>
    );
}

