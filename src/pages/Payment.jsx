import { useState } from "react";
import { FaPaypal, FaMoneyBillWave } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";

export default function Payment() {
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        deliveryAddress: "",
        email: "",
        paymentMethod: ""
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
        if (!formData.deliveryAddress.trim()) newErrors.deliveryAddress = "Delivery address is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.paymentMethod) newErrors.paymentMethod = "Please select a payment method";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
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
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-lg p-6">
                <h1 className="text-heading font-heading text-foreground mb-6">Payment Details</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-foreground font-medium mb-2" htmlFor="fullName">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 rounded-md border ${errors.fullName ? "border-destructive" : "border-input"} focus:outline-none focus:ring-2 focus:ring-ring`}
                            />
                            {errors.fullName && (
                                <p className="text-destructive mt-1 text-sm">{errors.fullName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-foreground font-medium mb-2" htmlFor="phoneNumber">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 rounded-md border ${errors.phoneNumber ? "border-destructive" : "border-input"} focus:outline-none focus:ring-2 focus:ring-ring`}
                            />
                            {errors.phoneNumber && (
                                <p className="text-destructive mt-1 text-sm">{errors.phoneNumber}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-foreground font-medium mb-2" htmlFor="deliveryAddress">
                                Delivery Address
                            </label>
                            <textarea
                                id="deliveryAddress"
                                name="deliveryAddress"
                                value={formData.deliveryAddress}
                                onChange={handleInputChange}
                                rows="3"
                                className={`w-full px-4 py-2 rounded-md border ${errors.deliveryAddress ? "border-destructive" : "border-input"} focus:outline-none focus:ring-2 focus:ring-ring`}
                            />
                            {errors.deliveryAddress && (
                                <p className="text-destructive mt-1 text-sm">{errors.deliveryAddress}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-foreground font-medium mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 rounded-md border ${errors.email ? "border-destructive" : "border-input"} focus:outline-none focus:ring-2 focus:ring-ring`}
                            />
                            {errors.email && (
                                <p className="text-destructive mt-1 text-sm">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-foreground">Payment Method</h2>
                        <div className="space-y-3">
                            <label className={`flex items-center p-4 rounded-md border ${formData.paymentMethod === "paypal" ? "border-primary /10" : "border-input"} cursor-pointer`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="paypal"
                                    checked={formData.paymentMethod === "paypal"}
                                    onChange={handleInputChange}
                                    className="mr-3"
                                />
                                <FaPaypal className="text-primary text-xl mr-2" />
                                <span className="text-foreground">PayPal</span>
                            </label>

                            <label className={`flex items-center p-4 rounded-md border ${formData.paymentMethod === "cod" ? "border-primary /10" : "border-input"} cursor-pointer`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={formData.paymentMethod === "cod"}
                                    onChange={handleInputChange}
                                    className="mr-3"
                                />
                                <FaMoneyBillWave className="text-primary text-xl mr-2" />
                                <span className="text-foreground">Cash on Delivery (COD)</span>
                            </label>
                            {errors.paymentMethod && (
                                <p className="text-destructive mt-1 text-sm">{errors.paymentMethod}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-secondary/30 p-4 rounded-md mt-6">
                        <div className="flex items-center mb-2">
                            <TbTruckDelivery className="text-2xl text-primary mr-2" />
                            <h3 className="text-lg font-semibold text-foreground">Shipping Partner - GHN</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Your order will be delivered by GHN Express, ensuring fast and reliable delivery service across the country.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full   py-3 rounded-md font-semibold hover:bg-green-500 bg-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        Complete Payment
                    </button>
                </form>
            </div>
        </div>
    );
};
