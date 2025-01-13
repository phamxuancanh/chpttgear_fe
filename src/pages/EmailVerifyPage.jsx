import React, { useEffect } from 'react';
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from 'react-router-dom';
import ROUTES from '../constants/Page';
import { verifyEmail } from '../routers/ApiRoutes';

const EmailVerifyPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    // Sử dụng React Query để gọi API verifyEmail
    const { mutate: sendVerifyEmailMutate } = useMutation({
        mutationFn: (token) => verifyEmail(token), // Hàm gọi API
        onSuccess: (res) => {
            toast.success('Verify email success!');
            navigate(ROUTES.EMAIL_VERIFY_SUCCESS_PAGE.path, { replace: true });
        },
        onError: (error) => {
            // Xử lý khi thất bại
            console.error(error);
            toast.error('Verify email failed!');
        }
    });

    // Gọi API xác thực email khi component mount
    useEffect(() => {
        if (token) {
            sendVerifyEmailMutate(token);
        }
    }, [token, sendVerifyEmailMutate]);

    return (
        <div>
            Verifying email...
        </div>
    );
};

export default EmailVerifyPage;
