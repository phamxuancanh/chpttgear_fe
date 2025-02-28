import React, { useState, useEffect, use } from "react";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { 
    findCartByUserId, findCartItemsByCartId, findAllProduct,
    updateQuantityCartItem, deleteCartItem
} from "../routers/ApiRoutes";
import {
    setCartRedux, setCartItemsRedux, addItemToCart, removeItemFromCart,
    increaseQuantityItem, decrementQuantityItem, clearCart
} from "../redux/cartSlice";

export default function Cart() {

    const dispatch = useDispatch();
    const userFromRedux = useSelector((state) => state.auth.user);
    const [cart, setCart] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const cartResponse = await findCartByUserId(userFromRedux.id);
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
                    setCart(cartResponse.data);
                    setCartItems(cartItemsMapped);
                    dispatch(setCartRedux({ cart: cartResponse.data }));
                    dispatch(setCartItemsRedux({ items: cartItemsMapped }));
                }
            } catch (error) {
                toast.error("Failed to fetch cart or cart items");
            }
        };
        if (userFromRedux?.id) {
            fetchCart();
        }
    }, [userFromRedux?.id]);

    // const updateQuantity = (productId, newQuantity) => {
    //     if (newQuantity < 1) return;
    //     setCartItems(cartItems.map(item =>
    //         item.productId === productId ? { ...item, quantity: newQuantity } : item
    //     ));
    // };

    const increateseQuantity = async (itemId, newQuantity) => {
        setCartItems(cartItems.map(item =>
            item.itemId === itemId ? { ...item, quantity: newQuantity} : item
        ));
        dispatch(increaseQuantityItem({ itemId }));
        await updateQuantityCartItem(itemId, {newQuantity} );
    };

    const decrementQuantity = async (itemId, newQuantity) => {
        setCartItems(cartItems.map(item =>
            item.itemId === itemId ? { ...item, quantity: newQuantity } : item
        ));
        dispatch(decrementQuantityItem({ itemId }));
        console.log(newQuantity);
        console.log(typeof newQuantity);
        const updateResponse = await updateQuantityCartItem(itemId, newQuantity);
        if (updateResponse.data.quantity === 0) {
            const deleteResponse = await deleteCartItem(itemId);
            if (deleteResponse.data) {
                setCartItems(cartItems.filter(item => item.itemId !== itemId));
                dispatch(removeItemFromCart({ itemId }));
            }
        };
    };

    const removeItem = (itemId) => {
        setCartItems(cartItems.filter(item => item.itemId !== itemId));
        dispatch(removeItemFromCart({ itemId }));
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
                            onClick={() => decrementQuantity(item.itemId, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                        >
                            <FiMinus className="text-gray-600" />
                        </button>
                        <span className="px-4 py-1 border rounded-md">{item.quantity}</span>
                        <button
                            onClick={() => increateseQuantity(item.itemId, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                        >
                            <FiPlus className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
            <button
                onClick={() => removeItem(item.itemId)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
            >
                <FiTrash2 size={20} />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-10/12 mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>
                {cartItems.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500 text-lg">Giỏ hàng trống</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map(item => (
                                <CartItem key={item.itemId} item={item} />
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold mb-4">Tóm tắt giỏ hàng</h2>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Sản phẩm:</span>
                                        <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Tổng thanh toán:</span>
                                        <span>${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                                <Link to='/payment'>
                                    <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200">
                                        Đến trang thanh toán
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


