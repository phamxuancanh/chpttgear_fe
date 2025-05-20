import { useCallback, useEffect, useRef, useState } from "react";
import { FiEdit2, FiMail, FiPhone, FiCalendar, FiActivity, FiLock, FiStar, FiHome } from "react-icons/fi";
import { changeAVT, changePassword, editUserById, findUserById } from "../routers/ApiRoutes";
import { toast } from "react-toastify";
import ChoiceModal from "../components/Modal/ChoiceModal";
import AVTChangeModal from '../components/Modal/ChangeAVTModal'
import ZoomModal from '../components/Modal/ZoomModal'
import AvatarEditor from 'react-avatar-editor'
import { MdAddPhotoAlternate } from "react-icons/md";
import provinceData from "../assets/address/province.json";
import Select from "react-select";
import { useSelector } from 'react-redux';
import { ClockLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { updateUser } from "../redux/authSlice";


export default function Profile() {
    const fileInputRef = useRef(null)
    const [imageSrc, setImageSrc] = useState('')
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [isAddingAddress, setIsAddingAddress] = useState(false)
    const [addressModalState, setAddressModalState] = useState({})
    const [choiceAVTModalOpen, setChoiceAVTModalOpen] = useState(false)
    const [zoomModalAVTOpen, setZoomModalAVTOpen] = useState(false)
    const [formData, setFormData] = useState()
    const [zoom, setZoom] = useState(1)
    const [rotate, setRotate] = useState(0)
    const cropRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [listProvince, setListProvince] = useState([])
    const [listDistrict, setListDistrict] = useState([])
    const [listWard, setListWard] = useState([])
    const [selectedProvince, setSelectedProvince] = useState({});
    const [selectedDistrict, setSelectedDistrict] = useState({});
    const [selectedWard, setSelectedWard] = useState({});
    const dispatch = useDispatch();
    const userFromRedux = useSelector((state) => state.auth.user);
    // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const provinces = provinceData.map((province) => ({
            id: province.ProvinceID,
            name: province.ProvinceName
        }));
        setListProvince(provinces);
        const districts = provinceData
            .flatMap((province) => province.Districts)
            .map((district) => ({
                id: district.DistrictID,
                name: district.DistrictName,
                provinceID: district.ProvinceID
            }));
        setListDistrict(districts);
        const wards = provinceData
            .flatMap((province) => province.Districts)
            .flatMap((district) => district.Wards)
            .map((ward) => ({
                id: ward.WardCode,
                name: ward.WardName,
                districtId: ward.DistrictID
            }));
        setListWard(wards);
    }, []);

    const handleProvinceChange = (selectedOption) => {
        if (selectedOption) {
            setSelectedProvince({
                id: selectedOption.value,
                name: selectedOption.label,
            });
        } else {
            setSelectedProvince({ id: "", name: "" });
        }
        // Reset district và ward khi đổi province
        setSelectedDistrict({ id: "", name: "" });
        setSelectedWard({ id: "", name: "" });
    };
    const handleDistrictChange = (selectedOption) => {
        if (selectedOption) {
            setSelectedDistrict({
                id: selectedOption.value,
                name: selectedOption.label,
            });
        } else {
            setSelectedDistrict({ id: "", name: "" });
        }
        // Reset ward khi đổi district
        setSelectedWard({ id: "", name: "" });
    };
    const handleWardChange = (selectedOption) => {
        if (selectedOption) {
            setSelectedWard({
                id: selectedOption.value,
                name: selectedOption.label,
            });
        } else {
            setSelectedWard({ id: "", name: "" });
        }
    };

    const filteredDistricts = listDistrict.filter(
        (district) => String(district.provinceID) === String(selectedProvince.id)
    );

    const filteredWards = listWard.filter(
        (ward) => String(ward.districtId) === String(selectedDistrict.id)
    );

    const [activities] = useState([
        { id: 1, action: "Purchased Arduino Uno R3", date: "2024-01-15", points: 100 },
        { id: 2, action: "Ordered Raspberry Pi 4", date: "2024-01-14", points: 250 },
        { id: 3, action: "Updated shipping address", date: "2024-01-13", points: 0 }
    ]);
    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await findUserById(userFromRedux.id);
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (userFromRedux) {
            getUser();
        }
    }, [userFromRedux?.id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSetDefaultAddress = async (address) => {
        setLoading(true);
        let addressArray = user?.address ? user.address.split(";;").map(item => item.trim()) : [];
        const addressIndex = addressArray.indexOf(address);
        if (addressIndex === -1) {
            console.error("Address not found in the list.");
            return;
        }
        const updatedAddresses = [address, ...addressArray.filter(item => item !== address)];
        try {
            const response = await editUserById(userFromRedux.id, { ...formData, address: updatedAddresses.join(";;") });
            if (response.status === 200) {
                toast.success("Set default address successfully");
                setUser(response.data);
                setFormData(response.data);
                dispatch(updateUser(response.data));
            } else {
                toast.error("Set default address failed");
            }
        }
        catch (error) {
            toast.error("Set default address failed");
        }
        setLoading(false);
    };
    const handleCancelAddAddress = () => {
        setIsAddingAddress(false);
        setSelectedProvince({});
        setSelectedDistrict({});
        setSelectedWard({});
        setFormData({ ...formData, address: "" });
    };
    const handleAddAddress = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (!selectedProvince.id || !selectedDistrict.id || !selectedWard.id || !formData.address) {
            toast.error("Please select province, district and ward and enter address");
            return;
        }
        let currentUserAddresses = user?.address ? user.address.split(";;") : [];
        console.log(currentUserAddresses)
        let newAddressToAdd =
            formData.address.trim() +
            ", " +
            selectedWard.name +
            ", " +
            selectedDistrict.name +
            ", " +
            selectedProvince.name +
            "|" +
            selectedWard.id +
            "," +
            selectedDistrict.id +
            "," +
            selectedProvince.id;
        const normalizedNewAddress = newAddressToAdd.toLowerCase().trim();
        const normalizedAddresses = currentUserAddresses.map((address) =>
            address.toLowerCase().trim()
        );
        if (normalizedAddresses.includes(normalizedNewAddress)) {
            toast.error("This address already exists");
            return;
        }
        currentUserAddresses.push(newAddressToAdd);
        const updatedAddresses = currentUserAddresses.join(";;");
        console.log(updatedAddresses)
        setFormData({ ...formData, address: updatedAddresses });
        try {
            setLoading(true);
            const response = await editUserById(userFromRedux.id, { ...formData, address: updatedAddresses });
            if (response.status === 200) {
                toast.success("Add address successfully");
                setUser(response.data);
                dispatch(updateUser(response.data));
            } else {
                toast.error("Add address failed");
            }
        } catch (error) {
            toast.error("Add address failed");
        } finally {
            setIsAddingAddress(false);
            setSelectedProvince({});
            setSelectedDistrict({});
            setSelectedWard({});
            setLoading(false);
        }
    };


    const handleOpenDeleteAdressModal = (address) => {
        setAddressModalState(prevState => ({ ...prevState, [address]: true }));
    };

    const handleCloseDeleteAdressModal = (address) => {
        setAddressModalState(prevState => ({ ...prevState, [address]: false }));
    }
    const handleDeleteAddress = async (addressToDelete) => {
        setLoading(true);
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
        const response = await editUserById(userFromRedux.id, { ...formData, address: updatedAddresses });
        if (response.status === 200) {
            toast.success("Delete address successfully");
            setUser(response.data);
            setFormData(response.data);
            dispatch(updateUser(response.data));
        } else {
            toast.error("Delete address failed");
        }
        setLoading(false);
        handleCloseDeleteAdressModal(addressToDelete);
    };
    
    const validateForm = () => {
        const nameRegex = /^[A-Za-zÀ-Ỹà-ỹ\s]{2,50}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\d{9,15}$/;
        const firstName = formData?.firstName ?? user?.firstName ?? "";
        const lastName = formData?.lastName ?? user?.lastName ?? "";
        const email = formData?.email ?? user?.email ?? "";
        const phone = formData?.phone ?? user?.phone ?? "";
        const birthOfDate = formData?.birthOfDate ?? user?.birthOfDate ?? "";

        if (!firstName || !nameRegex.test(firstName)) {
            toast.error("Tên không hợp lệ");
            return false;
        }
        if (!lastName || !nameRegex.test(lastName)) {
            toast.error("Họ không hợp lệ");
            return false;
        }
        if (!email || !emailRegex.test(email)) {
            toast.error("Email không hợp lệ");
            return false;
        }
        if (!phone || !phoneRegex.test(phone)) {
            toast.error("Số điện thoại không hợp lệ");
            return false;
        }
        if (!birthOfDate) {
            toast.error("Vui lòng nhập ngày sinh");
            return false;
        }

        const birthYear = new Date(birthOfDate).getFullYear();
        const currentYear = new Date().getFullYear();
        if (currentYear - birthYear < 13) {
            toast.error("Bạn phải từ 13 tuổi trở lên");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        console.log(formData);
        const response = await editUserById(userFromRedux.id, formData);
        if (response.status === 200) {
            toast.success("Cập nhật thông tin thành công");
            setUser(response.data);
            setFormData(response.data);
            dispatch(updateUser(response.data));
        } else {
            toast.error("Cập nhật thông tin thất bại");
        }
        setIsEditing(false);
        setLoading(false);
    };

    const validatePassword = () => {
        if (!formData.newPassword || formData.newPassword.trim().length < 6) {
            toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
            return false;
        }
        if (formData.newPassword === formData.currentPassword) {
            toast.error("Mật khẩu mới không được trùng với mật khẩu hiện tại");
            return false;
        }
        return true;
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        try {
            setLoading(true);
            const response = await changePassword(userFromRedux.id, formData);
            if (response.status === 200) {
                toast.success("Đổi mật khẩu thành công");
                setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                toast.error("Đổi mật khẩu thất bại");
            }
        } catch (error) {
            toast.error("Đổi mật khẩu thất bại");
        } finally {
            setIsChangingPassword(false);
            setLoading(false);
        }
    };
    const handleOpenChangeAVTModal = useCallback(() => {
        setChoiceAVTModalOpen(true)
    }, [])

    const splittedAddresses = user?.address?.split(";;");
    const handleInputZoomChange = (event) => {
        const zoomValue = event.target.value;
        setZoom(zoomValue);
    };

    const handleInputRotateChange = (event) => {
        const rotateValue = event.target.value;
        setRotate(rotateValue);
    };
    const handleUploadClick = (event) => {
        event.stopPropagation();
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (validTypes.includes(file.type)) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageSrc(reader.result);
                    setChoiceAVTModalOpen(false);
                    setZoomModalAVTOpen(true);
                };
                reader.readAsDataURL(file);
            } else {
                toast.error('Không đúng định dạng ảnh');
            }
        }
    };
    const handleSaveAVT = async () => {
        try {
            setLoading(true);
            let dataUrl = user?.avatar || '';
            if (cropRef.current) {
                const canvas = cropRef.current.getImage();
                dataUrl = canvas.toDataURL();
            }

            if (dataUrl) {
                const result = await fetch(dataUrl);
                const blob = await result.blob();
                const fDT = new FormData();
                fDT.append('avatar', blob, 'avatar.png');
                // Kiểm tra nội dung FormData
                let response = { status: 400 };
                if (user?.id) {
                    response = await changeAVT(user.id, fDT);
                }

                if (response.status === 200) {
                    console.log(response.data);
                    toast.success('Đổi ảnh đại diện thành công');
                    setImageSrc(user?.avatar || '');
                    setUser({ ...user, avatar: response.data.avatar });
                    dispatch(updateUser({ ...userFromRedux, avatar: response.data.avatar }));
                    setZoomModalAVTOpen(false);
                    setZoom(1);
                    setRotate(0);
                } else {
                    toast.error('Đổi ảnh đại diện thất bại');
                }
            } else {
                toast.error('Không thể lưu ảnh đại diện');
            }
        } catch (error) {
            console.error('An error occurred while changing the avatar:', error);
            toast.error('An error occurred while changing the avatar');
        }
        finally {
            setLoading(false);
        }
    };
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    };
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-50">
                    <div className="flex justify-center items-center w-full h-140 mt-20">
                        <ClockLoader
                            className='flex justify-center items-center w-full mt-20'
                            color='#5EEAD4'
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
            <div className="relative mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative group">
                        {user?.avatar && (
                            <img
                                src={userFromRedux?.avatar}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover border-4 border-green-400 shadow-lg group-hover:opacity-80 transition-opacity"
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d";
                                }}
                            />
                        )}
                        <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleOpenChangeAVTModal}>
                            {/* <input type="file" className="hidden" accept="image/*" /> */}
                            <FiEdit2 className="text-white text-2xl" />
                        </label>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-800">{user?.firstName} {user?.lastName}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                            <FiStar className="text-sky-500" />
                            <span className="text-gray-600">Thành viên Bạch Kim</span>
                            <span className="text-gray-600">|</span>
                            <span className="text-gray-600">{user?.score} Điểm</span>
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
                                        value={formData?.firstName ?? user?.firstName}
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
                                        value={formData?.lastName ?? user?.lastName}
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
                                        value={formData?.email ?? user?.email}
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
                                        value={formData?.phone ?? user?.phone}
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
                                        value={formatDate(formData?.birthOfDate) || formatDate(user?.birthOfDate)}
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
                            <h2 className="text-2xl font-semibold mb-6">Đổi mật khẩu</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="currentPassword">Mật khẩu hiện tại</label>
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
                                    <label className="block text-gray-700 mb-2" htmlFor="newPassword">Mật khẩu mới</label>
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
                                    <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
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
                                <h2 className="text-2xl font-semibold mb-6">Thông tin cá nhân</h2>
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
                                            <p className="text-sm text-gray-500">Số điện thoại</p>
                                            <p className="text-gray-800">{user?.phone || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <FiCalendar className="text-gray-500 text-xl" />
                                        <div>
                                            <p className="text-sm text-gray-500">Ngày sinh</p>
                                            <p className="text-gray-800">
                                                {user?.birthOfDate ? new Date(user.birthOfDate).toLocaleDateString() : "Chưa cập nhật"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-semibold">Địa chỉ giao hàng</h2>
                                    <button className="text-blue-600 hover:text-blue-700" onClick={() => setIsAddingAddress(true)}>
                                        + Thêm địa chỉ mới
                                    </button>
                                </div>
                                {isAddingAddress && (
                                    <form className="space-y-4 mb-4">
                                        <div>
                                            <div className="flex items-center space-x-3 mb-2">
                                                <label className="block text-gray-700 font-bold" htmlFor="address">New Address</label>
                                                <button className="text-white hover:bg-blue-700 bg-blue-600 px-3 py-1 rounded-lg" onClick={(e) => handleAddAddress(e)}>Lưu</button>
                                                <button className="text-white hover:bg-red-700 bg-red-600 px-3 py-1 rounded-lg" onClick={handleCancelAddAddress}>Hủy</button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                                {/* Province Dropdown */}
                                                <div className="col-span-1">
                                                    <Select
                                                        value={
                                                            selectedProvince.id
                                                                ? { value: selectedProvince.id, label: selectedProvince.name }
                                                                : null
                                                        }
                                                        onChange={handleProvinceChange}
                                                        options={listProvince.map((province) => ({
                                                            value: province.id,
                                                            label: province.name,
                                                        }))}
                                                        placeholder="Select Province"
                                                    />
                                                </div>

                                                {/* District Dropdown */}
                                                <div className="col-span-1">
                                                    <Select
                                                        value={
                                                            selectedDistrict.id
                                                                ? { value: selectedDistrict.id, label: selectedDistrict.name }
                                                                : null
                                                        }
                                                        onChange={handleDistrictChange}
                                                        options={filteredDistricts.map((district) => ({
                                                            value: district.id,
                                                            label: district.name,
                                                        }))}
                                                        placeholder="Select District"
                                                        isDisabled={!selectedProvince.id}
                                                    />

                                                </div>
                                                {/* Ward Dropdown */}
                                                <div className="col-span-1">
                                                    <Select
                                                        value={
                                                            selectedWard.id
                                                                ? { value: selectedWard.id, label: selectedWard.name }
                                                                : null
                                                        }
                                                        onChange={handleWardChange}
                                                        options={filteredWards.map((ward) => ({
                                                            value: ward.id,
                                                            label: ward.name,
                                                        }))}
                                                        placeholder="Select Ward"
                                                        isDisabled={!selectedDistrict.id}
                                                    />
                                                </div>

                                                {/* Address Input */}
                                                <div className="col-span-1">
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
                                            </div>

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
                                                        <p className="text-gray-800">{address.split('|')[0]}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {/* Nếu là phần tử đầu tiên, hiển thị "Default Address" */}
                                                    {index === 0 ? (
                                                        <span className="text-sm text-green-600 font-semibold">Địa chỉ mặc định</span>
                                                    ) : (
                                                        <>
                                                            {/* Hiển thị các nút cho các phần tử khác */}
                                                            <button
                                                                onClick={() => handleSetDefaultAddress(address)}
                                                                className="text-sm text-blue-600 hover:text-blue-700"
                                                            >
                                                                Đặt làm mặc định
                                                            </button>
                                                            <button
                                                                className="text-sm text-red-600 hover:text-red-700"
                                                                onClick={() => handleOpenDeleteAdressModal(address)}
                                                            >
                                                                Xóa
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
                                                                <p className="text-gray-500 font-bold">Xóa địa chỉ {address}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap justify-end space-x-2">
                                                            <div className="space-x-2 flex w-1/3">
                                                                <button
                                                                    className="flex-1 border rounded-lg btn-sm border-slate-300 hover:border-slate-400 text-slate-600 p-2 font-bold text-sm"
                                                                    onClick={(e) => { e.stopPropagation(); handleCloseDeleteAdressModal(address) }}
                                                                >
                                                                    Hủy
                                                                </button>
                                                                <button
                                                                    className="flex-1 border rounded-lg btn-sm bg-indigo-500 hover:bg-indigo-600 text-white p-2 font-bold text-sm"
                                                                    onClick={() => handleDeleteAddress(address)}
                                                                >
                                                                    Xóa
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
                            <h2 className="text-xl font-semibold">Hoạt động</h2>
                        </div>
                        <div className="space-y-4">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <FiEdit2 />
                                Chỉnh sửa trang cá nhân
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
                                Đổi mật khẩu
                            </button>
                        </div>
                    </div>
                    {/* <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <FiActivity className="text-gray-500 text-xl" />
                            <h2 className="text-2xl font-semibold">Hoạt động gần đây</h2>
                        </div>
                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <span className="text-gray-800">{activity.action}</span>
                                        {activity.points > 0 && (
                                            <span className="text-sm text-green-600 block">+{activity.points} điểm</span>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500">{activity.date}</span>
                                </div>
                            ))}
                        </div>
                    </div> */}
                </div>
            </div>
            <AVTChangeModal
                title="Thay đổi ảnh đại diện"
                modalOpen={choiceAVTModalOpen}
                setModalOpen={setChoiceAVTModalOpen}
            >
                <div className='flex space-x-3'>
                    <div className='bg-teal-300 w-full rounded-md flex flex-col items-center justify-center p-5 space-y-3' onClick={handleUploadClick}>
                        <div className='rounded-full bg-sky-700 w-32 h-32 flex items-center justify-center cursor-pointer'>
                            <MdAddPhotoAlternate className='text-slate-300 cursor-pointer' fontSize='large' />
                        </div>
                        <div className='font-bold hover:text-gray-700 cursor-pointer'>Tải ảnh lên</div>
                    </div>
                    <input
                        type='file'
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept='.jpg,.jpeg,.png,.gif'
                        onChange={handleFileChange}
                    />
                </div>
            </AVTChangeModal>

            <ZoomModal
                title="Thu phóng & xoay ảnh"
                modalOpen={zoomModalAVTOpen}
                setModalOpen={setZoomModalAVTOpen}
            >
                {loading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-50">
                        <div className="flex justify-center items-center w-full h-140 mt-20">
                            <ClockLoader
                                className='flex justify-center items-center w-full mt-20'
                                color='#5EEAD4'
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
                <>
                    <AvatarEditor
                        ref={cropRef}
                        className="col-span-9 mx-auto mb-5 rounded-sm"
                        image={imageSrc}
                        width={320}
                        height={320}
                        border={50}
                        borderRadius={250}
                        scale={zoom}
                        rotate={rotate}
                    />
                    <label className="col-span-2 text-sm font-semibold text-dark-2">
                        Thu phóng
                    </label>
                    <input
                        type="range"
                        className="col-span-5 transparent h-[4px] w-full cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600 mt-2"
                        id="customRange1"
                        min={0}
                        max={2}
                        step={0.05}
                        value={zoom}
                        onChange={handleInputZoomChange}
                    />
                    <input
                        type="number"
                        className="bg-dark-2 text-dark-2 col-span-2 py-1.5 rounded-md text-sm font-semibold text-center"
                        min={0}
                        max={2}
                        step={0.05}
                        value={zoom}
                        onChange={handleInputZoomChange}
                    />
                    <div></div>
                    <label className="col-span-2 text-sm font-semibold text-dark-2">
                        Xoay
                    </label>
                    <input
                        type="range"
                        className="col-span-5 transparent h-[4px] w-full cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600 mt-2"
                        id="customRange1"
                        min={-180}
                        max={180}
                        value={rotate}
                        step={1}
                        onChange={handleInputRotateChange}
                    />
                    <input
                        type="number"
                        className="bg-dark-2 text-dark-2 col-span-2 py-1.5 rounded-md text-sm font-semibold text-center"
                        min={-180}
                        max={180}
                        step={1}
                        value={rotate}
                        onChange={handleInputRotateChange}
                    />
                </>
                <div className='flex justify-between m-3 font-bold'>
                    <div className='cursor-pointer hover:text-gray-700 hover:underline py-1' onClick={() => setZoomModalAVTOpen(false)}>Bỏ qua</div>
                    <div className='flex space-x-4'>
                        <div className='cursor-pointer hover:text-gray-700 hover:underline py-1' onClick={() => setZoomModalAVTOpen(false)}>Hủy</div>
                        <div className='cursor-pointer hover:text-gray-700 bg-teal-300 hover:bg-teal-500 rounded-md px-3 py-1' onClick={handleSaveAVT}>Lưu</div>
                    </div>
                </div>
            </ZoomModal>

        </div>
    );
};