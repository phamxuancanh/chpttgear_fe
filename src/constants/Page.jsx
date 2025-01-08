import Cart from "../pages/Cart";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Order from "../pages/Order";
import OrderTracking from "../pages/OrderTracking";
import Payment from "../pages/Payment";
import Product from "../pages/Product";
import ProductDetail from "../pages/ProductDetail";

import Register from "../pages/Register";

const HOME_PAGE = {
    name: "HOME_PAGE",
    displayName: "Trang chủ",
    path: "/",
    element: <Product />,
};
const PRODUCT_PAGE = {
    name: "PRODUCT_PAGE",
    displayName: "Danh sách sản phẩm",
    path: "/products",
    element: <Home />,
};
const PRODUCT_DETAILS = {
    name: "PRODUCT_DETAILS",
    displayName: "Chi tiết sản phẩm",
    path: "/product/:id",
    element: <ProductDetail />,
};
const LOGIN_PAGE = {
    name: "LOGIN_PAGE",
    displayName: "Trang chủ",
    path: "/login",
    element: <Login />,
};
const REGISTER_PAGE = {
    name: "REGISTER_PAGE",
    displayName: "Trang chủ",
    path: "/register",
    element: <Register />,
};
const CART_PAGE = {
    name: "CART_PAGE",
    displayName: "Trang chủ",
    path: "/cart",
    element: <Cart />,
};

const PAYMENT_PAGE = {
    name: "PAYMENT_PAGE",
    displayName: "Trang chủ",
    path: "/payment",
    element: <Payment />,
};

const ORDER_TRACKING_PAGE = {
    name: "ORDER_TRACKING_PAGE",
    displayName: "Trang chủ",
    path: "/order_tracking",
    element: <OrderTracking />,
};

const ORDER_PAGE = {
    name: "ORDER",
    displayName: "Trang chủ",
    path: "/orders",
    element: <Order />,
};

const Page = {
    LOGIN_PAGE,
    REGISTER_PAGE,
    HOME_PAGE,
    PRODUCT_PAGE,
    PRODUCT_DETAILS,
    CART_PAGE,
    PAYMENT_PAGE,
    ORDER_TRACKING_PAGE,
    ORDER_PAGE

};
export default Page;
