import { useEffect, useState } from "react";
import { FiHome, FiUsers, FiBox, FiShoppingCart, FiEdit, FiTrash2, FiLogOut, FiPackage, FiEye, FiX } from "react-icons/fi";
import { setStockIns, setStockOuts } from "../../redux/inventorySlice";
import { getAllStockIn, getAllStockOut } from "../../routers/ApiRoutes";
import { useDispatch } from "react-redux";
import Loading from "../loading";


export default function Analysis() {
    const products = [
        { id: 1, name: "Product 1", category: "Electronics", price: "$999", stock: 50, image: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?ixlib=rb-1.2.1" },
        { id: 2, name: "Product 2", category: "Clothing", price: "$59", stock: 100, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-1.2.1" },
        { id: 3, name: "Product 3", category: "Accessories", price: "$29", stock: 75, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1" }
    ];

    const employees = [
        { id: 1, name: "John Doe", role: "Manager", status: "active", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1" },
        { id: 2, name: "Jane Smith", role: "Developer", status: "active", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1" },
        { id: 3, name: "Mike Johnson", role: "Designer", status: "inactive", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1" }
    ];

    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [stockIns, stockOuts] = await Promise.all([
                    getAllStockIn(),
                    getAllStockOut()

                ]);
                dispatch(setStockIns(stockIns || []))
                dispatch(setStockOuts(stockOuts || []))

            } catch (error) {
                console.error("Error fetching inventory:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [])



    const orderDetails = [
        {
            id: "ORD001",
            customer: "Alice Brown",
            status: "Pending",
            date: "2024-01-15",
            items: [
                { productId: 1, quantity: 2, price: "$1998" },
                { productId: 2, quantity: 1, price: "$59" }
            ]
        },
        {
            id: "ORD002",
            customer: "Bob Wilson",
            status: "Completed",
            date: "2024-01-14",
            items: [
                { productId: 3, quantity: 3, price: "$87" }
            ]
        },
        {
            id: "ORD003",
            customer: "Carol White",
            status: "Processing",
            date: "2024-01-13",
            items: [
                { productId: 1, quantity: 1, price: "$999" },
                { productId: 3, quantity: 2, price: "$58" }
            ]
        }
    ];
    return (
        <div className="flex-1 p-8">
            {loading ? <Loading /> : <div>
                <h2 className="text-2xl font-semibold mb-6">Tổng quan hệ thống</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500">Lợi nhuận</p>
                                <h3 className="text-2xl font-bold">{employees.length}</h3>
                            </div>
                            <FiUsers className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500">Tồn kho</p>
                                <h3 className="text-2xl font-bold">{products.length}</h3>
                            </div>
                            <FiBox className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500">Tổn đơn hàng</p>
                                <h3 className="text-2xl font-bold">{orderDetails.length}</h3>
                            </div>
                            <FiShoppingCart className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                </div>
            </div>}

        </div>
    )
}
