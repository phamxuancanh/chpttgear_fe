import { useEffect, useState } from "react";
import { FiEdit2, FiMail, FiPhone, FiMapPin, FiCalendar, FiActivity, FiLock, FiStar, FiHome } from "react-icons/fi";
import { getFromLocalStorage } from "../utils/functions";
import { changePassword, editUserById, findUserById } from "../routers/ApiRoutes";
import { toast } from "react-toastify";
import ChoiceModal from "../components/Modal/ChoiceModal";
export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [addressModalState, setAddressModalState] = useState({});
    const [formData, setFormData] = useState();

    const [activities] = useState([
        { id: 1, action: "Purchased Arduino Uno R3", date: "2024-01-15", points: 100 },
        { id: 2, action: "Ordered Raspberry Pi 4", date: "2024-01-14", points: 250 },
        { id: 3, action: "Updated shipping address", date: "2024-01-13", points: 0 }
    ]);
    const currentUserLS = getFromLocalStorage('persist:auth').currentUser;
    const [user, setUser] = useState(null);
    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await findUserById(currentUserLS.id);
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (currentUserLS) {
            getUser();
        }
    }, [currentUserLS?.id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSetDefaultAddress = async (address) => {

        let addressArray = user?.address ? user.address.split(";;").map(item => item.trim()) : [];

        const addressIndex = addressArray.indexOf(address);
        if (addressIndex === -1) {
            console.error("Address not found in the list.");
            return;
        }
        const updatedAddresses = [address, ...addressArray.filter(item => item !== address)];

        try {
            const response = await editUserById(currentUserLS.id, { ...formData, address: updatedAddresses.join(";;") });
            if (response.status === 200) {
                toast.success("Set default address successfully");
                setUser(response.data);
                setFormData(response.data);
            } else {
                toast.error("Set default address failed");
            }
        }
        catch (error) {
            toast.error("Set default address failed");
        }

    };


    const handleAddAddress = async (e) => {
        e.preventDefault();
        let currentUserAddresses = user?.address ? user.address.split(";;") : [];
        let newAddressToAdd = formData.address.trim();
        if (newAddressToAdd) {
            currentUserAddresses.push(newAddressToAdd)
        }
        const updatedAddresses = currentUserAddresses.join(";;");
        setFormData({ ...formData, address: updatedAddresses });

        const response = await editUserById(currentUserLS.id, { ...formData, address: updatedAddresses });

        if (response.status === 200) {
            toast.success("Add address successfully");
            setUser(response.data);
            setFormData(response.data);
        } else {
            toast.error("Add address failed");
        }
        setIsAddingAddress(false);
    };
    const handleOpenDeleteAdressModal = (address) => {
        setAddressModalState(prevState => ({ ...prevState, [address]: true }));
    };

    const handleCloseDeleteAdressModal = (address) => {
        setAddressModalState(prevState => ({ ...prevState, [address]: false }));
    }
    const handleDeleteAddress = async (addressToDelete) => {
        let currentUserAddresses = user?.address ? user.address.split(";;").map(item => item.trim()) : [];
        if (currentUserAddresses.length === 1) {
            toast.error("You must have at least one address");
            handleCloseDeleteAdressModal(addressToDelete);
            return;
        }
        let updatedAddresses = currentUserAddresses.filter(address => address !== addressToDelete);
        updatedAddresses = updatedAddresses.join(";;");
        setFormData(prevFormData => ({
            ...prevFormData,
            address: updatedAddresses
        }));
        const response = await editUserById(currentUserLS.id, { ...formData, address: updatedAddresses });
        if (response.status === 200) {
            toast.success("Delete address successfully");
            setUser(response.data);
            setFormData(response.data);
        } else {
            toast.error("Delete address failed");
        }
        handleCloseDeleteAdressModal(addressToDelete);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await editUserById(currentUserLS.id, formData);
        if (response.status === 200) {
            toast.success("Update user successfully");
            setUser(response.data);
            setFormData(response.data);
        }
        else {
            toast.error("Update user failed");
        }

        setIsEditing(false);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }
        try {
            const response = await changePassword(currentUserLS.id, formData);
            if (response.status === 200) {
                toast.success("Change password successfully");
                setUser(response.data);
                setFormData(response.data);
            }
            else {
                toast.error("Change password failed");
            }
        }
        catch (error) {
            toast.error("Change password failed");
        }
        finally {
            setIsChangingPassword(false);
        }
    };
    const splittedAddresses = user?.address?.split(";;");
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="relative mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative group">
                        <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg group-hover:opacity-80 transition-opacity"
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d";
                            }}
                        />
                        <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                            <input type="file" className="hidden" accept="image/*" />
                            <FiEdit2 className="text-white text-2xl" />
                        </label>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-800">{user?.firstName} {user?.lastName}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                            <FiStar className="text-yellow-500" />
                            <span className="text-gray-600"> Member</span>
                            <span className="text-gray-600">|</span>
                            <span className="text-gray-600"> Points</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-8">
                            <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData?.firstName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData?.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData?.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="phone">Phone</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData?.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="birthOfDate">Date of Birth</label>
                                    <input
                                        type="date"
                                        id="birthOfDate"
                                        name="birthOfDate"
                                        value={formData?.birthOfDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : isChangingPassword ? (
                        <form onSubmit={handlePasswordChange} className="bg-white rounded-xl shadow-md p-6 mb-8">
                            <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="currentPassword">Current Password</label>
                                    <input
                                        type="password"
                                        id="oldPassword"
                                        name="oldPassword"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="newPassword">New Password</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm New Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsChangingPassword(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    onClick={handlePasswordChange}
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                                <h2 className="text-2xl font-semibold mb-6">Profile Details</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <FiMail className="text-gray-500 text-xl" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="text-gray-800">{user?.email || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <FiPhone className="text-gray-500 text-xl" />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="text-gray-800">{user?.phone || "Chưa cập nhật"}</p>                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <FiCalendar className="text-gray-500 text-xl" />
                                        <div>
                                            <p className="text-sm text-gray-500">Date of Birth</p>
                                            <p className="text-gray-800">
                                                {user?.birthOfDate ? new Date(user.birthOfDate).toLocaleDateString() : "Chưa cập nhật"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-semibold">Shipping Addresses</h2>
                                    <button className="text-blue-600 hover:text-blue-700" onClick={() => setIsAddingAddress(true)}>
                                        + Add New Address
                                    </button>
                                </div>
                                {isAddingAddress && (
                                    <form className="space-y-4 mb-4">
                                        <div>
                                            <div className="flex items-center space-x-3 mb-2">
                                                <label className="block text-gray-700 font-bold" htmlFor="address">New Address</label>
                                                <button className="text-blue-600 hover:text-blue-700" onClick={(e) => handleAddAddress(e)}>Save</button>
                                                <button className="text-blue-600 hover:text-blue-700" onClick={() => setIsAddingAddress(false)}>Cancel</button>
                                            </div>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                placeholder="Enter your new address"
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </form>
                                )}
                                <div className="space-y-4">
                                    {splittedAddresses?.map((address, index) => (
                                        <div key={index} className="border rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <FiHome className="text-gray-500 text-xl mt-1" />
                                                    <div>
                                                        <p className="text-gray-800">{address}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {/* Nếu là phần tử đầu tiên, hiển thị "Default Address" */}
                                                    {index === 0 ? (
                                                        <span className="text-sm text-green-600 font-semibold">Default Address</span>
                                                    ) : (
                                                        <>
                                                            {/* Hiển thị các nút cho các phần tử khác */}
                                                            <button
                                                                onClick={() => handleSetDefaultAddress(address)}
                                                                className="text-sm text-blue-600 hover:text-blue-700"
                                                            >
                                                                Set as Default
                                                            </button>
                                                            <button
                                                                className="text-sm text-red-600 hover:text-red-700"
                                                                onClick={() => handleOpenDeleteAdressModal(address)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                    <ChoiceModal
                                                        title="Delete Address"
                                                        modalOpen={addressModalState[address] || false}
                                                        setModalOpen={(value) => setAddressModalState(prevState => ({ ...prevState, [address]: value }))}
                                                    >
                                                        <div className="text-sm mb-5">
                                                            <div className="space-y-2">
                                                                <p className="text-gray-500 font-bold">Delete Address {address}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap justify-end space-x-2">
                                                            <div className="space-x-2 flex w-1/3">
                                                                <button
                                                                    className="flex-1 border rounded-lg btn-sm border-slate-300 hover:border-slate-400 text-slate-600 p-2 font-bold text-sm"
                                                                    onClick={(e) => { e.stopPropagation(); handleCloseDeleteAdressModal(address) }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    className="flex-1 border rounded-lg btn-sm bg-indigo-500 hover:bg-indigo-600 text-white p-2 font-bold text-sm"
                                                                    onClick={() => handleDeleteAddress(address)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </ChoiceModal>
                                                </div>
                                            </div>
                                        </div>
                                    ))}


                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Quick Actions</h2>
                        </div>
                        <div className="space-y-4">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <FiEdit2 />
                                Edit Profile
                            </button>
                            <button
                                onClick={() => {
                                    if (user.type === 'google') {
                                        toast.info("Tài khoản này được đăng kí bằng Google. Vui lòng thay đổi mật khẩu bằng Google");
                                    } else {
                                        setIsChangingPassword(true);
                                    }
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <FiLock />
                                Change Password
                            </button>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <FiActivity className="text-gray-500 text-xl" />
                            <h2 className="text-2xl font-semibold">Recent Activities</h2>
                        </div>
                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <span className="text-gray-800">{activity.action}</span>
                                        {activity.points > 0 && (
                                            <span className="text-sm text-green-600 block">+{activity.points} points</span>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500">{activity.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};