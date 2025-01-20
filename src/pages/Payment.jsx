import { useEffect, useState } from "react";
import { FaPaypal, FaMoneyBillWave } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";

export default function Payment() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    deliveryAddress: "",
    email: "",
    paymentMethod: "",
  });

  const [errors, setErrors] = useState({});

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
    if (!formData.deliveryAddress.trim())
      newErrors.deliveryAddress = "Delivery address is required";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Handle form submission here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Payment Details
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
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
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="deliveryAddress"
              >
                Delivery Address
              </label>
              <textarea
                id="deliveryAddress"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                rows="3"
                className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.deliveryAddress ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.deliveryAddress && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.deliveryAddress}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 mt-1 text-sm">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`flex items-center p-4 rounded-lg border shadow-sm ${
                  formData.paymentMethod === "paypal"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300"
                } cursor-pointer hover:shadow-md`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === "paypal"}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <FaPaypal className="text-indigo-500 text-2xl mr-3" />
                <span className="text-gray-800">PayPal</span>
              </label>

              <label
                className={`flex items-center p-4 rounded-lg border shadow-sm ${
                  formData.paymentMethod === "cod"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300"
                } cursor-pointer hover:shadow-md`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <FaMoneyBillWave className="text-indigo-500 text-2xl mr-3" />
                <span className="text-gray-800">Cash on Delivery (COD)</span>
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
                Shipping Partner - GHN
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Your order will be delivered by GHN Express, ensuring fast and
              reliable delivery service across the country.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Complete Payment
          </button>
        </form>
      </div>
    </div>
  );
}
