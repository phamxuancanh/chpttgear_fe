import { useEffect, useState } from "react";
import { FaPaypal, FaMoneyBillWave } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import provinceData from "../assets/address/province.json";
import { useSelector } from "react-redux";
import { createOrder, createOrderItem } from "../routers/ApiRoutes";
import Loading from "../utils/Loading";

export default function Payment() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    deliveryAddress: "",
    email: "",
    paymentMethod: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const shippingFee = 5.00; // Giả sử phí ship cố định là $5
  const userFromRedux = useSelector((state) => state.auth.user);


  // Khi chọn Tỉnh/Thành phố, cập nhật danh sách Quận/Huyện
  useEffect(() => {
    setProvinces(provinceData)
    console.log(userFromRedux)
  }, []);

  // // Khi chọn Quận/Huyện, cập nhật danh sách Phường/Xã
  // useEffect(() => {
  //   if (selectedDistrict) {
  //     const district = districts.find((d) => d.DistrictID === parseInt(selectedDistrict));
  //     setWards(district?.Wards || []);
  //     setSelectedWard("");
  //   }
  // }, [selectedDistrict, districts]);

  const handleProvinceChange = (e) => {
    const provinceCode = Number(e.target.value);
    setSelectedProvince(provinceCode);

    const province = provinces.find(p => p.ProvinceID === provinceCode);

    if (province) {
      setDistricts(province.Districts);
    } else {
      setDistricts([]);
    }

    setSelectedDistrict('');
    setWards([]);
    setSelectedWard('');
  };

  const handleDistrictChange = (e) => {
    const districtCode = Number(e.target.value);
    setSelectedDistrict(districtCode);

    // Lọc phường/xã theo quận/huyện
    const district = districts.find(d => d.DistrictID === districtCode);
    setWards(district ? district.Wards : []);
    setSelectedWard('');
  };

  const handleWardChange = (e) => {
    const wardCode = Number(e.target.value);
    setSelectedWard(wardCode);
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("DRAFI_USER");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setFormData((prevData) => ({
        ...prevData,
        fullName: parsedUserData.display_name || "",
        phoneNumber: parsedUserData.phone || "",
        email: parsedUserData.email || "",
      }));
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    // if (!formData.deliveryAddress.trim())
    //   newErrors.deliveryAddress = "Delivery address is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Please select a payment method";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      alert("Vui lòng kiểm tra lại thông tin đơn hàng!");
      setLoading(false);
      return;
    }

    console.log("Form submitted:", formData);

    const payload = {
      user_id: userFromRedux.id,
      status: "PENDING",
      payment_method: formData.paymentMethod,
      total_amount: cartItems.reduce((total, item) => total + item.price * item.quantity, 0) + shippingFee,
      shipping_amount: shippingFee,
      provinceCode: String(selectedProvince),
      districtCode: String(selectedDistrict),
      wardCode: String(selectedWard),
      houseNumber: String(formData.streetAddress),
      email: userFromRedux.email
    };

    console.log(payload)

    try {
      const resOrder = await createOrder(payload);

      if (resOrder.status === 201) {
        const orderId = resOrder.data.order_id;
        console.log(orderId)

        const promises = cartItems.map(item =>
          createOrderItem({
            order_id: orderId,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            profit: item.profit,
          })
        );
        console.log(promises)
        await Promise.all(promises);
        console.log("Đơn hàng và sản phẩm đã được tạo thành công!");
        alert("Đơn hàng đã được tạo thành công!");
        navigate("/orders");
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      alert("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const cartItems = [
    {
      id: "P001",
      name: "Wireless Headphones",
      price: 59.99,
      quantity: 2,
      image: "https://via.placeholder.com/100",
      profit: 20.5
    },
    {
      id: "P002",
      name: "Intel i5-12400F",
      price: 19.99,
      quantity: 1,
      image: "https://via.placeholder.com/100",
      profit: 8.5
    },
    {
      id: "P003",
      name: "RAM Corsair Vengeance RGB 32GB DDR5 - 6000MHz",
      price: 39.99,
      quantity: 1,
      image: "https://via.placeholder.com/100",
      profit: 19.99
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {loading && <Loading />}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Hoàn tất đơn hàng
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Thông tin giao hàng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-md bg-gray-200 p-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="fullName"
              >
                Họ tên người nhận:
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.fullName && (
                <p className="text-red-500 mt-1 text-sm">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="phoneNumber"
              >
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Tỉnh/Thành phố */}
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                Tỉnh/Thành phố:
              </label>
              <select
                id="province"
                name="province"
                value={selectedProvince}
                onChange={handleProvinceChange}
                className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
        ${errors.province ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                {provinces.map((province) => (
                  <option key={province.ProvinceID} value={province.ProvinceID}>{province.ProvinceName}</option>
                ))}
              </select>
              {errors.province && <p className="text-red-500 mt-1 text-sm">{errors.province}</p>}
            </div>

            {/* Quận/Huyện */}
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                Quận/Huyện:
              </label>
              <select
                id="district"
                name="district"
                value={selectedDistrict}
                onChange={handleDistrictChange}
                className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
        ${errors.district ? "border-red-500" : "border-gray-300"}`}
                disabled={!selectedProvince}
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map((district) => (
                  <option key={district.DistrictID} value={district.DistrictID}>{district.DistrictName}</option>
                ))}
              </select>
              {errors.district && <p className="text-red-500 mt-1 text-sm">{errors.district}</p>}
            </div>

            {/* Phường/Xã */}
            <div className="md:col-span-2">
              <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-2">
                Phường/Xã:
              </label>
              <select
                id="ward"
                name="ward"
                value={selectedWard}
                onChange={handleWardChange}
                className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
        ${errors.ward ? "border-red-500" : "border-gray-300"}`}
                disabled={!selectedDistrict}
              >
                <option value="">Chọn Phường/Xã</option>
                {wards.map((ward) => (
                  <option key={ward.WardCode} value={ward.WardCode}>{ward.WardName}</option>
                ))}
              </select>
              {errors.ward && <p className="text-red-500 mt-1 text-sm">{errors.ward}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Số nhà, Tên đường:
              </label>
              <input
                type="text"
                id="streetAddress"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
    ${errors.streetAddress ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.streetAddress && <p className="text-red-500 mt-1 text-sm">{errors.streetAddress}</p>}
            </div>

            <div className="md:col-span-2">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="email"
              >
                Email liên hệ:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.email ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 mt-1 text-sm">{errors.email}</p>
              )}
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Giỏ hàng
          </h2>
          <div className="md:col-span-2 bg-gray-200 p-4 rounded-md shadow-md">
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 bg-white rounded-lg shadow flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                  <div className="flex-1">
                    <h3 className="text-md font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-700">Đơn giá: ${item.price.toFixed(2)}</p>
                  </div>
                  <p className="text-gray-700">Số lượng: {item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="md:col-span-2 bg-gray-200 p-4 mt-6 rounded-md shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Thanh toán</h2>
              <div className="p-4 bg-white rounded-lg shadow">
                {/* Tổng tiền hàng */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-md text-gray-900">Tổng tiền hàng:</span>
                  <span className="text-md font-semibold text-gray-700">${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
                </div>

                {/* Phí ship */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-md text-gray-900">Phí vận chuyển:</span>
                  <span className="text-md font-semibold text-gray-700">${shippingFee.toFixed(2)}</span>
                </div>

                <hr className="my-2" />

                {/* Tổng thanh toán cuối cùng */}
                <div className="flex justify-between items-center text-lg font-bold text-red-600">
                  <span>Tổng cộng:</span>
                  <span>${(cartItems.reduce((total, item) => total + item.price * item.quantity, 0) + shippingFee).toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Phương thức thanh toán
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-200 rounded-md p-4">
              <label
                className={`flex items-center p-4 rounded-lg border shadow-sm bg-white ${formData.paymentMethod === "PAYPAL"
                  ? "border-indigo-500 bg-indigo-200"
                  : "border-gray-300"
                  } cursor-pointer hover:shadow-md`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PAYPAL"
                  checked={formData.paymentMethod === "PAYPAL"}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <FaPaypal className="text-indigo-500 text-2xl mr-3" />
                <span className="text-gray-800">PayPal</span>
              </label>

              <label
                className={`flex items-center p-4 rounded-lg border shadow-sm bg-white ${formData.paymentMethod === "COD"
                  ? "border-indigo-500 bg-indigo-200"
                  : "border-gray-300"
                  } cursor-pointer hover:shadow-md`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === "COD"}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <FaMoneyBillWave className="text-indigo-500 text-2xl mr-3" />
                <span className="text-gray-800">Thanh toán khi nhận hàng (COD)</span>
              </label>
            </div>
            {errors.paymentMethod && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.paymentMethod}
              </p>
            )}
          </div>

          <div className="bg-indigo-50 p-5 rounded-lg shadow-md">
            <div className="flex items-center mb-3">
              <TbTruckDelivery className="text-2xl text-indigo-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">
                Đơn vị vận chuyển - GHN
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Đơn hàng của bạn sẽ được giao bởi GHN Express, đảm bảo dịch vụ giao hàng nhanh chóng và đáng tin cậy trên toàn quốc.
            </p>
          </div>

          {/* <Link to="/confirm-checkout"> */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-4"
          >
            Continue
          </button>
          {/* </Link> */}
        </form>
      </div>
    </div>
  );
}
