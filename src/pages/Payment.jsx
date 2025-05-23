import { useEffect, useState } from "react";
import {
  FaPaypal,
  FaMoneyBillWave,
  FaChevronDown,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaEdit,
  FaPhone,
} from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import provinceData from "../assets/address/province.json";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateShippingFee,
  createOrder,
  createOrderItem,
  createPayment,
  createPaypalDeposit,
  createTransaction,
  deleteCartItem,
  editUserById,
  sendEmail,
} from "../routers/ApiRoutes";
import Loading from "../utils/Loading";
import AddressModal from "../components/Modal/AddressModal";
import { useModal } from "../context/ModalProvider";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { PiApproximateEqualsThin } from "react-icons/pi";
import { FaDongSign } from "react-icons/fa6";
import { toast } from "react-toastify";
import { updateUser } from "../redux/authSlice";
import { clearCart, removeItemFromCart } from "../redux/cartSlice";

export default function Payment() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState({
    id: "",
    name: "",
  });
  const [selectedDistrict, setSelectedDistrict] = useState({
    id: "",
    name: "",
  });
  const [selectedWard, setSelectedWard] = useState({ id: "", name: "" });
  const selectedItems = useSelector((state) => state.shoppingCart.selectItems);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [shippingFee, setShippingFee] = useState(0);
  const userFromRedux = useSelector((state) => state.auth.user);
  const addresses = userFromRedux?.address
    ? userFromRedux.address.split(";;").map((addr) => addr.split("|")[0].trim())
    : [];
  const [selectedAddress, setSelectedAddress] = useState(addresses[0] || "");
  const selectedCodeAddress = userFromRedux?.address
    ? userFromRedux.address
      .split(";;")
      .map((addr) => addr.split("|")[1].trim())[0]
    : "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { openModal } = useModal();
  const [date, setDate] = useState("");
  const [usdRate, setUsdRate] = useState(null);
  const [formData, setFormData] = useState({
    fullName: userFromRedux
      ? userFromRedux.firstName + " " + userFromRedux.lastName
      : "",
    phoneNumber: userFromRedux ? userFromRedux.phone : "",
    streetAddress: "",
    email: userFromRedux ? userFromRedux.email : "",
    paymentMethod: "",
  });
  const dispatch = useDispatch();
  const cartItems = selectedItems;

  // Khi chọn Tỉnh/Thành phố, cập nhật danh sách Quận/Huyện
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(
          "https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=8"
        );

        const parser = new XMLParser({ ignoreAttributes: false });
        const jsonData = parser.parse(response.data);

        setDate(jsonData.ExrateList.DateTime);

        if (jsonData.ExrateList && jsonData.ExrateList.Exrate) {
          const exrateArray = Array.isArray(jsonData.ExrateList.Exrate)
            ? jsonData.ExrateList.Exrate
            : [jsonData.ExrateList.Exrate];

          const usdRate = exrateArray.find(
            (rate) => rate["@_CurrencyCode"] === "USD"
          );

          if (usdRate) {
            setUsdRate(usdRate["@_Sell"]); // Lấy giá bán USD -> VND
          }
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchExchangeRate();
    setProvinces(provinceData);
    console.log(userFromRedux);
    console.log(cartItems);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedAddress || provinces.length === 0) return;

      const parts = selectedAddress.split(",").map((part) => part.trim());
      const provinceName = parts[parts.length - 1];
      const districtName = parts[parts.length - 2];
      const wardName = parts[parts.length - 3];
      const houseNumber = parts[parts.length - 4];

      const [toWard, toDistrict] = selectedCodeAddress.split(",");
      const totalWeight = selectedItems.reduce(
        (sum, item) => sum + item.weight * item.quantity,
        1
      );
      const res = await calculateShippingFee(
        parseInt(toDistrict),
        String(toWard),
        totalWeight,
        195800
      );
      setShippingFee(res);

      const province = provinces.find(
        (p) =>
          p.NameExtension?.includes(provinceName) ||
          p.ProvinceName === provinceName
      );
      if (!province) return;

      setSelectedProvince({
        id: province.ProvinceID,
        name: province.ProvinceName,
      });

      // Lấy danh sách quận/huyện từ tỉnh
      const filteredDistricts = province.Districts || [];
      setDistricts(filteredDistricts);

      // Nếu đã có quận/huyện, tiếp tục set quận/huyện
      const district = filteredDistricts.find(
        (d) =>
          d.NameExtension?.includes(districtName) ||
          d.DistrictName === districtName
      );
      if (district) {
        setSelectedDistrict({
          id: district.DistrictID,
          name: district.DistrictName,
        });

        // Lấy danh sách phường/xã từ quận/huyện
        const filteredWards = district.Wards || [];
        setWards(filteredWards);

        const ward = filteredWards.find(
          (w) => w.NameExtension.includes(wardName) || w.WardName === wardName
        );
        if (ward) {
          setSelectedWard({ id: ward.WardCode, name: ward.WardName });
          setFormData((prev) => ({
            ...prev,
            streetAddress: houseNumber,
          }));
          const totalWeight = selectedItems.reduce(
            (sum, item) => sum + item.weight * item.quantity,
            1
          );
          const res = await calculateShippingFee(
            parseInt(district?.DistrictID),
            String(ward?.WardCode),
            totalWeight,
            195800
          );
          setShippingFee(res);
        }
      }
    };
    fetchData();
  }, [selectedAddress, provinces]);

  const handleProvinceChange = (e) => {
    const provinceID = Number(e.target.value);
    const province = provinces.find((p) => p.ProvinceID === provinceID);

    if (province) {
      setSelectedProvince({
        id: province.ProvinceID,
        name: province.ProvinceName,
      });
      setDistricts(province.Districts);
    } else {
      setSelectedProvince({ id: "", name: "" });
      setDistricts([]);
    }

    setSelectedDistrict({ id: "", name: "" });
    setWards([]);
    setSelectedWard({ id: "", name: "" });
  };

  const handleDistrictChange = (e) => {
    const districtID = Number(e.target.value);
    const district = districts.find((d) => d.DistrictID === districtID);

    if (district) {
      setSelectedDistrict({
        id: district.DistrictID,
        name: district.DistrictName,
      });
      setWards(district.Wards);
    } else {
      setSelectedDistrict({ id: "", name: "" });
      setWards([]);
    }

    setSelectedWard({ id: "", name: "" });
  };

  const handleWardChange = async (e) => {
    const wardID = e.target.value;
    const ward = wards.find((w) => w.WardCode === wardID);

    if (ward) {
      setSelectedWard({ id: ward.WardCode, name: ward.WardName });
    } else {
      setSelectedWard({ id: "", name: "" });
    }
    const totalWeight = selectedItems.reduce(
      (sum, item) => sum + item.weight * item.quantity,
      1
    );
    const res = await calculateShippingFee(
      parseInt(selectedDistrict.id),
      String(wardID),
      totalWeight,
      195800
    );
    setShippingFee(res);
  };

  const validateForm = () => {
    const errors = {};

    if (!(formData.fullName || "").trim()) {
      errors.fullName = "Họ và tên không được để trống.";
    }

    if (!(formData.phoneNumber || "").trim()) {
      errors.phoneNumber = "Số điện thoại không được để trống.";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Số điện thoại phải gồm 10 chữ số.";
    }

    if (!(formData.streetAddress || "").trim()) {
      errors.streetAddress = "Địa chỉ không được để trống.";
    }

    if (!(formData.email || "").trim()) {
      errors.email = "Email không được để trống.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email không đúng định dạng.";
    }

    if (!(formData.paymentMethod || "").trim()) {
      errors.paymentMethod = "Vui lòng chọn phương thức thanh toán.";
    }

    return errors;
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

    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setLoading(false);
      return;
    }

    const totalAmountVnd =
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0) +
      shippingFee;
    let prepaidAmount = 0;
    const isHighValueCOD =
      formData.paymentMethod === "COD" && totalAmountVnd > 50000000;

    if (isHighValueCOD) {
      const confirmed = window.confirm(
        "Giá trị đơn hàng vượt quá 50 triệu, bạn cần đặt cọc 10% giá trị đơn hàng qua PayPal. Bạn có muốn tiếp tục?"
      );
      if (!confirmed) {
        setLoading(false);
        return;
      }
      prepaidAmount = Math.ceil(totalAmountVnd * 0.1);
    }

    const basePayload = {
      user_id: userFromRedux.id,
      total_amount: totalAmountVnd,
      payment_method: formData.paymentMethod,
      shipping_amount: shippingFee,
      status: isHighValueCOD ? "PENDING_PAYMENT" : "PENDING",
      provinceCode: String(selectedProvince.id),
      districtCode: String(selectedDistrict.id),
      wardCode: String(selectedWard.id),
      houseNumber: `${formData.streetAddress}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`,
      email: formData.email,
      phone: formData.phoneNumber,
      prepaid_amount: prepaidAmount,
    };

    const shouldSaveAddress = !addresses.includes(basePayload.houseNumber);
    if (shouldSaveAddress) {
      const confirmed = window.confirm(
        "Có vẻ bạn đang sử dụng một địa chỉ mới. Bạn có muốn lưu địa chỉ này không?"
      );
      if (confirmed) {
        await saveNewAddress(basePayload.houseNumber);
      }
    }

    try {
      const resOrder = await createOrder(basePayload);
      if (resOrder.status !== 201) throw new Error("Tạo đơn hàng thất bại");

      const orderData = resOrder.data;
      const orderId = orderData.order.order_id;

      await createOrderItems(orderId);
      await sendOrderConfirmationEmail(formData.email, orderData, cartItems);
      await clearCart();

      if (formData.paymentMethod === "PAYPAL" || isHighValueCOD) {
        const amount = isHighValueCOD ? prepaidAmount : totalAmountVnd;

        const payment = await createPayment({
          order_id: orderId,
          user_id: userFromRedux.id,
          payment_method: "PAYPAL",
          amount: totalAmountVnd,
        });

        const transaction = await createTransaction({
          payment_id: payment.data.payment_id,
          user_id: userFromRedux.id,
          transaction_type: "DEBIT",
          amount,
          status: "INIT",
        });

        const paypalRes = await createPaypalDeposit({
          ...basePayload,
          transaction_id: transaction.data.transaction_id,
          order_id: orderId,
        });

        const approvalUrl = paypalRes.data.approvalUrl;
        if (approvalUrl) {
          window.location.href = approvalUrl;
          return;
        } else {
          throw new Error("Không tìm thấy approvalUrl từ PayPal");
        }
      }

      await createPayment({
        order_id: orderId,
        user_id: userFromRedux.id,
        payment_method: "COD",
        amount: totalAmountVnd,
      });

      openModal("Tạo đơn hàng thành công");
      navigate("/orders");
    } catch (error) {
      console.error("Lỗi khi xử lý đơn hàng:", error);
      alert("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const saveNewAddress = async (addressStr) => {
    const existingAddresses = userFromRedux?.address
      ? userFromRedux.address.split(";;")
      : [];
    const newAddress = `${addressStr}|${selectedWard.id},${selectedDistrict.id},${selectedProvince.id}`;
    const updatedAddresses = [...existingAddresses, newAddress].join(";;");

    const response = await editUserById(userFromRedux.id, {
      address: updatedAddresses,
    });
    if (response.status === 200) {
      toast.success("Đã lưu địa chỉ mới");
      dispatch(updateUser(response.data));
    } else {
      toast.error("Lưu địa chỉ thất bại");
    }
  };

  const createOrderItems = async (orderId) => {
    await Promise.all(
      cartItems.map((item) =>
        createOrderItem({
          order_id: orderId,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
          profit: item.profit,
        })
      )
    );
  };

  const sendOrderConfirmationEmail = async (email, orderData, cartItems) => {
    const formatCurrency = (value) =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);

    const emailContext = {
      orderId: orderData.order.order_id,
      orderDate: orderData.order.createdAt,
      orderTotal: formatCurrency(orderData.order.total_amount),
      shippingFee: formatCurrency(orderData.order.shipping_amount),
      totalAmount: formatCurrency(
        orderData.order.total_amount + orderData.order.shipping_amount
      ),
      address: orderData.order.houseNumber,
      products: cartItems.map((item) => ({
        imageUrl: item.image.split(",")[0],
        name: item.name,
        price: formatCurrency(item.price),
        quantity: item.quantity,
      })),
    };

    try {
      await sendEmail(email, emailContext);
    } catch (err) {
      console.error("Gửi email thất bại:", err);
    }
  };

  const clearCart = async () => {
    await Promise.all(
      cartItems.map(async (item) => {
        try {
          await deleteCartItem(item.itemId);
          dispatch(removeItemFromCart({ itemId: item.itemId }));
        } catch (err) {
          console.error("Xóa item thất bại:", item.itemId, err);
        }
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {loading && <Loading />}
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between w-full max-w-4xl mx-auto mb-5">
        {/* Phần bên trái - Thông tin cá nhân */}
        <div className="flex items-center gap-4">
          {/* <img
            src={userFromRedux.avatar}
            alt="Avatar"
            className="w-16 h-16 rounded-full border shadow"
          /> */}
          <div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaUser className="text-blue-500" />
              <span className="font-semibold">
                {userFromRedux?.firstName + " " + userFromRedux?.lastName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 mt-1">
              <FaEnvelope className="text-green-500" />
              <span>{userFromRedux?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 mt-1">
              <FaPhone className="text-green-500" />
              <span>{userFromRedux?.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <FaMapMarkerAlt className="text-red-500" />
              <span>{selectedAddress}</span>
            </div>
          </div>
        </div>

        {/* Phần bên phải - Nút chọn địa chỉ */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <FaEdit />
          Thay đổi địa chỉ
        </button>
        <AddressModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={userFromRedux}
          onSelect={(newAddress) => {
            setSelectedAddress(newAddress);
            // handleSelectAddress(newAddress);
            setIsModalOpen(false);
          }}
          setShippingFee={setShippingFee}
        />
      </div>
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
              <label
                htmlFor="province"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tỉnh/Thành phố:
              </label>
              <select
                id="province"
                name="province"
                value={selectedProvince.id}
                onChange={handleProvinceChange}
                className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
        ${errors.province ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                {provinces.map((province) => (
                  <option key={province.ProvinceID} value={province.ProvinceID}>
                    {province.ProvinceName}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="text-red-500 mt-1 text-sm">{errors.province}</p>
              )}
            </div>

            {/* Quận/Huyện */}
            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Quận/Huyện:
              </label>
              <select
                id="district"
                name="district"
                value={selectedDistrict.id}
                onChange={handleDistrictChange}
                className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
        ${errors.district ? "border-red-500" : "border-gray-300"}`}
                disabled={!selectedProvince.id}
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map((district) => (
                  <option key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-red-500 mt-1 text-sm">{errors.district}</p>
              )}
            </div>

            {/* Phường/Xã */}
            <div className="md:col-span-2">
              <label
                htmlFor="ward"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phường/Xã:
              </label>
              <select
                id="ward"
                name="ward"
                value={selectedWard.id}
                onChange={handleWardChange}
                className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
        ${errors.ward ? "border-red-500" : "border-gray-300"}`}
                disabled={!selectedDistrict.id}
              >
                <option value="">Chọn Phường/Xã</option>
                {wards.map((ward) => (
                  <option key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </option>
                ))}
              </select>
              {errors.ward && (
                <p className="text-red-500 mt-1 text-sm">{errors.ward}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="streetAddress"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
              {errors.streetAddress && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.streetAddress}
                </p>
              )}
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

          <h2 className="text-xl font-semibold text-gray-800">Giỏ hàng</h2>
          <div className="md:col-span-2 bg-gray-200 p-4 rounded-md shadow-md">
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item.itemId}
                  className="p-4 bg-white rounded-lg shadow flex items-center gap-4"
                >
                  <img
                    src={item.image.split(",")[0]}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-md font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-gray-700">
                      Đơn giá:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}
                    </p>
                  </div>
                  <p className="text-gray-700">Số lượng: {item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="md:col-span-2 bg-gray-200 p-4 mt-6 rounded-md shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Thanh toán
              </h2>
              <div className="p-4 bg-white rounded-lg shadow">
                {/* Tổng tiền hàng */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-md text-gray-900">Tổng tiền hàng:</span>
                  <span className="text-md font-semibold text-gray-700 flex justify-start items-center">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(
                      cartItems.reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                      )
                    )}{" "}
                  </span>
                </div>

                {/* Phí ship */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-md text-gray-900">Phí vận chuyển:</span>
                  <span className="text-md font-semibold text-gray-700 flex justify-start items-center">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(shippingFee)}
                  </span>
                </div>

                <hr className="my-2" />

                {/* Tổng thanh toán cuối cùng */}
                <div className="flex justify-between items-center text-lg font-bold text-red-600 ">
                  <span>Tổng cộng:</span>
                  <span className="flex justify-start items-center">
                    {" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(
                      cartItems.reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                      ) + shippingFee
                    )}
                  </span>
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
                <div className="flex flex-col items-start">
                  <div className="flex items-center">
                    <FaPaypal className="text-indigo-500 text-2xl mr-3" />
                    <span className="text-gray-800 font-semibold">PayPal</span>
                  </div>
                  <span className="text-red-600 text-sm mt-1 flex justify-start items-center">
                    1 USD <PiApproximateEqualsThin className="mx-1" /> {usdRate}{" "}
                    VNĐ {date}
                  </span>
                </div>
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
                <span className="text-gray-800">
                  Thanh toán khi nhận hàng (COD)
                </span>
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
              Đơn hàng của bạn sẽ được giao bởi GHN Express, đảm bảo dịch vụ
              giao hàng nhanh chóng và đáng tin cậy trên toàn quốc.
            </p>
          </div>

          {/* <Link to="/confirm-checkout"> */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-4"
          >
            Tiếp tục
          </button>
          {/* </Link> */}
        </form>
      </div>
    </div>
  );
}
