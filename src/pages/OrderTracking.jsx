import React, { useEffect, useState } from "react";
import { FaBox, FaCheckCircle, FaTruck, FaShippingFast, FaMapMarkerAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { findUserById, getOrderById } from "../routers/ApiRoutes";
import { IoIosArrowBack } from "react-icons/io";
import Loading from "../utils/Loading";

export default function OrderTracking() {

  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      setLoading(true); // Bắt đầu loading
      try {
        const res = await getOrderById(orderId);
        console.log(res.data);
        setOrder(res.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    const fetchUserById = async () => {
      if (!order?.user_id) return;
      setLoading(true); // Bắt đầu loading
      try {
        const res = await findUserById(order.user_id);
        console.log(res.data);
        setUserInfo(res.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchUserById();
  }, [order]);



  const orderStages = [
    { id: 1, name: "Đơn hàng đã đặt", icon: <FaBox />, completed: true },
    { id: 2, name: "Đã xác nhận đơn hàng", icon: <FaCheckCircle />, completed: true },
    { id: 3, name: "Bàn giao cho đơn vị vận chuyển", icon: <FaTruck />, completed: true },
    { id: 4, name: "Đang vận chuyển", icon: <FaShippingFast />, completed: false },
    { id: 5, name: "Đã nhận được hàng", icon: <FaCheckCircle />, completed: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {loading && <Loading />}
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Order Header */}
        <div className="flex items-center bg-indigo-100 py-2 justify-between">
          <Link to={"/orders"}>
            <button
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-lg transition-colors duration-200"
              disabled={!order}
            >
              <IoIosArrowBack />
              <span>Trở lại</span>
            </button>
          </Link>

          <div className="px-2">
            {order ? (
              <div className="flex">
                <h2 className=" font-semibold text-gray-500">MÃ ĐƠN HÀNG: {order.order_id}</h2>
                <p className="px-4"> | </p>
                <h2 className=" font-semibold text-gray-500">TRẠNG THÁI: {order.status}</h2>
              </div>

            ) : (
              <p>a</p>
            )}
          </div>
        </div>

        {/* Order Progress */}
        <div className="p-8 border-b">
          <h2 className="text-xl font-semibold mb-6">Trạng thái đơn hàng</h2>
          <div className="relative">
            <div className="overflow-hidden h-3 mb-6 text-xs flex rounded bg-gray-300">
              <div
                style={{ width: "50%" }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600"
              ></div>
            </div>
            <div className="flex justify-between">
              {orderStages.map((stage) => (
                <div key={stage.id} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold ${stage.completed ? "bg-green-600 text-white" : "bg-gray-300 text-gray-500"}`}
                  >
                    {stage.icon}
                  </div>
                  <p className="mt-3 text-sm text-gray-600">{stage.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Order Items */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">Chi tiết đơn hàng</h2>
          <div className="space-y-4">
            {order?.order_item?.map((item) => (
              <div key={item.order_item_id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={item.image ? item.image : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'}
                  alt={item.name ? item.name : 'Một cái gì đó'}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name ? item.name : 'Một cái gì đó'}</h3>
                  <p className="text-gray-500">Số lượng: {item.quantity}</p>
                  <p className="text-gray-900 font-medium">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Delivery Address */}
        {order && userInfo && (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Địa chỉ nhận hàng</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-blue-600 mt-1 mr-3" />
                <div>
                  <p className="font-semibold text-gray-900">{userInfo.firstName ? userInfo.firstName + ' ' + userInfo.lastName : "Khách hàng"}</p>
                  <p className="text-gray-600">{userInfo.phone ? userInfo.phone : "(+84) 368 983 043"}</p>
                  <p className="text-gray-600">
                    {order.houseNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


