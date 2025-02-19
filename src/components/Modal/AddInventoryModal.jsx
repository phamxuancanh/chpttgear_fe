import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import provinceData from "../../assets/address/province.json"
import Select from "react-select";
import { toast } from "react-toastify";
import { createInventory } from "../../routers/ApiRoutes";

export default function AddInventoryModal({ setShowCreateInventory }) {
    const [selectedProvince, setSelectedProvince] = useState({});
    const [selectedDistrict, setSelectedDistrict] = useState({});
    const [selectedWard, setSelectedWard] = useState({});
    const [listProvince, setListProvince] = useState([])
    const [listDistrict, setListDistrict] = useState([])
    const [listWard, setListWard] = useState([])
    const [formData, setFormData] = useState()
    const [name, setName] = useState(null)

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateInventory = async (e) => {
        console.log(name)
        console.log(formData)
        console.log(selectedProvince)
        console.log(selectedDistrict)
        console.log(selectedWard)
        e.preventDefault();

        try {
            if (!selectedProvince.id || !selectedDistrict.id || !selectedWard.id || !formData.address) {
                toast.error("Please select province, district and ward and enter address");
                return;
            }
            const newAddressToAdd =
                formData.address +
                " " +
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
            console.log(newAddressToAdd)
            const res = await createInventory(
                {
                    name: name,
                    address: newAddressToAdd,
                    quantity_in_stock: 0,
                    avarage_cost: 0

                })
            console.log('Stock-in successful:', res.data);
            setShowCreateInventory(false)
        } catch (error) {
            console.error("Error while creating inventory:", error);
            toast.error("Có lỗi xảy ra khi tạo kho");
            return;
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Product Details</h2>
                    <button onClick={() => setShowCreateInventory(false)} className="text-gray-500 hover:text-gray-700">
                        <FaTimes />
                    </button>
                </div>

                <div className="space-y-4 mb-4">
                    <p className="text-base font-semibold">Tên kho</p>
                    <div className="col-span-1">
                        <input
                            type="text"
                            value={name}
                            placeholder="Enter your inventory name"
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <p className="text-base font-semibold mt-3">Địa chỉ kho</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
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
                <div className="w-full flex justify-end items-center mt-5">
                    <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white font-semibold mr-3"
                        onClick={() => setShowCreateInventory(false)}
                    >Hủy</button>
                    <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white font-semibold"
                        onClick={(e) => handleCreateInventory(e)}
                    >Tạo kho</button>
                </div>
            </div>
        </div>
    )
}
