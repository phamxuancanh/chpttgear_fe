import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaDongSign } from "react-icons/fa6";
import { createCartItem, updateQuantityCartItem } from "../routers/ApiRoutes";
import { setCartItemsRedux, increaseQuantityItem } from "../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function ProductCard({ product }) {

    const dispatch = useDispatch();
    const cart = useSelector(state => state.shoppingCart.cart);
    const cartItems = useSelector(state => state.shoppingCart.items);

    const handlerAddToCart = async ({ product }) => {
        const item = cartItems.find(item => item.productId === product.id);
        console.log("item", item);
        if (item) {
            try {
                const updateItemResponse = await updateQuantityCartItem(item.itemId, item.quantity + 1);
                if (updateItemResponse.data) {
                    dispatch(increaseQuantityItem({ itemId: item.itemId }));
                    toast.success("Thêm thành công");
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
                cart
            };
            const createItemResponse = await createCartItem(newCartItem);
            if (createItemResponse.data) {
                const newItem = {
                    itemId: createItemResponse.data.id,
                    productId: createItemResponse.data.productId,
                    name: product.name,
                    price: product.price,
                    quantity: createItemResponse.data.quantity,
                    image: product.image
                };
                dispatch(setCartItemsRedux({ items: [...cartItems, newItem] }));
                toast.success("Đã thêm sản phẩm vào giỏ hàng");
            } else {
                toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng");
            }
        } catch (error) {
            toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng");
        };
    };

    return (
        <div className="bg-card rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col h-[65vh] mb-4">
            <Link to={`/product/${product.id}`}>
                <div className="flex justify-center items-center h-[30vh]">
                    <img
                        src={product.image.split(',')[0]}
                        alt={product.name}
                        loading="lazy"
                        className="w-[30vh] h-[30vh] object-cover rounded-lg"
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3";
                        }}
                    />
                </div>
            </Link>

            {/* Nội dung sản phẩm */}
            <div className="p-4 flex flex-col flex-grow">
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-semibold text-foreground mb-2 h-[5vh]">{product.name}</h3>
                </Link>

                {/* Giá sản phẩm */}
                <div className="flex items-center mb-2 h-[4vh]">
                    <p className="text-accent text-xl font-bold mr-1">{product.price.toLocaleString('en-US')}</p>
                    <FaDongSign />
                </div>

                {/* Danh mục sản phẩm */}
                <p className="text-accent text-sm font-medium mb-2 h-[3vh]">{product?.category?.name}</p>

                {/* Màu sắc sản phẩm */}
                <div className="h-[4vh] flex items-center">
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
        </div>
    );
}
