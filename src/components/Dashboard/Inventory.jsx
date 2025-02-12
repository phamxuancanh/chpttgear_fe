import React, { useEffect, useState } from "react";
import { FaPlus, FaEye, FaSearch, FaTimes } from "react-icons/fa";
import { DateConverter } from "../../utils/DateConverter";
import { MdWarehouse } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import { getAllInventory } from "../../routers/ApiRoutes";

export default function Inventory() {

    const [selectedInventory, setSelectedInventory] = useState(null);
    const [searchQuery1, setSearchQuery1] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [inventorys, setInventorys] = useState([])

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



    const [products, setProducts] = useState(
        [
            {
                id: 1,
                code: "CPU001",
                average_cost: 0,
                name: "Intel i9 Processor",
                image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3",
                stock: 8
            },
            {
                id: 2,
                code: "GPU002",
                name: "GPU002",
                average_cost: 0,
                image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-4.0.3",
                stock: 2
            },
            {
                id: 3,
                code: "RAM003",
                name: "32GB DDR5 RAM",
                average_cost: 0,
                image: "https://images.unsplash.com/photo-1562976540-1502c2145186?ixlib=rb-4.0.3",
                stock: 10
            }
        ]);

    const [purchaseHistory, setPurchaseHistory] = useState([
        { productId: 1, date: "2024-01-15", quantity: 5, price: 10 },
        { productId: 1, date: "2024-01-10", quantity: 3, price: 20 },
        { productId: 2, date: "2024-01-12", quantity: 2, price: 30 },
        { productId: 3, date: "2024-01-14", quantity: 10, price: 40 },
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateOrder, setShowCreateOrder] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [orderForm, setOrderForm] = useState({
        quantity: "",
        price: ""
    });

    useEffect(() => {
        // Function to recalculate the average cost for each product
        const recalculateAverageCost = () => {
            const updatedProducts = products.map((product) => {
                // Get all purchase history for this product
                const productHistory = purchaseHistory.filter(
                    (order) => order.productId === product.id
                );

                // Calculate total quantity and total cost
                const totalQuantity = productHistory.reduce((acc, order) => acc + order.quantity, 0);
                const totalCost = productHistory.reduce((acc, order) => acc + order.quantity * order.price, 0);

                // Calculate the new average cost
                const newAverageCost = totalQuantity > 0 ? totalCost / totalQuantity : 0;

                // Return updated product with new average cost
                return {
                    ...product,
                    average_cost: newAverageCost,
                };
            });

            // Set updated products with recalculated average costs
            setProducts(updatedProducts);
        };

        // Call the function to recalculate average costs when the component is mounted or when purchaseHistory changes
        recalculateAverageCost();
    }, [purchaseHistory]);

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateOrder = (product) => {
        setSelectedProduct(product);
        setShowCreateOrder(true);
    };

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setShowDetails(true);
    };

    const handleSubmitOrder = (e) => {
        e.preventDefault(); // Prevent default event behavior

        // Check required fields
        if (!orderForm.quantity || !orderForm.price) {
            alert("Please fill all fields");
            return;
        }

        const quantity = parseInt(orderForm.quantity, 10);
        const price = parseFloat(orderForm.price);

        // Validate quantity and price
        if (isNaN(quantity) || isNaN(price) || quantity <= 0 || price <= 0) {
            alert("Invalid quantity or price");
            return;
        }

        // Ensure a product is selected
        if (!selectedProduct || !selectedProduct.id) {
            alert("Please select a product before placing an order.");
            return;
        }

        // Update product stock
        const updatedProducts = products.map((product) =>
            product.id === selectedProduct.id
                ? { ...product, stock: product.stock + quantity }
                : product
        );

        // Update purchase history
        const updatedHistory = [
            ...purchaseHistory,
            {
                productId: selectedProduct.id,
                date: new Date().toISOString(), // Converts the current time to a formatted string (dd/mm/yyyy hh:mm:ss)
                quantity,
                price,
            },
        ];

        // Calculate new average cost
        const totalQuantity = updatedHistory
            .filter((order) => order.productId === selectedProduct.id) // Get orders of the selected product
            .reduce((acc, order) => acc + order.quantity, 0); // Calculate total quantity

        const totalCost = updatedHistory
            .filter((order) => order.productId === selectedProduct.id) // Get orders of the selected product
            .reduce((acc, order) => acc + order.quantity * order.price, 0); // Calculate total cost

        const newAverageCost = totalQuantity > 0 ? totalCost / totalQuantity : 0; // Avoid division by zero

        // Update the selected product's price (average cost)
        const updatedProductWithPrice = updatedProducts.map((product) =>
            product.id === selectedProduct.id
                ? { ...product, average_cost: newAverageCost } // Update price to average cost
                : product
        );

        // Set the updated state values
        setPurchaseHistory(updatedHistory); // Set the updated purchase history
        setProducts(updatedProductWithPrice); // Set the updated products list

        // Reset the form and close modal
        setShowCreateOrder(false);
        setOrderForm({ quantity: "", price: "" });

        // Update selected product and products list
        setSelectedProduct({
            ...selectedProduct,
            stock: selectedProduct.stock + quantity, // Update stock
            average_cost: newAverageCost, // Update the price with the new average cost
        });
    };

    // const filteredWarehouses = inventorys.filter((inventory) =>
    //     inventory.name.toLowerCase().includes(searchQuery1.toLowerCase())
    // );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Inventory Management</h1>

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
                                        Tên kho: {selectedInventory.name} - Địa chỉ: {selectedInventory.address}
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
                                            setSelectedInventory(inventory);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <MdWarehouse className="mr-2 text-blue-600" />
                                        Tên kho: {inventory.name} - Địa chỉ: {inventory.address}
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Cost</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.average_cost.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleCreateOrder(product)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            <FaPlus className="inline mr-1" /> Create Order
                                        </button>
                                        <button
                                            onClick={() => handleViewDetails(product)}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            <FaEye className="inline mr-1" /> View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showCreateOrder && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Create Purchase Order</h2>
                                <button onClick={() => setShowCreateOrder(false)} className="text-gray-500 hover:text-gray-700">
                                    <FaTimes />
                                </button>
                            </div>
                            <form onSubmit={handleSubmitOrder}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Product</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-lg"
                                        value={selectedProduct?.name}
                                        disabled
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded-lg"
                                        value={orderForm.quantity}
                                        onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded-lg"
                                        value={orderForm.price}
                                        onChange={(e) => setOrderForm({ ...orderForm, price: e.target.value })}
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                                >
                                    Create Order
                                </button>
                            </form>
                        </div>
                    </div>
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
                                <p className="text-gray-600 mb-1">Code: {selectedProduct.code}</p>
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
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {purchaseHistory
                                                .filter((order) => order.productId === selectedProduct.id)
                                                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sorting by most recent date first
                                                .map((order, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{DateConverter(order.date)}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.price}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
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

