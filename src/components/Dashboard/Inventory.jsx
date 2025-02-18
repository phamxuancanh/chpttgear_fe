import React, { useEffect, useState } from "react";
import { FaPlus, FaEye, FaSearch, FaTimes } from "react-icons/fa";
import { DateConverter } from "../../utils/DateConverter";
import { MdWarehouse } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import { getAllInventory, getProductsByInventoryId, getStockInByInventoryId, getStockOutByInventoryId } from "../../routers/ApiRoutes";
import CreatePurchaseOrderModal from './../Modal/CreatePurchaseOrderModal';
import { toast } from "react-toastify";

export default function Inventory() {

    const [selectedInventory, setSelectedInventory] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [productInInventory, setProductInInventory] = useState([])
    const [inventorys, setInventorys] = useState([])
    const [products, setProducts] = useState([]);
    const [stock_outs, setStockOuts] = useState([])
    const [stock_ins, setStockIns] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateOrder, setShowCreateOrder] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllInventory();
                console.log(res.data)
                setInventorys(res.data)
            } catch (error) {
                console.error("Error fetching inventory:", error);
            }
        };
        fetchData();
    }, []);

    const handleChangeInventory = async (inventory) => {
        setSelectedInventory(inventory);
        setIsOpen(false);
        const res = await getProductsByInventoryId(inventory?.inventory_id)
        const res1 = await getStockInByInventoryId(inventory?.inventory_id)
        const res2 = await getStockOutByInventoryId(inventory?.inventory_id)
        setProductInInventory(res)
        setStockIns(res1)
        setStockOuts(res2)
    }

    // Giả sử bạn sử dụng useEffect để gọi hàm tính toán khi component mount
    // useEffect(() => {
    //     const calculateAverageCost = () => {
    //         const stockByProduct = stock_ins.reduce((acc, stock) => {
    //             if (!acc[stock.product_id]) {
    //                 acc[stock.product_id] = [];
    //             }
    //             acc[stock.product_id].push(stock.price);
    //             return acc;
    //         }, {});

    //         const updatedProducts = products.map(product => {
    //             const productStock = stockByProduct[product.product_id];
    //             if (productStock) {
    //                 const avgCost = productStock.reduce((sum, price) => sum + price, 0) / productStock.length;
    //                 return {
    //                     ...product,
    //                     cost: avgCost
    //                 };
    //             }
    //             return product;
    //         });
    //         return updatedProducts

    //     };
    //     const updatedProducts = calculateAverageCost()
    //     setProducts(updatedProducts)

    // }, []);

    const filteredProducts = productInInventory.filter(
        (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateOrder = () => {
        if (selectedInventory == null) {
            toast.error("Hãy chọn kho để nhập hàng")
            return
        }


        setShowCreateOrder(true);
    };

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setShowDetails(true);
    };

    // const handleSubmitOrder = (e) => {
    //     e.preventDefault(); // Prevent default event behavior

    //     // Check required fields
    //     if (!orderForm.quantity || !orderForm.price) {
    //         alert("Please fill all fields");
    //         return;
    //     }

    //     const quantity = parseInt(orderForm.quantity, 10);
    //     const price = parseFloat(orderForm.price);

    //     // Validate quantity and price
    //     if (isNaN(quantity) || isNaN(price) || quantity <= 0 || price <= 0) {
    //         alert("Invalid quantity or price");
    //         return;
    //     }

    //     // Ensure a product is selected
    //     if (!selectedProduct || !selectedProduct.product_id) {
    //         alert("Please select a product before placing an order.");
    //         return;
    //     }

    //     // Update product stock
    //     const updatedProducts = products.map((product) =>
    //         product.product_id === selectedProduct.product_id
    //             ? { ...product, quantity_in_stock: product.quantity_in_stock + quantity }
    //             : product
    //     );
    //     console.log("tới đây", quantity, selectedProduct)
    //     // Update purchase history
    //     const updatedHistory = [
    //         ...purchaseHistory,
    //         {
    //             productId: selectedProduct.product_id,
    //             date: new Date().toISOString(), // Converts the current time to a formatted string (dd/mm/yyyy hh:mm:ss)
    //             quantity,
    //             price,
    //         },
    //     ];

    //     // Calculate new average cost
    //     const totalQuantity = updatedHistory
    //         .filter((order) => order.productId === selectedProduct.product_id) // Get orders of the selected product
    //         .reduce((acc, order) => acc + order.quantity, 0); // Calculate total quantity

    //     const totalCost = updatedHistory
    //         .filter((order) => order.productId === selectedProduct.product_id) // Get orders of the selected product
    //         .reduce((acc, order) => acc + order.quantity * order.price, 0); // Calculate total cost

    //     const newAverageCost = totalQuantity > 0 ? totalCost / totalQuantity : 0; // Avoid division by zero

    //     // Update the selected product's price (average cost)
    //     const updatedProductWithPrice = updatedProducts.map((product) =>
    //         product.product_id === selectedProduct.product_id
    //             ? { ...product, average_cost: newAverageCost } // Update price to average cost
    //             : product
    //     );

    //     // Set the updated state values
    //     setPurchaseHistory(updatedHistory); // Set the updated purchase history
    //     setProducts(updatedProductWithPrice); // Set the updated products list

    //     // Reset the form and close modal
    //     setShowCreateOrder(false);
    //     setOrderForm({ quantity: "", price: "" });

    //     // Update selected product and products list
    //     setSelectedProduct({
    //         ...selectedProduct,
    //         quantity_in_stock: selectedProduct.quantity_in_stock + quantity, // Update stock
    //         average_cost: newAverageCost, // Update the price with the new average cost
    //     });
    // };

    // const filteredWarehouses = inventorys.filter((inventory) =>
    //     inventory.name.toLowerCase().includes(searchQuery1.toLowerCase())
    // );



    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 mt-3">Product Inventory Management</h1>
                    <button
                        onClick={() => handleCreateOrder()}
                        className="text-gray-50 hover:text-indigo-900 mr-4 bg-green-500 p-3 rounded-lg"
                    >
                        <FaPlus className="inline mr-1" /> Create Order
                    </button>

                </div>
                <div className="mb-6 flex items-center bg-white rounded-lg p-3 shadow-sm">
                    <FaSearch className="text-gray-400 mr-3" />
                    <input
                        type="text"
                        placeholder="Search products by name or code..."
                        className="flex-1 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="mb-8">
                    <label className="block text-lg font-semibold mb-2">Chọn Kho</label>
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full p-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex justify-between items-center"
                        >
                            <span className="flex items-center">
                                {selectedInventory ? (
                                    <>
                                        <MdWarehouse className="mr-2 text-blue-600" />
                                        Tên kho: {selectedInventory.name} - Địa chỉ: {selectedInventory.address} - Tồn kho: {selectedInventory.quantity_in_stock}
                                    </>
                                ) : (
                                    "Select inventory..."
                                )}
                            </span>
                            <FiChevronDown className={`transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
                        </button>
                        {isOpen && (
                            <div className="absolute w-full mt-1 max-h-48 overflow-y-auto bg-white border rounded-lg shadow-lg z-10">
                                {inventorys.map((inventory) => (
                                    <button
                                        key={inventory.inventory_id}
                                        className={`w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center ${selectedInventory?.inventory_id === inventory.inventory_id ? "bg-blue-100" : ""
                                            }`}
                                        onClick={() => {
                                            handleChangeInventory(inventory)
                                        }}
                                    >
                                        <MdWarehouse className="mr-2 text-blue-600" />
                                        Tên kho: {inventory.name} - Địa chỉ: {inventory.address} - Tồn kho: {inventory.quantity_in_stock}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá nhập trung bình</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt={product.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.cost && product.cost.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleViewDetails(product)}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            <FaEye className="inline mr-1" /> View Order Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showCreateOrder && (
                    <CreatePurchaseOrderModal setShowCreateOrder={setShowCreateOrder} productList={products} inventory={selectedInventory} />
                )}

                {showDetails && selectedProduct && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Product Details</h2>
                                <button onClick={() => setShowDetails(false)} className="text-gray-500 hover:text-gray-700">
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="mb-6">
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-xl font-bold mb-2">{selectedProduct.name}</h3>
                                <p className="text-gray-600 mb-4">Current Price: ${selectedProduct.price}</p>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold mb-3">Purchase History</h4>
                                <div className="overflow-x-auto overflow-y-auto max-h-[30vh]"> {/* Added max height for vertical scrolling */}
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                            </tr>
                                        </thead>
                                        {/* <tbody className="bg-white divide-y divide-gray-200">
                                            {purchaseHistory
                                                .filter((order) => order.productId === selectedProduct.product_id)
                                                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sorting by most recent date first
                                                .map((order, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{DateConverter(order.date)}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.price}</td>
                                                    </tr>
                                                ))}
                                        </tbody> */}
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

