import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaDongSign } from "react-icons/fa6";
import { createCartItem, updateQuantityCartItem } from "../routers/ApiRoutes";
import { setCartItemsRedux, increaseQuantityItem, setSelectedItemsRedux } from "../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useModal } from "../context/ModalProvider";
import SOLD_OUT_TAG from "../assets/sold-out_tag.png"



export default function ProductCard({ product }) {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const cart = useSelector(state => state.shoppingCart.cart);
    const cartItems = useSelector(state => state.shoppingCart.items);
    const { openModal } = useModal();
    const selectedItems = useSelector(state => state.shoppingCart.selectItems);
    const stockIns = useSelector(state => state.inventory.stockIns)
    const stockOuts = useSelector(state => state.inventory.stockOuts)

    const handlerAddToCart = async ({ product }) => {
        if (!user) {
            toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            return;
        }
        const item = cartItems.find(item => item.productId === product.id);
        if (item) {
            const updatedItems = selectedItems.map(i =>
                i.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i
            );
            if (!selectedItems.some(i => i.itemId === item.itemId)) {
                updatedItems.push({ ...item, quantity: 1 });
            }
            // dispatch(setSelectedItemsRedux({ selectItems: updatedItems }));
            try {
                const updateItemResponse = await updateQuantityCartItem(item.itemId, item.quantity + 1);

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

            const createItemResponse = await createCartItem(newCartItem);

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

                toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng");
            }
        } catch (error) {
            console.error("Lỗi trong quá trình thêm sản phẩm:", error);
            toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng");
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

    return (
        <div className="bg-card rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col h-[60vh] mb-4 relative">
            {getProductStock(product.id) <= 0 && <div className="absolute top-2 left-2 w-14 h-14">
                <img src={SOLD_OUT_TAG} alt="Sold Out" className="w-full h-full object-contain" />
            </div>}
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
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}

                    </p>

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

                {getProductStock(product.id) > 0 ?
                    <button className="w-full py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-300 flex items-center justify-center gap-2 h-[5vh]"
                        onClick={() => handlerAddToCart({ product })}
                    >
                        <FiShoppingCart />
                        Thêm vào giỏ hàng
                    </button>
                    :
                    <button
                        className="w-full py-2 px-4 rounded-md bg-red-400 transition-colors duration-300 flex items-center justify-center gap-2 h-[5vh]"
                        disabled={true}
                    >

                        <span className="text-white">Đã hết hàng</span>
                    </button>}
            </div>

        </div >
    );
}
