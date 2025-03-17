import React, { useState } from "react";
import axios from "axios";
import LOGO from "../assets/a.avif";
import { IoIosSend, IoIosCloseCircleOutline } from "react-icons/io";
import { generateChat } from "../routers/ApiRoutes";

export default function ChatButton() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Toggle hiển thị chatbox
    const toggleChatWindow = () => {
        setIsChatOpen(!isChatOpen);
    };

    // Gửi tin nhắn
    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        // Thêm tin nhắn của user vào danh sách
        const userMessage = { text: inputMessage, isUser: true };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInputMessage("");
        setLoading(true);

        try {
            await sendMessageToAPI(inputMessage);
        } catch (error) {
            console.error("Lỗi khi gọi API OpenAI:", error);
        } finally {
            setLoading(false);
        }
    };

    // Gửi tin nhắn đến OpenAI API
    const sendMessageToAPI = async (userMessage) => {
        const maxRetries = 3;
        let retryCount = 0;
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        while (retryCount < maxRetries) {
            try {
                const response = await generateChat(userMessage);

                // 🛠 Lấy dữ liệu đúng từ API
                if (response.data && response.data.result) {
                    const assistantMessage = response.data.result;
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { text: assistantMessage, isUser: false },
                    ]);
                } else {
                    console.error("Dữ liệu API không đúng định dạng", response.data);
                }
                break; // Thoát vòng lặp nếu thành công
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    retryCount++;

                    await delay(2000); // Chờ 2 giây trước khi thử lại
                } else {
                    console.error("Lỗi khi gọi API OpenAI:", error);
                    break;
                }
            }
        }

        if (retryCount === maxRetries) {
            alert("Quá nhiều yêu cầu được gửi đi. Vui lòng thử lại sau một lúc.");
        }
    };

    return (
        <>
            {/* Nút mở chat */}
            <div
                onClick={toggleChatWindow}
                className="fixed bottom-8 right-8 bg-gray-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl cursor-pointer z-10"
            >
                <div className="bg-white h-14 w-14 rounded-full flex justify-center items-center">
                    <img src={LOGO} alt="Chat" className="w-12 h-12 rounded-full" />
                </div>
            </div>

            {/* Cửa sổ chat */}
            {isChatOpen && (
                <div className="fixed bottom-16 right-8 bg-gray-800 text-white w-96 h-[60vh] rounded-lg shadow-2xl flex flex-col p-4 z-40">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-600">
                        <h2 className="font-semibold text-xl">ChatBox</h2>
                        <button onClick={toggleChatWindow} className="text-gray-400">
                            <IoIosCloseCircleOutline className="text-2xl hover:text-red-500" />
                        </button>
                    </div>

                    {/* Nội dung tin nhắn */}
                    <div className="flex-1 mt-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded-md mb-2 ${msg.isUser
                                        ? "bg-green-400 text-black self-end"
                                        : "bg-gray-200 text-black self-start"
                                    }`}
                            >
                                <p className="break-words">{msg.text}</p>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-center space-x-2 bg-gray-300 text-black px-4 py-2 rounded-lg mb-2 self-start shadow-md">
                                <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                <p className="break-words text-gray-700 animate-pulse">Đang tải...</p>
                            </div>
                        )}
                    </div>

                    {/* Ô nhập và nút gửi */}
                    <div className="pt-2 flex items-center">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="w-full px-3 py-2 border border-gray-600 rounded-lg text-black"
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <IoIosSend
                            className="text-3xl cursor-pointer text-white ml-3 hover:text-blue-400"
                            onClick={handleSendMessage}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
