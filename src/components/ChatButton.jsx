import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import LOGO from "../assets/a.avif";
import { IoIosSend, IoIosCloseCircleOutline } from "react-icons/io";
import { generateChat } from "../routers/ApiRoutes";

export default function ChatButton() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
<>
    {/* Nút mở chat */}
    <div
        onClick={toggleChatWindow}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-500 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl cursor-pointer z-10 hover:scale-105 transition-all duration-300"
    >
        <div className="text-3xl">🤖</div>
    </div>

    {/* Cửa sổ chat */}
    {isChatOpen && (
        <div className="fixed bottom-0 right-28 bg-gray-800 text-white w-96 h-[60vh] rounded-lg shadow-2xl flex flex-col p-4 z-40">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-600 pb-3 mb-2">
                <div className="flex items-center space-x-2 text-xl font-semibold">
                    <span>🤖</span>
                    <span>Chatbot Tư Vấn</span>
                </div>
                <button
                    onClick={toggleChatWindow}
                    className="text-white hover:text-red-400 transition duration-300"
                >
                    <IoIosCloseCircleOutline className="text-2xl" />
                </button>
            </div>

            {/* Nội dung tin nhắn */}
            <div className="flex-1 overflow-y-auto pr-1">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-md mb-2 max-w-[80%] ${msg.isUser
                            ? "bg-green-400 text-black ml-auto"
                            : "bg-gray-200 text-black"
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
                <div ref={messagesEndRef} />
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
