import React, { useState, useEffect, use } from "react";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
    findCartItemsByCartId, findAllProduct,
    updateQuantityCartItem, deleteCartItem,
    getAllStockIn,
    getAllStockOut
} from "../routers/ApiRoutes";
import {
    setCartRedux, setCartItemsRedux, setSelectedItemsRedux, addItemToCart, removeItemFromCart,
    increaseQuantityItem,
    decrementQuantityItem,
} from "../redux/cartSlice";
import { FaDongSign } from "react-icons/fa6";
import Loading from './../utils/Loading';

export default function Cart() {

    const dispatch = useDispatch();
    const selectedItemFromRedux = useSelector(state => state.shoppingCart.selectItems);
    const cartFromRedux = useSelector((state) => state.shoppingCart.cart);
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState(selectedItemFromRedux);
    const [loading, setLoading] = useState(false)
    const [stockIns, setStockIns] = useState([])
    const [stockOuts, setStockOuts] = useState([])

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true)
            try {
                const [cartItemResponse, productsResponse, stockIns, stockOuts] = await Promise.all([
                    findCartItemsByCartId(cartFromRedux.id),
                    findAllProduct(),
                    getAllStockIn(),
                    getAllStockOut()

                ]);
                const cartItemsMapped = cartItemResponse.data.map(item => {
                    const product = productsResponse.data.find(p => p.id === item.productId);
                    return {
                        itemId: item.id,
                        productId: item.productId,
                        name: product?.name,
                        price: parseFloat(product?.price),
                        quantity: parseInt(item.quantity),
                        image: product?.image,
                        weight: product?.weight,
                        size: product?.size

                    };
                });
                setStockOuts(stockOuts)
                setStockIns(stockIns)
                setCartItems(cartItemsMapped);
                dispatch(setCartItemsRedux({ items: cartItemsMapped }));
                setLoading(false)
            } catch (error) {
                toast.error("Lỗi load dữ liệu giỏ hàng");
            } finally {
                setLoading(false)
            }
        };
        if (cartFromRedux?.id) {
            fetchCart();
        }
    }, [cartFromRedux?.id]);


    const increateseQuantity = async (item, newQuantity) => {
        const itemId = item.itemId;

        const quantityInStock = getProductStock(item.productId);
        if (newQuantity > quantityInStock) {
            toast.error("Số lượng không đủ");
            return;
        }

        // Cập nhật số lượng trong giỏ hàng
        setCartItems(cartItems.map(i =>
            i.itemId === itemId ? { ...i, quantity: newQuantity } : i
        ));
        dispatch(increaseQuantityItem({ itemId }));

        try {
            await updateQuantityCartItem(itemId, newQuantity);

            // Kiểm tra sản phẩm có trong selectedItems chưa
            let updatedItems = [...selectedItems];
            const existingItemIndex = updatedItems.findIndex(i => i.itemId === itemId);

            if (existingItemIndex !== -1) {
                // Nếu đã có trong selectedItems, tăng số lượng
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + 1
                };
            } else {
                // Nếu chưa có, thêm mới với số lượng = 1
                updatedItems.push({ ...item, quantity: newQuantity });
            }

            // Cập nhật Redux & state
            dispatch(setSelectedItemsRedux({ selectItems: updatedItems }));
            setSelectedItems(updatedItems);

        } catch (error) {
            toast.error("Lỗi cập nhật số lượng sản phẩm");
        }
    };


    const getProductStock = (productId) => {
        const stockIn = stockIns
            .filter(item => item.product_id === productId)
            .reduce((acc, item) => acc + item.quantity, 0);

        const stockOut = stockOuts
            .filter(item => item.product_id === productId)
            .reduce((acc, item) => acc + item.quantity, 0);

        return stockIn - stockOut;
    };

    const decrementQuantity = async (item) => {
        const itemId = item.itemId;
        const newQuantity = item.quantity - 1; // Giảm 1 mỗi lần click

        try {
            if (newQuantity === 0) {
                // Nếu số lượng về 0, xóa item khỏi giỏ hàng & Redux
                await deleteCartItem(itemId);
                setCartItems(cartItems.filter(i => i.itemId !== itemId));
                dispatch(removeItemFromCart({ itemId }));

                // Xóa luôn khỏi selectedItems
                const updatedItems = selectedItems.filter(i => i.itemId !== itemId);
                dispatch(setSelectedItemsRedux({ selectItems: updatedItems }));
                setSelectedItems(updatedItems);
            } else {
                // Nếu còn số lượng, cập nhật vào Redux
                dispatch(decrementQuantityItem({ itemId })); // Gọi Redux để cập nhật số lượng
                await updateQuantityCartItem(itemId, newQuantity);

                // Cập nhật state giỏ hàng
                setCartItems(cartItems.map(i =>
                    i.itemId === itemId ? { ...i, quantity: newQuantity } : i
                ));

                // Cập nhật selectedItems nếu item có trong danh sách
                const updatedItems = selectedItems.map(i =>
                    i.itemId === itemId ? { ...i, quantity: newQuantity } : i
                );
                dispatch(setSelectedItemsRedux({ selectItems: updatedItems }));
                setSelectedItems(updatedItems);
            }
        } catch (error) {
            toast.error("Lỗi cập nhật số lượng sản phẩm");
        }
    };

    const removeItem = async (itemId) => {
        try {
            const deleteResponse = await deleteCartItem(itemId);
            if (deleteResponse.data) {
                // Xóa khỏi giỏ hàng trong Redux & State
                dispatch(removeItemFromCart({ itemId }));
                setCartItems(prevCartItems => prevCartItems.filter(item => item.itemId !== itemId));

                // Xóa khỏi selectedItems trong Redux & State
                setSelectedItems(prevSelectedItems => {
                    const updatedItems = prevSelectedItems.filter(i => i.itemId !== itemId);
                    dispatch(setSelectedItemsRedux({ selectItems: updatedItems }));
                    return updatedItems;
                });
            }
        } catch (error) {
            toast.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng");
        }
    };


    const calculateTotal = () => {
        return selectedItems.length > 0
            ? selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
            : 0;
    };

    const calculateNumberItem = () => {
        return selectedItems.length > 0
            ? selectedItems.reduce((total, item) => total + item.quantity, 0)
            : 0;
    };

    const handlerSelectItem = (e, item) => {
        if (e.target.checked) {
            setSelectedItems([...selectedItems, item]);
            dispatch(setSelectedItemsRedux({ selectItems: [...selectedItems, item] }));
        } else {
            setSelectedItems(selectedItems.filter(i => i.itemId !== item.itemId));
            dispatch(setSelectedItemsRedux({ selectItems: selectedItems.filter(i => i.itemId !== item.itemId) }));
        }
    };

    const CartItem = ({ item }) => (
        <div className="flex items-center justify-between p-4 mb-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center space-x-4 flex-1">
                <input
                    className="accent-red-400 w-5 h-5 m-2"
                    type="checkbox"
                    checked={selectedItems.some(i => i.itemId === item.itemId)}
                    onChange={(e) => handlerSelectItem(e, item)}
                />
                <img
                    src={item.image ? item.image.split(',')[0] : "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9"}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9";
                    }}
                />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 flex justify-start items-center">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</p>
                    <div className="flex items-center space-x- mt-2">
                        <button
                            onClick={() => decrementQuantity(item, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                        >
                            <FiMinus className="text-gray-600" />
                        </button>
                        <span className="px-4 py-1 border rounded-md">{item.quantity}</span>
                        <button
                            onClick={() => increateseQuantity(item, item.quantity + 1)}
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
            {loading ? <Loading /> : <div className="w-10/12 mx-auto">
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
                            <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
                                <h2 className="text-xl font-semibold mb-4">Tóm tắt giỏ hàng</h2>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Sản phẩm:</span>
                                        <span>{calculateNumberItem()}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Tổng tiền:</span>
                                        <div className="flex items-center space-x-2">
                                            <span>{calculateTotal().toLocaleString('en-US')}</span>
                                            <span><FaDongSign /></span>
                                        </div>
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
            </div>}
        </div>
    );
};


