import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiMoreVertical, FiImage, FiSend, FiMic, FiSmile, FiEdit2, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";

export default function Chats() {
    const [conversations, setConversations] = useState([
        {
            id: 1,
            name: "John Smith",
            lastMessage: "Hey, how are you doing?",
            timestamp: new Date(),
            unread: 2,
            avatar: "https://esx.bigo.sg/live/4hb/0r2AqY.jpg"
        },
        {
            id: 2,
            name: "Emma Watson",
            lastMessage: "The meeting is scheduled for tomorrow",
            timestamp: new Date(),
            unread: 0,
            avatar: "https://esx.bigo.sg/live/4hb/0r2AqY.jpg"
        }
    ]);

    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "John Smith",
            content: "Hey, how are you doing?",
            timestamp: new Date(),
            status: "read",
            type: "received",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
        },
        {
            id: 2,
            sender: "You",
            content: "I'm good, thanks! How about youhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh?",
            timestamp: new Date(),
            status: "delivered",
            type: "sent",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
        }
    ]);

    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: messages.length + 1,
                sender: "You",
                content: newMessage,
                timestamp: new Date(),
                status: "sent",
                type: "sent",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
            };
            setMessages([...messages, newMsg]);
            setNewMessage("");
        }
    };

    return (
        <div className={`h-screen flex max-h-[92vh]`}>
            <div className="w-1/4 border-r border-gray-100  overflow-y-auto shadow-lg mr-3">
                <div className="p-4 border-b border-gray-200 ">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full px-4 py-2 rounded-lg bg-gray-100  focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FiSearch className="absolute right-3 top-3 text-gray-500" />
                    </div>
                </div>
                <div className="overflow-y-auto">
                    {conversations.map((conv) => (
                        <div
                            key={conv.id}
                            className="flex items-center p-4 hover:bg-gray-300  cursor-pointer"
                            onClick={() => setSelectedConversation(conv)}
                        >
                            <img
                                src={conv.avatar}
                                alt={conv.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="ml-4 flex-1">
                                <h3 className="font-semibold ">{conv.name}</h3>
                                <p className="text-sm text-gray-500 ">{conv.lastMessage}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 ">
                                    {format(conv.timestamp, "HH:mm")}
                                </p>
                                {conv.unread > 0 && (
                                    <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs mt-1 inline-block">
                                        {conv.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col shadow-lg mr-3">
                <div className="p-4 border-b border-gray-200  flex items-center justify-between">
                    <div className="flex items-center">
                        <img
                            src={selectedConversation?.avatar || conversations[0].avatar}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="ml-4">
                            <h2 className="font-semibold ">
                                {selectedConversation?.name || conversations[0].name}
                            </h2>
                            <p className="text-sm text-gray-500 ">Online</p>
                        </div>
                    </div>
                    <FiMoreVertical className="text-gray-500 cursor-pointer" />
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.type === "sent" ? "justify-end" : "justify-start"} mb-4`}
                        >
                            {message.type === "received" && (
                                <img
                                    src={message.avatar}
                                    alt={message.sender}
                                    className="w-8 h-8 rounded-full object-cover mr-2"
                                />
                            )}
                            <div
                                className={`max-w-xs p-3 rounded-lg ${message.type === "sent" ? "bg-blue-500 text-white" : "bg-gray-200"
                                    }`}
                            >
                                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                                <p className="text-xs mt-1 text-gray-500">
                                    {format(message.timestamp, "HH:mm")}
                                </p>
                            </div>

                        </div>
                    ))}
                    <div ref={messageEndRef} />
                </div>

                <div className="p-4 border-t border-gray-200 ">
                    <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100  rounded-full">
                            <FiImage className="text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100  rounded-full">
                            <FiSmile className="text-gray-500" />
                        </button>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 rounded-full bg-gray-100  focus:outline-none "
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <button
                            className="p-2 hover:bg-gray-100  rounded-full"
                            onClick={handleSendMessage}
                        >
                            <FiSend className="text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100  rounded-full">
                            <FiMic className="text-gray-500" />
                        </button>
                    </div>
                </div>
            </div>

            {/* User Details Sidebar */}
            <div className="w-1/4 border-l border-gray-200  p-4 shadow-lg">
                <div className="text-center">
                    <img
                        src={selectedConversation?.avatar || conversations[0].avatar}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover mx-auto"
                    />
                    <h2 className="mt-4 font-semibold text-xl ">
                        {selectedConversation?.name || conversations[0].name}
                    </h2>
                    <p className="text-gray-500 ">Online</p>
                </div>

                <div className="mt-8">
                    <h3 className="font-semibold mb-4 ">Shared Media</h3>
                    <div className="grid grid-cols-3 gap-2">
                        <img
                            src="https://esx.bigo.sg/live/4hb/0r2AqY.jpg"
                            alt="Shared media"
                            className="w-full h-20 object-cover rounded"
                        />
                        <img
                            src="https://esx.bigo.sg/live/4hb/0r2AqY.jpg"
                            alt="Shared media"
                            className="w-full h-20 object-cover rounded"
                        />
                        <img
                            src="https://esx.bigo.sg/live/4hb/0r2AqY.jpg"
                            alt="Shared media"
                            className="w-full h-20 object-cover rounded"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

}
