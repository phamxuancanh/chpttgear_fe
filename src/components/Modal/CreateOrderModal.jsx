import React, { useState, useEffect, useCallback } from "react";
import { FaTrash, FaEdit, FaPlus, FaTimes, FaSearch } from "react-icons/fa";

export default function CreateOrderModal({ orders, setOrders, setShowForm, setNotification }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [formData, setFormData] = useState({
        productId: "",
        quantity: "",
        price: "",
        notes: ""
    });


    const products = [
        { id: 1, name: "Laptop", basePrice: 999.99, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853" },
        { id: 2, name: "Smartphone", basePrice: 699.99, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9" },
        { id: 3, name: "Headphones", basePrice: 199.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" },
        { id: 4, name: "Tablet", basePrice: 499.99, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0" }
    ];
    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
    };

    const filteredProducts = useCallback(
        () => products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [searchQuery]
    );
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "productId") {
            const product = products.find(p => p.id === parseInt(value));
            setFormData(prev => ({
                ...prev,
                [name]: value,
                price: product ? (product.basePrice * (prev.quantity || 1)).toFixed(2) : ""
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                price: name === "quantity" ?
                    (products.find(p => p.id === parseInt(prev.productId))?.basePrice * parseInt(value) || 0).toFixed(2) :
                    prev.price
            }));
        }
    };

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleProductSelect = useCallback((productId) => {
        const product = products.find(p => p.id === productId);
        setFormData(prev => ({
            ...prev,
            productId: productId.toString(),
            price: product ? (product.basePrice * (prev.quantity || 1)).toFixed(2) : ""
        }));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.productId || !formData.quantity || !formData.price) {
            showNotification("Please fill all required fields", "error");
            return;
        }
        const newOrder = {
            id: orders.length + 1,
            ...formData,
            status: "Pending"
        };
        setOrders(prev => [...prev, newOrder]);
        setFormData({ productId: "", quantity: "", price: "", notes: "" });
        setShowForm(false);
        showNotification("Order created successfully", "success");
    };

    const filteredProductsList = filteredProducts();

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Create New Order</h2>
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                        {filteredProductsList.map(product => (
                            <div
                                key={product.id}
                                onClick={() => handleProductSelect(product.id)}
                                className={`cursor-pointer p-4 border rounded-lg ${formData.productId === product.id.toString() ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-32 object-cover rounded-lg mb-2"
                                />
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="text-gray-600">${product.basePrice}</p>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                min="1"
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-lg bg-gray-100"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-lg"
                                rows="3"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                        >
                            Submit Order
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
