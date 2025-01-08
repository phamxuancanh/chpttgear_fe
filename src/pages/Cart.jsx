import React, { useState } from "react";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Cart() {

    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "High-Performance Gaming GPU",
            price: 699.99,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1591488320449-011701bb6704"
        },
        {
            id: 2,
            name: "RGB Mechanical Keyboard",
            price: 159.99,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1595044426077-d36d9236d54a"
        },
        {
            id: 3,
            name: "Gaming Mouse",
            price: 79.99,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46"
        }
    ]);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const CartItem = ({ item }) => (
        <div className="flex items-center justify-between p-4 mb-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center space-x-4 flex-1">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9";
                    }}
                />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    <div className="flex items-center space-x-2 mt-2">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                        >
                            <FiMinus className="text-gray-600" />
                        </button>
                        <span className="px-4 py-1 border rounded-md">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                        >
                            <FiPlus className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
            <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
            >
                <FiTrash2 size={20} />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-10/12 mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500 text-lg">Your cart is empty</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map(item => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Items:</span>
                                        <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Total:</span>
                                        <span>${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                                <Link to='/payment'>
                                    <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200">
                                        Proceed to Checkout
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


