import axios from "axios";
import { useEffect, useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaUser } from "react-icons/fa";
import { FiX, FiMapPin } from "react-icons/fi";
import { calculateShippingFee } from "../../routers/ApiRoutes";
import Loading from "../loading";
import { useSelector } from "react-redux";

const AddressModal = ({ isOpen, onClose, user, onSelect, setShippingFee }) => {
    const addresses = user.address.split(";;") // Tách địa chỉ
    const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
    const [loading, setLoading] = useState(false)
    const selectedItems = useSelector(state => state.shoppingCart.selectItems)
    if (!isOpen) return null; // Ẩn modal khi không mở


    const handleChangeAddress = async () => {
        setLoading(true);

        const [address, code] = selectedAddress.split("|").map((s) => s.trim());
        const [toWard, toDistrict] = code.split(",").map((s) => s.trim());

        onSelect(address);
        try {

            const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight * item.quantity, 1);
            const res = await calculateShippingFee(parseInt(toDistrict), toWard, totalWeight, 195800);
            setShippingFee(res);
        } catch (error) {
            console.error("Error calculating shipping fee:", error);
        } finally {
            setLoading(false);
            onClose();
        }
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {loading ? <Loading /> : <div className="bg-white rounded-xl p-6 w-1/3 shadow-lg relative">
                {/* Nút đóng */}
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
                    <FiX size={22} />
                </button>

                <h2 className="flex justify-center text-xl font-semibold text-gray-900 mb-4">Chọn Địa Chỉ Nhận Hàng</h2>

                {/* Thông tin người dùng */}
                <div className="flex items-center gap-4 border-b pb-4 m-4">
                    <div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <FaUser className="text-blue-500" />
                            <span className="font-semibold">{user.firstName + ' ' + user.lastName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 mt-1">
                            <FaEnvelope className="text-green-500" />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 mt-1">
                            <FaPhone className="text-green-500" />
                            <span>{user.phone}</span>
                        </div>

                    </div>
                </div>

                {/* Danh sách địa chỉ */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                    {addresses.length > 0 ? (
                        addresses.map((address, index) => (
                            <div
                                key={index}
                                className={`p-4 border rounded-lg flex items-center gap-2 cursor-pointer transition-all 
                                    ${selectedAddress === address ? "border-blue-600 bg-blue-100" : "border-gray-300 bg-white"}`}
                                onClick={() => setSelectedAddress(address)}
                            >
                                <FiMapPin className="text-red-500" />
                                <span className="text-gray-700">{address.split("|")[0].trim()}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">Chưa có địa chỉ nào</p>
                    )}
                </div>

                {/* Nút xác nhận */}
                <button
                    onClick={() => handleChangeAddress()}
                    disabled={!selectedAddress}
                    className={`mt-5 w-full py-2 rounded-lg transition
                        ${selectedAddress ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                >
                    Chọn địa chỉ
                </button>
            </div>}
        </div>
    );
};

export default AddressModal;
