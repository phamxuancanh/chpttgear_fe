/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* PRIVATE ROUTE: AUTHENTICATION
   ========================================================================== */
import { Navigate, useLocation } from 'react-router-dom';
import ROUTES from '../constants/Page';
import { getFromLocalStorage } from '../utils/functions';
import CryptoJS from 'crypto-js';

const AuthRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const authen = getFromLocalStorage('persist:auth');

  const isAuthenticated = authen?.isLoggedIn;
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
  if (isAuthenticated === "false" && !publicRoutes.includes(location.pathname)) {
    return <Navigate to={ROUTES.LOGIN_PAGE.path} />;
  }

  else if (isAuthenticated === 'true') {
    console.log('authen true')
    if (
      location.pathname === ROUTES.LOGIN_PAGE.path ||
      location.pathname === ROUTES.REGISTER_PAGE.path ||
      location.pathname === ROUTES.EMAIL_VERIFY_PAGE.path
    ) {
      return <Navigate to={ROUTES.HOME_PAGE.path} />;
    }
    const user = authen?.user ? JSON.parse(authen.user) : null;
    const userRoleEncrypted = user?.key;
    let userRole;
    if (userRoleEncrypted) {
      console.log('chuyen trang thai');
      try {
        const decrypted = CryptoJS.AES.decrypt(
          userRoleEncrypted,
          process.env.REACT_APP_CRYPTO
        );
        userRole = decrypted.toString(CryptoJS.enc.Utf8);
        console.log('Decrypted userRole:', userRole);
      } catch (error) {
        console.error('Decryption error:', error);
      }
    }

    if ((userRole === 'R1' || userRole === 'R2') && location.pathname !== ROUTES.DASHBOARD.path) {
      console.log('auth route 1')
      return <Navigate to={ROUTES.DASHBOARD.path} />;
    }

    if (userRole !== 'R1' && userRole !== 'R2' && location.pathname === ROUTES.DASHBOARD.path) {
      console.log('auth route 2')
      return <Navigate to={ROUTES.HOME_PAGE.path} />;
    }

    if (allowedRoles) {
      return <Navigate to={ROUTES.NOT_FOUND.path} />
    }
  }

  return <>{children}</>;
};

export default AuthRoute;
