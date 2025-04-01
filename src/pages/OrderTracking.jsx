import React, { useEffect, useState } from "react";
import { FaBox, FaCheckCircle, FaTruck, FaShippingFast, FaMapMarkerAlt, FaBan, FaStar } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { findUserById, getOrderById, getProductsByListId, getShippingByOrderId } from "../routers/ApiRoutes";
import { IoIosArrowBack } from "react-icons/io";
import Loading from "../utils/Loading";

export default function OrderTracking() {

  const { orderId } = useParams();
  const [order, setOrder] = useState({});
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [updatedOrderStages, setUpdatedOrderStages] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const [shippingStatus, setShippingStatus] = useState("WATIING");
  const statusMap = {
    "WAITING": "Đang chuẩn bị hàng",
    "CONFIRMED": "Đã gửi cho ĐVVC",
    "SHIPPED": "Đang giao hàng",
    "RECEIVED": "Đã nhận hàng",
    "CANCELLED": "Đã hủy",
    "RATING": "Đánh giá"
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      if (!orderId) return;
      // Bắt đầu loading
      try {
        const res = await getOrderById(orderId);
        const data = res.data;
        console.log(data)
        setOrder(data);

        // Xử lý trạng thái đơn hàng
        await processOrderStatus(data);

        const productIds = data.order_item.map(item => item.product_id);
        if (productIds.length > 0) {
          fetchProducts(productIds);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const processOrderStatus = async (order) => {
    setLoading(true);
    let shippingStatus = "WAITING";
    try {
      const shippingOrder = await getShippingByOrderId(order.order_id);
      if (shippingOrder && shippingOrder.status !== 404) {
        shippingStatus = shippingOrder.data.data?.status; // Nếu có shipping, cập nhật trạng thái
      }

      console.log("Shipping Status:", shippingStatus);
    } catch (error) {
      console.error("Error fetching shipping order:", error);
      // Không cần gán lại `shippingStatus = "CONFIRMED"` ở đây vì đã có giá trị mặc định
    } finally {
      // Luôn hiển thị đủ 6 trạng thái
      const orderStages = [
        { id: 1, name: "Đang chuẩn bị hàng", icon: <FaBox />, completed: false },
        { id: 2, name: "Đã gửi cho ĐVVC", icon: <FaTruck />, completed: false },
        { id: 3, name: "Đang giao hàng", icon: <FaShippingFast />, completed: false },
        { id: 4, name: "Đã nhận hàng", icon: <FaCheckCircle />, completed: false },
        { id: 5, name: "Đã hủy", icon: <FaBan />, completed: false },
        { id: 6, name: "Đánh giá", icon: <FaStar />, completed: false }
      ];

      const statusOrderMap = {
        "CONFIRMED": 2,
        "SHIPPED": 3,
        "RECEIVED": 4,
        "CANCELLED": 5,
        "RATING": 6
      };
      const currentStageIndex = statusOrderMap[shippingStatus] || 1;
      const progressPercentage = (currentStageIndex / orderStages.length) * 100;

      const updatedOrderStages = orderStages.map((stage, index) => ({
        ...stage,
        completed: index < currentStageIndex
      }));

      console.log("Updated Order Stages:", updatedOrderStages);
      setUpdatedOrderStages(updatedOrderStages);
      setProgressPercentage(progressPercentage);
      console.log(shippingStatus)
      setShippingStatus(shippingStatus);
      setLoading(false);
    }
  };



  useEffect(() => {
    const fetchUserById = async () => {
      if (!order?.user_id) return;
      setLoading(true); // Bắt đầu loading
      try {
        const res = await findUserById(order.user_id);
        setUserInfo(res.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchUserById();
  }, [order]);

  const fetchProducts = async (productIds) => {
    try {
      const res = await getProductsByListId(productIds.join(','));
      setProducts(res.data);

    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  const productMap = products.reduce((acc, product) => {
    acc[product.id] = product;
    return acc;
  }, {});



  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      {loading && <Loading />}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Order Header */}
        <div className="flex items-center bg-indigo-200 py-4 px-6 justify-between">
          <Link to="/orders">
            <button
              className="flex items-center space-x-2 text-indigo-700 hover:text-indigo-900 font-medium px-4 py-2 rounded-lg transition duration-200"
              disabled={!order}
            >
              <IoIosArrowBack className="text-xl" />
              <span>Trở lại</span>
            </button>
          </Link>

          <div className="px-2 text-center">
            {order ? (
              <div className="flex items-center space-x-4">
                <h2 className="text-gray-700 font-semibold text-md">MÃ ĐƠN HÀNG: {order.order_id}</h2>
                <span className="text-gray-500">|</span>
                <h2 className={`text-md font-semibold uppercase `}>
                  TRẠNG THÁI: {statusMap[shippingStatus] || "Không xác định"}
                </h2>
              </div>
            ) : (
              <p>Đang tải...</p>
            )}
          </div>
        </div>

        {/* Order Progress */}
        <div className="p-8 border-b">
          <h2 className="text-xl font-semibold mb-6">Trạng thái đơn hàng</h2>
          <div className="relative">
            <div className="overflow-hidden h-3 mb-6 text-xs flex rounded bg-gray-300">
              <div
                style={{ width: `${progressPercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600"
              ></div>
            </div>
            <div className="flex justify-between">
              {updatedOrderStages.map((stage) => (
                <div key={stage.id} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold ${stage.completed ? "bg-green-600 text-white" : "bg-gray-300 text-gray-500"
                      }`}
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
        <div className="p-8 border-b">
          <h2 className="text-xl font-semibold mb-6">Chi tiết đơn hàng</h2>
          <div className="space-y-6">
            {order?.order_item?.map((item) => {
              const product = productMap[item.product_id];
              return (
                <div key={item.order_item_id} className="flex items-center space-x-6 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={product?.image?.split(',')[0] || 'https://via.placeholder.com/100'}
                    alt={product?.name || 'Sản phẩm'}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-lg">{product?.name || 'Sản phẩm'}</h3>
                    <p className="text-gray-500 text-sm">Số lượng: {item.quantity}</p>
                    <p className="text-gray-900 font-medium text-lg">{item.price.toLocaleString("vi-VN")}₫</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Address */}
        {order && userInfo && (
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Địa chỉ nhận hàng</h2>
            <div className="bg-gray-50 p-5 rounded-lg flex items-start">
              <FaMapMarkerAlt className="text-blue-600 mt-1 mr-4 text-lg" />
              <div>
                <p className="font-semibold text-gray-900 text-lg">{userInfo.firstName} {userInfo.lastName}</p>
                <p className="text-gray-600 text-sm">{userInfo.phone || "(+84) 368 983 043"}</p>
                <p className="text-gray-600 text-sm">{order.houseNumber}</p>
              </div>
            </div>
          </div>
        )}

        <div className="w-full justify-end items-center flex">
          <div className="bg-white p-6 rounded-lg  w-full max-w-lg flex justify-end items-end">
            <table className="w-full text-sm text-gray-600">
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Tổng tiền hàng</td>
                  <td className="py-2 text-right font-medium">

                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount - order.shipping_amount)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Phí vận chuyển</td>
                  <td className="py-2 text-right">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.shipping_amount)}</td>
                </tr>
                <tr className="border-b font-semibold text-lg">
                  <td className="py-2">Thành tiền</td>
                  <td className="py-2 text-right text-red-500">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}</td>
                </tr>
                <tr>
                  <td className="py-2">Phương thức Thanh toán</td>
                  <td className="py-2 text-right font-medium">{order.payment_method == 'COD' ? "Thanh toán khi nhận hàng" : "Thanh toán qua Paypal"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="p-6 flex justify-start space-x-2">
          <p className="text-sm text-gray-500">
            * Nếu hàng nhận được có vấn đề, bạn có thể gửi yêu cầu trả hàng/hoàn tiền trước ngày{" "}
            {new Date(new Date(order?.createdAt).setDate(new Date(order?.createdAt).getDate() + 7)).toLocaleDateString("vi-VN")}.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-6 flex justify-end space-x-2">

          <Link to="#">
            <button className="text-white bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg transition font-medium">
              Đánh giá
            </button>
          </Link>
          <Link to="#">
            <button className="text-black bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg transition font-medium">
              Liên hệ với người bán
            </button>
          </Link>
          <Link to="#">
            <button className="text-black bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg transition font-medium">
              Yêu cầu trả hàng/Hoàn tiền
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};


