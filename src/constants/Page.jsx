import Cart from "../pages/Cart";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Order from "../pages/Order";
import OrderTracking from "../pages/OrderTracking";
import Payment from "../pages/Payment";
import Product from "../pages/Product";
import ProductDetail from "../pages/ProductDetail";
import Register from "../pages/Register";
import EmailVerifyPage from "../pages/EmailVerifyPage";
import EmailVerifySendPage from "../pages/EmailVerifySendPage";
import EmailVerifySuccessPage from "../pages/EmailVerifySuccessPage";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
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
    displayName: "Đăng nhập",
    path: "/login",
    element: <Login />,
};
const REGISTER_PAGE = {
    name: "REGISTER_PAGE",
    displayName: "Trang chủ",
    path: "/register",
    element: <Register />,
};
const FORGOT_PASSWORD_PAGE = {
    name: "FORGOT_PASSWORD_PAGE",
    displayName: "Quên mật khẩu",
    path: "/forgot_password",
    element: <ForgotPassword />,
};
const RESET_PASSWORD = {
    name: "RESET_PASSWORD",
    displayName: "Đặt lại mật khẩu",
    path: "/reset_password",
    element: <ResetPassword />,
}
const EMAIL_VERIFY_PAGE = {
    name: "EMAIL_VERIFY_PAGE",
    displayName: "Xác thực email",
    path: "/verify/email",
    element: <EmailVerifyPage />,
};
const EMAIL_VERIFY_SEND_PAGE = {
    name: "EMAIL_VERIFY_SEND_PAGE",
    displayName: "Xác thực email",
    path: "/email_verify_send",
    element: <EmailVerifySendPage />,
};
const EMAIL_VERIFY_SUCCESS_PAGE = {
    name: "EMAIL_VERIFY_SUCCESS_PAGE",
    displayName: "Xác thực email",
    path: "/email_verify_success",
    element: <EmailVerifySuccessPage />,
};
const CART_PAGE = {
    name: "CART_PAGE",
    displayName: "Giỏ hàng",
    path: "/cart",
    element: <Cart />,
};

const PAYMENT_PAGE = {
    name: "PAYMENT_PAGE",
    displayName: "Thanh toán",
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

const DASHBOARD = {
    name: "DASHBOARD",
    displayName: "Trang chủ",
    path: "/dashboard",
    element: <Dashboard />,
};


const Page = {
    LOGIN_PAGE,
    REGISTER_PAGE,
    FORGOT_PASSWORD_PAGE,
    RESET_PASSWORD,
    EMAIL_VERIFY_PAGE,
    EMAIL_VERIFY_SEND_PAGE,
    EMAIL_VERIFY_SUCCESS_PAGE,
    HOME_PAGE,
    PRODUCT_PAGE,
    PRODUCT_DETAILS,
    CART_PAGE,
    PAYMENT_PAGE,
    ORDER_TRACKING_PAGE,
    ORDER_PAGE,
    DASHBOARD

};
export default Page;
