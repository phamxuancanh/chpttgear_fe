import React from "react";
import AuthRoute from "./AuthRoutes";
import Layout from "./Layout";
import Page from "../constants/Page";
import ScrollToTop from "../utils/ScrollToTop";
import Home from "../pages/Home";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Product from "../pages/Product";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Payment from "../pages/Payment";
import OrderTracking from "../pages/OrderTracking";
import Order from "../pages/Order";
import ProductDetail from "../pages/ProductDetail";
import Dashboard from "../pages/Dashboard";
import ChatButton from "../components/ChatButton";
import EmailVerifyPage from "../pages/EmailVerifyPage";
import EmailVerifySendPage from "../pages/EmailVerifySendPage";
import EmailVerifySuccessPage from "../pages/EmailVerifySuccessPage";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
const ChatButtonWrapper = () => {
    const location = useLocation();

    const showChatButton = [
        Page.HOME_PAGE.path,
        Page.PRODUCT_PAGE.path,
        Page.CART_PAGE.path,
    ].includes(location.pathname);

    return showChatButton ? <ChatButton /> : null;
};

const AppRouter = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <ChatButtonWrapper />
            <Routes>
                {/* Public Routes */}
                <Route
                    path={Page.LOGIN_PAGE.path}
                    element={
                        <AuthRoute publicOnly>
                            <Login />
                        </AuthRoute>
                    }
                />
                <Route
                    path={Page.FORGOT_PASSWORD_PAGE.path}
                    element={
                        <AuthRoute publicOnly>
                            <ForgotPassword />
                        </AuthRoute>
                    }
                />
                <Route
                    path={Page.RESET_PASSWORD.path}
                    element={
                        <AuthRoute publicOnly>
                            <ResetPassword />
                        </AuthRoute>
                    }
                />
                <Route
                    path={Page.REGISTER_PAGE.path}
                    element={
                        <AuthRoute publicOnly>
                            <Register />
                        </AuthRoute>
                    }
                />
                <Route
                    path={Page.EMAIL_VERIFY_PAGE.path}
                    element={
                        <AuthRoute publicOnly>
                            <EmailVerifyPage />
                        </AuthRoute>
                    }
                />
                <Route
                    path={Page.EMAIL_VERIFY_SEND_PAGE.path}
                    element={
                        <AuthRoute publicOnly>
                            <EmailVerifySendPage />
                        </AuthRoute>
                    }
                />
                <Route
                    path={Page.EMAIL_VERIFY_SUCCESS_PAGE.path}
                    element={
                        <AuthRoute publicOnly>
                            <EmailVerifySuccessPage />
                        </AuthRoute>
                    }
                />

                {/* Private Routes */}
                <Route
                    path={Page.HOME_PAGE.path}
                    element={
                        <AuthRoute>
                            <Layout>
                                <Home />
                            </Layout>
                        </AuthRoute>
                    }
                />
                <Route
                    path={Page.PRODUCT_PAGE.path}
                    element={
                        <AuthRoute>
                            <Layout>
                                <Product />
                            </Layout>
                        </AuthRoute>
                    }
                />
                <Route
                    path={Page.PRODUCT_DETAILS.path}
                    element={
                        <AuthRoute>
                            <Layout>
                                <ProductDetail />
                            </Layout>
                        </AuthRoute>
                    }
                />
                <Route
                    path={Page.CART_PAGE.path}
                    element={
                        <AuthRoute>
                            <Layout>
                                <Cart />
                            </Layout>
                        </AuthRoute>
                    }
                />
                <Route
                    path={Page.PAYMENT_PAGE.path}
                    element={
                        <AuthRoute>
                            <Layout>
                                <Payment />
                            </Layout>
                        </AuthRoute>
                    }
                />
                <Route
                    path={Page.ORDER_TRACKING_PAGE.path}
                    element={
                        <AuthRoute>
                            <Layout>
                                <OrderTracking />
                            </Layout>
                        </AuthRoute>
                    }
                />
                <Route
                    path={Page.ORDER_PAGE.path}
                    element={
                        <AuthRoute>
                            <Layout>
                                <Order />
                            </Layout>
                        </AuthRoute>
                    }
                />
                <Route
                    path={Page.DASHBOARD.path}
                    element={
                        <AuthRoute allowedRoles={['R1', 'R2']}>
                            <Dashboard />
                        </AuthRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
