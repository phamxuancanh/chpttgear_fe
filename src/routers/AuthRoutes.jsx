import { Navigate, useLocation } from "react-router-dom";
import ROUTES from "../constants/Page";
import { useEffect, useState } from "react";

const AuthRoute = ({ children }) => {
    const location = useLocation();


    return <Navigate to={ROUTES.HOME_PAGE.path} />;
};

export default AuthRoute;
