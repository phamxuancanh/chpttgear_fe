import { useModal } from "../../context/ModalProvider";

export default function SuccessModal() {
    const { modalData } = useModal();
    if (!modalData.isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center  z-50">
            <div className="bg-black bg-opacity-50 text-white p-6 rounded-lg shadow-lg text-center">
                <div className="flex justify-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-green-500 rounded-full">
                        <svg
                            className="w-10 h-10 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>
                <p className="text-lg font-semibold mt-4">
                    {modalData.text}
                </p>
            </div>
        </div>
    );
}
