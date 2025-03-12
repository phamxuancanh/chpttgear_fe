import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaDongSign } from "react-icons/fa6";
import { createCartItem, updateQuantityCartItem } from "../routers/ApiRoutes";
import { setCartItemsRedux, increaseQuantityItem, setSelectedItemsRedux } from "../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useModal } from "../context/ModalProvider";


export default function ProductCard({ product }) {

    const dispatch = useDispatch();
    const cart = useSelector(state => state.shoppingCart.cart);
    const cartItems = useSelector(state => state.shoppingCart.items);
    const { openModal } = useModal();
    const selectedItems = useSelector(state => state.shoppingCart.selectItems);

    const handlerAddToCart = async ({ product }) => {
        console.log(product)
        console.log(cartItems)
        const item = cartItems.find(item => item.productId === product.id);
        if (item) {
            const updatedItems = selectedItems.map(i =>
                i.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i
            );
            if (!selectedItems.some(i => i.itemId === item.itemId)) {
                updatedItems.push({ ...item, quantity: 1 });
            }
            dispatch(setSelectedItemsRedux({ selectItems: updatedItems }));
            try {
                const updateItemResponse = await updateQuantityCartItem(item.itemId, item.quantity + 1);
                console.log(updateItemResponse)
                if (updateItemResponse.data) {
                    dispatch(increaseQuantityItem({ itemId: item.itemId }));
                    openModal("Sản phẩm đã được thêm vào Giỏ hàng!");
                } else {
                    toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng");
                }
            } catch (error) {
                toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng");
            }
            return;
        }
        try {
            const newCartItem = {
                productId: product.id,
                quantity: 1,
                cart: cart
            };
            console.log("newCartItem:", newCartItem);

            const createItemResponse = await createCartItem(newCartItem);
            console.log("createItemResponse:", createItemResponse);

            if (createItemResponse.status === 201 && createItemResponse.data) {

                const newItem = {
                    itemId: createItemResponse.data.id,
                    productId: createItemResponse.data.productId,
                    name: product.name,
                    price: product.price,
                    quantity: createItemResponse.data.quantity,
                    image: product.image
                };

                const updatedCartItems = cartItems ? [...cartItems, newItem] : [newItem];

                dispatch(setCartItemsRedux({ items: updatedCartItems }));

                openModal("Sản phẩm đã được thêm vào Giỏ hàng!");
            } else {
                console.log("Lỗi khi thêm sản phẩm");
                toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng");
            }
        } catch (error) {
            console.error("Lỗi trong quá trình thêm sản phẩm:", error);
            toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng");
        }

    };

    return (
        <div className="bg-card rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col h-[60vh] mb-4">
            <Link to={`/product/${product.id}`}>
                <div className="flex justify-center items-center h-[20vh]">
                    <img
                        src={product.image ? product.image.split(',')[0] : "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3"}
                        alt={product.name || "Product Image"}
                        loading="lazy"

                        className="w-[20vh] h-[20vh] object-cover rounded-lg"
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3";
                        }}
                    />
                </div>
            </Link>


            {/* Nội dung sản phẩm */}
            <div className="p-4 flex flex-col flex-grow">
                <Link to={`/product/${product.id}`} className="flex items-center justify-center">
                    <h3 className="font-semibold text-foreground mb-2 h-[10vh] text-base line-clamp-2 flex ">
                        {product.name}
                    </h3>
                </Link>

                {/* Giá sản phẩm */}
                <div className="flex items-center mb-2 h-[3.5vh]">
                    <p className="text-accent text-xl font-bold mr-1">
                        {product.price.toLocaleString('en-US')}
                    </p>
                    <FaDongSign />
                </div>

                {/* Danh mục sản phẩm */}
                <p className="text-accent text-sm font-medium mb-2 h-[4vh] line-clamp-1">
                    {product?.category?.name}
                </p>

                {/* Màu sắc sản phẩm */}
                <div className="h-[5vh] flex items-center">
                    <div
                        className={`w-[3vh] h-[3vh] rounded-lg shadow-xl ${["black", "white"].includes(product.color)
                            ? `bg-${product.color}`
                            : `bg-${product.color}-400`
                            }`}
                    ></div>
                </div>
            </div>


            {/* Nút Thêm vào giỏ hàng - luôn nằm dưới */}
            <div className="p-4">
                <button className="w-full py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-300 flex items-center justify-center gap-2 h-[5vh]"
                    onClick={() => handlerAddToCart({ product })}
                >
                    <FiShoppingCart />
                    Thêm vào giỏ hàng
                </button>
            </div>

        </div >
    );
}
