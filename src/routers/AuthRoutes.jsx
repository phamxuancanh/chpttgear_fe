/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* PRIVATE ROUTE: AUTHENTICATION
   ========================================================================== */
   import { Navigate, useLocation } from 'react-router-dom';
   import ROUTES from '../constants/Page';
   import { getFromLocalStorage, removeAllLocalStorage } from '../utils/functions';
   import { useMemo } from 'react';
   import CryptoJS from 'crypto-js';
   
   const AuthRoute = ({ children, allowedRoles }) => {
     const location = useLocation();
     const tokens = getFromLocalStorage('persist:auth');
     const accessToken = tokens?.accessToken;
   
     const isAuthenticated = useMemo(() => {
       return !!tokens?.accessToken;
     }, [tokens?.accessToken]);
   
     const publicRoutes = [
       ROUTES.LOGIN_PAGE.path,
       ROUTES.REGISTER_PAGE.path,
       ROUTES.EMAIL_VERIFY_PAGE.path,
       ROUTES.EMAIL_VERIFY_SEND_PAGE.path,
       ROUTES.EMAIL_VERIFY_SUCCESS_PAGE.path,
       ROUTES.HOME_PAGE.path,
       ROUTES.FORGOT_PASSWORD_PAGE.path,
       ROUTES.RESET_PASSWORD.path
     ];
   
     if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
       return <Navigate to={ROUTES.LOGIN_PAGE.path} />;
     }
   
     if (isAuthenticated) {
       // Nếu người dùng đã đăng nhập mà vào Login hoặc Register, chuyển hướng về Home Page
       if (
         location.pathname === ROUTES.LOGIN_PAGE.path ||
         location.pathname === ROUTES.REGISTER_PAGE.path ||
         location.pathname === ROUTES.EMAIL_VERIFY_PAGE.path
       ) {
         return <Navigate to={ROUTES.HOME_PAGE.path} />;
       }
   
       const userRoleEncrypted = tokens.currentUser?.key;
       let userRole;
   
       if (userRoleEncrypted) {
         try {
           const decrypted = CryptoJS.AES.decrypt(
             userRoleEncrypted,
             process.env.REACT_APP_CRYPTO
           );
           userRole = decrypted.toString(CryptoJS.enc.Utf8);
         } catch (error) {
           console.error('Decryption error:', error);
         }
       }
   
       if ((userRole === 'R1' || userRole === 'R2') && location.pathname !== ROUTES.DASHBOARD.path) {
         return <Navigate to={ROUTES.DASHBOARD.path} />;
       }
   
       if (userRole !== 'R1' && userRole !== 'R2' && location.pathname === ROUTES.DASHBOARD.path) {
         return <Navigate to={ROUTES.HOME_PAGE.path} />;
       }
     }
   
     return <>{children}</>;
   };
   
   export default AuthRoute;
   