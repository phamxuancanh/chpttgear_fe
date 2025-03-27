import { useEffect, useMemo, useState } from "react";
import { FiUsers, FiShoppingCart } from "react-icons/fi";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LabelList } from "recharts";
import { getAllOrdersNoPaging, getProductsByListId } from "../../routers/ApiRoutes";
import Loading from "../loading";
import { RiExchangeDollarFill, RiShoppingCartFill } from "react-icons/ri";

export default function Analysis({ employees, orderDetails }) {
    const TABS = ["Doanh thu", "Sản phẩm bán chạy", "Khách hàng nhiều đơn"];
    const [orders, setOrders] = useState([]);
    const [revenue, setRevenue] = useState(null);
    const [selectedTab, setSelectedTab] = useState(TABS[0]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (selectedTab === "Doanh thu") {
            const getAllOrders = async () => {
                try {
                    const res = await getAllOrdersNoPaging();
                    setOrders(res.data);
                    console.log(res.data)
                } catch (error) {
                    console.log(error);
                }
            };
            getAllOrders();
        }
    }, []);

    const { monthlyRevenue, totalRevenue, totalProfit } = useMemo(() => {
        console.log(orders);

        const revenueMap = {};
        let totalRevenue = 0;
        let totalProfit = 0;

        orders.forEach(order => {
            const date = new Date(order.createdAt);
            const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;

            if (!revenueMap[monthYear]) {
                revenueMap[monthYear] = { revenue: 0, profit: 0 };
            }

            revenueMap[monthYear].revenue += order.total_amount;

            const orderProfit = order.order_item.reduce((sum, item) => sum + item.profit, 0);
            revenueMap[monthYear].profit += orderProfit;

            totalRevenue += order.total_amount;
            totalProfit += orderProfit;
        });

        const monthlyRevenue = Object.entries(revenueMap).map(([month, data]) => ({
            month,
            revenue: data.revenue,
            profit: data.profit
        }));

        return { monthlyRevenue, totalRevenue, totalProfit };

    }, [orders]);


    const sortedProducts = useMemo(() => {
        const productSales = {};

        orders.forEach(order => {
            order.order_item.forEach(item => {
                productSales[item.product_id] = (productSales[item.product_id] || 0) + item.quantity;
            });
        });

        return Object.entries(productSales)
            .map(([product_id, quantity]) => ({ product_id, quantity }))
            .sort((a, b) => b.quantity - a.quantity);
    }, [orders]);

    const productIds = useMemo(() => sortedProducts.map(item => item.product_id), [sortedProducts]);

    useEffect(() => {
        if (productIds.length === 0) return;

        const fetchProductDetails = async () => {
            try {
                const response = await getProductsByListId(productIds.join(','));
                const productDetails = response.data;

                const updatedData = sortedProducts.map(item => {
                    const productInfo = productDetails.find(p => p.id === item.product_id);
                    return {
                        name: productInfo ? productInfo.name : `Mã ${item.product_id}`,
                        value: item.quantity,
                    };
                });

                setBestSellingProducts(updatedData);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productIds]);



    const revenueData = [
        { name: "Jan", revenue: 4000 },
        { name: "Feb", revenue: 3000 },
        { name: "Mar", revenue: 5000 },
        { name: "Apr", revenue: 7000 },
        { name: "May", revenue: 6000 },
        { name: "Jun", revenue: 8000 }
    ];

    const topCustomers = [
        { id: 1, name: "John Doe", totalSpent: "$1200", orders: 15 },
        { id: 2, name: "Jane Smith", totalSpent: "$950", orders: 12 },
        { id: 3, name: "Michael Brown", totalSpent: "$850", orders: 10 },
        { id: 4, name: "Emily Johnson", totalSpent: "$780", orders: 9 }
    ];

    const COLORS = ["#ff8042", "#0088fe", "#00c49f", "#ffbb28"];

    return (
        <div className="h-screen bg-gray-50 flex flex-col items-center justify-center p-6 overflow-hidden">
            {loading && <Loading />}
            {/* Tổng quan hệ thống */}
            <div className="w-full max-w-7xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6">Tổng quan hệ thống</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500">Tổng doanh thu</p>
                                <h3 className="text-2xl font-bold">{totalRevenue.toLocaleString() || "5"}</h3>
                            </div>
                            <RiExchangeDollarFill className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500">Tổng đơn hàng</p>
                                <h3 className="text-2xl font-bold">{orders?.length || "5"}</h3>
                            </div>
                            <RiShoppingCartFill className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500">Tổng doanh thu</p>
                                <h3 className="text-2xl font-bold">{totalProfit.toLocaleString() || "5"}</h3>
                            </div>
                            <FiShoppingCart className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="flex space-x-6 border-b-2 pb-3 w-full max-w-4xl justify-center">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-6 py-2 text-lg font-semibold border-b-4 transition-all duration-300 ${selectedTab === tab ? "border-orange-600 text-orange-600" : "border-transparent text-gray-600 hover:text-orange-600"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Section */}
            <div className="w-full max-w-4xl flex-grow flex flex-col justify-center items-center mt-6">
                {selectedTab === "Doanh thu" && orders.length > 0 && (
                    <div className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto w-full">
                        <h2 className="text-xl font-semibold text-center mb-4">Doanh thu theo tháng</h2>
                        <div className="w-full h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={monthlyRevenue}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="month" tick={{ fontSize: 14, fill: "#333" }} />
                                    <YAxis tick={{ fontSize: 14, fill: "#333" }} />
                                    <Tooltip formatter={(value) => `${value.toLocaleString()} VND`} />
                                    <Legend formatter={(value) => <span >Doanh thu</span>} />
                                    <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {selectedTab === "Sản phẩm bán chạy" && (
                    <ResponsiveContainer width="100%" height={500}>
                        <PieChart>
                            <defs>
                                {bestSellingProducts.map((_, index) => (
                                    <linearGradient id={`gradient-${index}`} key={index} x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.7} />
                                        <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={1} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <Pie
                                data={bestSellingProducts}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={160}
                                innerRadius={80}
                                label={({ name, percent }) => `${name.length > 15 ? name.slice(0, 15) + "..." : name} (${(percent * 100).toFixed(1)}%)`}
                                labelLine={false}
                                stroke="#fff"
                                strokeWidth={2}
                            >
                                {bestSellingProducts.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: "white", color: "#fff", borderRadius: "8px" }}
                                itemStyle={{ fontSize: "14px" }}
                            />
                            <Legend
                                iconType="circle"
                                align="center"
                                layout="horizontal"
                                wrapperStyle={{ fontSize: "14px", fontWeight: "bold", marginTop: "40px" }} // Khoảng cách xa hơn & giữ chữ đầy đủ
                                formatter={(value) => <span >{value}</span>} // Giữ nguyên chữ dài
                            />
                        </PieChart>
                    </ResponsiveContainer>



                )}

                {selectedTab === "Khách hàng nhiều đơn" && (
                    <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
                        <table className="w-full text-center border-collapse">
                            <thead>
                                <tr className="bg-orange-500 text-white">
                                    <th className="py-3 px-4">Khách hàng</th>
                                    <th className="py-3 px-4">Tổng chi tiêu</th>
                                    <th className="py-3 px-4">Số đơn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topCustomers.map((customer) => (
                                    <tr key={customer.id} className="border-b hover:bg-gray-100">
                                        <td className="py-3 px-4">{customer.name}</td>
                                        <td className="py-3 px-4">{customer.totalSpent}</td>
                                        <td className="py-3 px-4">{customer.orders}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>

    )
}
