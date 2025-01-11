import React, { useState } from "react";
import axios from "axios"; // Import Axios
import LOGO from '../assets/a.avif'
import { IoIosSend } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function ChatButton() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleChatWindow = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = { text: inputMessage, isUser: true };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInputMessage("");
        setLoading(true);

        try {
            await sendMessageToAPI(userMessage);
        } catch (error) {
            console.error("Error communicating with OpenAI API", error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessageToAPI = async (userMessage) => {
        const maxRetries = 3;
        let retryCount = 0;
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        while (retryCount < maxRetries) {
            try {
                const response = await axios.post(
                    "https://api.openai.com/v1/chat/completions",
                    {
                        model: "gpt-3.5-turbo",
                        messages: [
                            { role: "system", content: "You are a helpful assistant." },
                            ...messages.map((msg) =>
                                msg.isUser
                                    ? { role: "user", content: msg.text }
                                    : { role: "assistant", content: msg.text }
                            ),
                            { role: "user", content: userMessage.text },
                        ],
                    },
                    {
                        headers: {
                            Authorization: `Bearer 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`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const assistantMessage = response.data.choices[0].message.content;
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: assistantMessage, isUser: false },
                ]);
                break; // Thoát khỏi vòng lặp nếu thành công
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    retryCount++;
                    console.log(`Retrying... (${retryCount}/${maxRetries})`);
                    await delay(2000); // Chờ 2 giây trước khi thử lại
                } else {
                    throw error;
                }
            }
        }

        if (retryCount === maxRetries) {
            alert("Quá nhiều yêu cầu được gửi đi. Vui lòng thử lại sau một lúc.");
        }
    };

    return (
        <>
            {/* Button */}
            <div
                onClick={toggleChatWindow}
                className=" fixed top-[92%] right-[1%] transform translate-y-[-50%] bg-gray-500 text-white w-[74px] h-[74px] rounded-full flex items-center justify-center shadow-2xl cursor-pointer z-10"
            >
                <div className="shadow-lg bg-white h-[63px] w-[63px] rounded-full flex justify-center items-center">
                    <img src={LOGO} alt="Chat" className="w-16 h-16 rounded-full" />
                </div>
            </div>

            {/* Chat Window */}
            {isChatOpen && (
                <div className="fixed bottom-0 right-[6%] bg-gray-800 text-white w-96 h-[60vh] rounded-lg shadow-2xl flex flex-col p-4 z-10">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-600">
                        <h2 className="font-semibold text-xl">ChatGPT</h2>
                        <button onClick={toggleChatWindow} className="text-gray-400">
                            <IoIosCloseCircleOutline className="text-2xl hover:text-[#ff7200]" />
                        </button>
                    </div>
                    <div className="flex-1 mt-4 overflow-y-auto">
                        {/* Chat content */}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded-md mb-2 ${msg.isUser
                                    ? "bg-[#bfed7f] text-black self-end"
                                    : "bg-[#f7efd4] text-black self-start"
                                    }`}
                            >
                                <p className="break-words">{msg.text}</p>
                            </div>
                        ))}
                        {loading && (
                            <div className="bg-[#f7efd4] text-black p-2 rounded-md mb-2 self-start">
                                <p className="break-words">Loading...</p>
                            </div>
                        )}
                    </div>
                    <div className="pt-2 flex justify-center items-center">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="w-full mr-3 px-3 py-2 border border-gray-600 rounded-lg text-black"
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <IoIosSend
                            className="text-3xl cursor-pointer"
                            onClick={handleSendMessage}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
