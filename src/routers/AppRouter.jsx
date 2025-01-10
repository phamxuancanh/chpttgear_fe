import React from "react";

import Layout from "./Layout";
import Page from "../constants/Page";
import ScrollToTop from "../utils/ScrollToTop";
import Home from "../pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Product from "../pages/Product";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Payment from "../pages/Payment";
import OrderTracking from "../pages/OrderTracking";
import Order from "../pages/Order";
import ProductDetail from "../pages/ProductDetail";
import Dashboard from "../pages/Dashboard";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route
                    path={Page.HOME_PAGE.path}
                    element={
                        <Layout>
                            <Home />
                        </Layout>
                    }
                />
                <Route
                    path={Page.PRODUCT_PAGE.path}
                    element={
                        <Layout>
                            <Product />
                        </Layout>
                    }
                />
                <Route
                    path={Page.PRODUCT_DETAILS.path}
                    element={
                        <Layout>
                            <ProductDetail />
                        </Layout>
                    }
                />
                <Route
                    path={Page.LOGIN_PAGE.path}
                    element={
                        <Login />
                    }
                />
                <Route
                    path={Page.REGISTER_PAGE.path}
                    element={
                        <Register />
                    }
                />
                <Route
                    path={Page.CART_PAGE.path}
                    element={
                        <Layout>
                            <Cart />
                        </Layout>
                    }
                />
                <Route
                    path={Page.PAYMENT_PAGE.path}
                    element={
                        <Layout>
                            <Payment />
                        </Layout>
                    }
                />
                <Route
                    path={Page.ORDER_TRACKING_PAGE.path}
                    element={
                        <Layout>
                            <OrderTracking />
                        </Layout>
                    }
                />
                <Route
                    path={Page.ORDER_PAGE.path}
                    element={
                        <Layout>
                            <Order />
                        </Layout>
                    }
                />
                <Route
                    path={Page.DASHBOARD.path}
                    element={
                        <Dashboard />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
