import React from "react";
import AuthRoute from "./AuthRoutes";
import Layout from "./Layout";
import Page from "../constants/Page";
import ScrollToTop from "../utils/ScrollToTop";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ChatButton from "../components/ChatButton";
import loadable from '@loadable/component';
import Loading from "../components/loading";
const Home = loadable(async () => {
    const module = await import('../pages/Home');
    return module;
}, { fallback: <Loading /> });

const Product = loadable(async () => {
    const module = await import('../pages/Product');
    return module;
}, { fallback: <Loading /> });

const Login = loadable(async () => {
    const module = await import('../pages/Login');
    return module;
}, { fallback: <Loading /> });

const Register = loadable(async () => {
    const module = await import('../pages/Register');
    return module;
}, { fallback: <Loading /> });

const Cart = loadable(async () => {
    const module = await import('../pages/Cart');
    return module;
}, { fallback: <Loading /> });

const Payment = loadable(async () => {
    const module = await import('../pages/Payment');
    return module;
}, { fallback: <Loading /> });

const OrderTracking = loadable(async () => {
    const module = await import('../pages/OrderTracking');
    return module;
}, { fallback: <Loading /> });

const Order = loadable(async () => {
    const module = await import('../pages/Order');
    return module;
}, { fallback: <Loading /> });

const ProductDetail = loadable(async () => {
    const module = await import('../pages/ProductDetail');
    return module;
}, { fallback: <Loading /> });

const Dashboard = loadable(async () => {
    const module = await import('../pages/Dashboard');
    return module;
}, { fallback: <Loading /> });

const EmailVerifyPage = loadable(async () => {
    const module = await import('../pages/EmailVerifyPage');
    return module;
}, { fallback: <Loading /> });

const EmailVerifySendPage = loadable(async () => {
    const module = await import('../pages/EmailVerifySendPage');
    return module;
}, { fallback: <Loading /> });

const EmailVerifySuccessPage = loadable(async () => {
    const module = await import('../pages/EmailVerifySuccessPage');
    return module;
}, { fallback: <Loading /> });

const ForgotPassword = loadable(async () => {
    const module = await import('../pages/ForgotPassword');
    return module;
}, { fallback: <Loading /> });

const ResetPassword = loadable(async () => {
    const module = await import('../pages/ResetPassword');
    return module;
}, { fallback: <Loading /> });

const Profile = loadable(async () => {
    const module = await import('../pages/Profile');
    return module;
}, { fallback: <Loading /> });
const NotFound = loadable(async () => {
    const module = await import('../pages/NotFound');
    return module;
}, { fallback: <Loading /> });
const ConfirmCheckout = loadable(async () => {
    const module = await import('../pages/ConfirmCheckout');
    return module;
}, { fallback: <Loading /> });


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
                        <AuthRoute>
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
                        <AuthRoute>
                            <Dashboard />
                        </AuthRoute>
                    }
                />
                <Route
                    path={Page.PROFILE_PAGE.path}
                    element={
                        <AuthRoute>
                            <Layout>
                                <Profile />
                            </Layout>
                        </AuthRoute>
                    }
                />
                <Route
                    path={Page.NOT_FOUND.path}
                    element={<NotFound />}
                />
                <Route
                    path={Page.CONFIRM_CHECKOUT.path}
                    element={
                        <AuthRoute>
                            <Layout>
                                <ConfirmCheckout />
                            </Layout>
                        </AuthRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
