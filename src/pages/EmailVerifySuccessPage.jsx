import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import ROUTES from "../constants/Page"
const EmailVerifySuccessPage = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    if(countdown === 0) navigate(ROUTES.LOGIN_PAGE.path, {replace: true});

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000)

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-teal-700 min-h-screen flex items-center justify-center">
            <div className="bg-white w-[500px] rounded-lg text-center">
                <div
                    className="relative bg-[#E5E8FD] h-32 rounded-t-lg"
                    style={{
                        borderBottomLeftRadius: "50% 3rem",
                        borderBottomRightRadius: "50% 3rem",
                    }}
                >
                    <div
                        className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 w-24 h-24 border-4 border-solid border-white rounded-full bg-teal-700 flex items-center justify-center"
                    >
                        <div className="relative">
                            <img
                                className="w-16 h-16"
                                src="https://cdn-icons-png.flaticon.com/256/1804/1804188.png"
                                alt=""
                            />
                            <div
                                className="absolute bottom-0 right-0 w-6 h-6 text-sm flex items-center justify-center bg-green-500 text-white rounded-full">
                                <i className="fa-solid fa-check"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-14 py-16">
                    <p className="font-bold text-gray-800 text-xl">Xác minh thành công</p>
                    <p className="text-gray-600 text-sm font-medium mt-8">
                    Bây giờ bạn có thể sử dụng dịch vụ của chúng tôi.<br/>
                    Chúc bạn có trải nghiệm tốt với dịch vụ của chúng tôi!
                    </p>
                    <Link to={ROUTES.LOGIN_PAGE.path} replace={true}
                        className="px-4 py-1.5 rounded-full bg-blue-400 hover:bg-blue-500 text-white text-sm font-semibold mb-5">
                        <button className="mt-8">
                        Đăng nhập ({countdown})
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default EmailVerifySuccessPage;