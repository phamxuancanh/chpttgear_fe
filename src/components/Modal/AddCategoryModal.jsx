import { use, useState } from "react";
import { createCategory } from "../../routers/ApiRoutes";
import { ClockLoader } from "react-spinners";
import { FaTimes } from "react-icons/fa";


export default function AddCategoryModal({ setShowCategoryModal }) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (validate()) {
            try {
                const newCategory = { name, description };
                const response = await createCategory(newCategory);
                if (response.status === 201) {
                    setShowCategoryModal({ show: false });
                }
            } catch (error) {

            }
            handleReset();
        }
    };

    const handleReset = () => {
        setName("");
        setDescription("");
        setShowCategoryModal({ show: false });
    };

    const validate = () => {
        if (!name) {
            alert("Tên loại sản phẩm không được để trống");
            return false;
        }
        if (!description) {
            alert("Mô tả không được để trống");
            return false;
        }
        return true;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-30">
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-50">
                    <div className="flex justify-center items-center w-full h-140 mt-20">
                        <ClockLoader
                            className="flex justify-center items-center w-full mt-20"
                            color="#5EEAD4"
                            cssOverride={{
                                display: 'block',
                                margin: '0 auto',
                                borderColor: 'blue'
                            }}
                            loading
                            speedMultiplier={3}
                            size={40}
                        />
                    </div>
                </div>
            )}
            <div className="min-h-[80vh] max-h-[80vh] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 w-10/12 ">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold leading-6 text-gray-900">Thông tin loại sản phẩm</h3>
                    <button
                        type="button"
                        onClick={() => setShowCategoryModal({ show: false })}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>
                <div className="w-full mx-auto max-h-[65vh] overflow-y-auto">
                    <div className="space-y-8 divide-y divide-gray-200 w-full">
                        <div className="space-y-6">
                            <div className="w-full ">
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700">Tên loại sản phẩm</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="mt-1 block w-full p-3 border   rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                        <textarea
                            name="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 p-3 block w-full shadow-sm border border-gray-300   rounded-md  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="pt-5">
                        <div className="flex justify-end gap-3 mb-8">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                onClick={handleReset}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Đang lưu..." : "Lưu"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
