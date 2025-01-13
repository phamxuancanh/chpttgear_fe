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

    const calledOnce = React.useRef(false); // Cờ kiểm tra

    const { mutate: sendVerifyEmailMutate } = useMutation({
        mutationFn: (token) => verifyEmail(token),
        onSuccess: (res) => {
            toast.success('Verify email success!');
            navigate(ROUTES.EMAIL_VERIFY_SUCCESS_PAGE.path, { replace: true });
        },
        onError: (error) => {
            console.error(error);
            toast.error('Verify email failed!');
        },
    });

    useEffect(() => {
        if (token && !calledOnce.current) {
            calledOnce.current = true; // Đánh dấu là đã gọi API
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
