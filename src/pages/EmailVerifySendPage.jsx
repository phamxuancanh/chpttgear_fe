import {useLocation} from "react-router-dom";

const EmailVerifySendPage = () => {
    const location = useLocation();
    const userInfo = location.state;
    const email = userInfo?.email;
    const displayName = userInfo?.display_name;
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
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 w-24 h-24 border-4 border-solid border-white rounded-full bg-teal-700 flex items-center justify-center">
                        <img
                            className="w-16 h-16"
                            src="https://cdn-icons-png.flaticon.com/256/1804/1804188.png"
                            alt=""
                        />
                    </div>
                </div>
                <div className="px-5 sm:px-14 py-16 pb-8">
                    <p className="font-bold text-gray-800 text-xl">Kiểm tra email của bạn</p>
                    <p className="text-gray-600 text-sm font-medium mt-5">
                    Xin chào<b className="font-bold text-gray-800">{displayName}</b>, Để bắt đầu sử dụng dịch vụ của chúng tôi, chúng tôi cần xác minh email của bạn.<br/>
                    Chúng tôi đã gửi liên kết xác minh đến email. <b className="font-bold text-gray-800">{email}</b> Vui lòng kiểm tra và xác nhận đó là bạn.
                    </p>
                    <button className="px-4 py-1.5 rounded-full bg-blue-400 text-white text-sm font-semibold mt-7">
                    Chắc chắn!"
                    </button>
                    <p className="font-medium text-gray-600 text-sm mt-7">
                    Không nhận được email?
                        <button
                            className="text-teal-400 ml-2"
                            // onClick={handleBtnResendClick}
                        >
                            Gửi lại
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default EmailVerifySendPage;