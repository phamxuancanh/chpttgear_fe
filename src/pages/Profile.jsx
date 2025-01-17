import { useEffect, useState } from "react";
import { FiEdit2, FiMail, FiPhone, FiMapPin, FiCalendar, FiActivity, FiLock, FiStar, FiHome } from "react-icons/fi";
import { getFromLocalStorage } from "../utils/functions";
import { editUserById, findUserById } from "../routers/ApiRoutes";

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "Nguyen Van A",
        email: "nguyenvana@example.com",
        phone: "+84 123 456 789",
        addresses: [
            {
                id: 1,
                address: "123 Nguyen Hue, District 1, Ho Chi Minh City",
                isDefault: true
            },
            {
                id: 2,
                address: "456 Le Loi, District 3, Ho Chi Minh City",
                isDefault: false
            }
        ],
        dob: "1990-01-01",
        loyaltyPoints: 2500,
        membershipLevel: "Gold"
    });

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
                console.log(response.data);
                setUser(response.data);
                setFormData(response.data);
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

    const handleSetDefaultAddress = (addressId) => {
        setFormData((prev) => ({
            ...prev,
            addresses: prev.addresses.map((addr) => ({
                ...addr,
                isDefault: addr.id === addressId
            }))
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await editUserById(currentUserLS.id, formData);
        if (response.status === 200) {
            alert("Update user successfully");
            console.log(response);
        }
        else {
            alert("Update user failed");
        }

        setIsEditing(false);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setIsChangingPassword(false);
    };

    const ProfileHeader = () => (
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
                    <h1 className="text-3xl font-bold text-gray-800">{formData.name}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                        <FiStar className="text-yellow-500" />
                        <span className="text-gray-600">{formData.membershipLevel} Member</span>
                        <span className="text-gray-600">|</span>
                        <span className="text-gray-600">{formData.loyaltyPoints} Points</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const ProfileDetails = () => (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Profile Details</h2>
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <FiMail className="text-gray-500 text-xl" />
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800">{formData.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <FiPhone className="text-gray-500 text-xl" />
                    <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-800">{formData.phone}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <FiCalendar className="text-gray-500 text-xl" />
                    <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="text-gray-800">{formData.dob}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const AddressSection = () => (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Shipping Addresses</h2>
                <button className="text-blue-600 hover:text-blue-700">
                    + Add New Address
                </button>
            </div>
            <div className="space-y-4">
                {/* {formData.addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <FiHome className="text-gray-500 text-xl mt-1" />
                                <div>
                                    <p className="text-gray-800">{address.address}</p>
                                    {address.isDefault && (
                                        <span className="text-sm text-green-600 mt-1">Default Address</span>
                                    )}
                                </div>
                            </div>
                            {!address.isDefault && (
                                <button
                                    onClick={() => handleSetDefaultAddress(address.id)}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Set as Default
                                </button>
                            )}
                        </div>
                    </div>
                ))} */}
            </div>
        </div>
    );

    const EditProfileForm = () => (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
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
                        value={formData.email}
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
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="dob">Date of Birth</label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formData.dob}
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
    );

    const PasswordChangeForm = () => (
        <form onSubmit={handlePasswordChange} className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="currentPassword">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
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
                >
                    Update Password
                </button>
            </div>
        </form>
    );

    const ActivitySection = () => (
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
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <ProfileHeader />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {isEditing ? (
                        <EditProfileForm />
                    ) : isChangingPassword ? (
                        <PasswordChangeForm />
                    ) : (
                        <>
                            <ProfileDetails />
                            <AddressSection />
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
                                onClick={() => setIsChangingPassword(true)}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <FiLock />
                                Change Password
                            </button>
                        </div>
                    </div>
                    <ActivitySection />
                </div>
            </div>
        </div>
    );
};

