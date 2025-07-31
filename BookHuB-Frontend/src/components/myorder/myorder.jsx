import React, { useState, useEffect } from "react";
import { getUserBookings } from "../../api/api";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    setLoading(true);
    getUserBookings()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load orders");
        setLoading(false);
      });
  }, []);

  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelModal(true);
    setCancelReason("");
  };

  const confirmCancel = () => {
    setOrders(orders.filter((order) => order._id !== selectedOrderId));
    setCancelModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f7fff7] px-4 py-10 md:px-10 text-blue-900">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-800"> My Book Orders</h2>

      {loading ? (
        <div className="text-center text-lg py-20">Loading your  orders...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-600 py-12">No book orders yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border border-green-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-green-100 text-green-800 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-100 text-gray-800">
              {orders.map((order) => {
                const imgSrc = order.fruit?.image
                  ? `http://localhost:5000/uploads/${order.fruit.image}`
                  : "http://localhost:5000/uploads/placeholder.jpg";

                return (
                  <tr key={order._id} className="hover:bg-green-50">
                    <td className="px-4 py-3 font-medium">{order._id.slice(-6)}</td>
                    <td className="px-4 py-3">
                      <img
                        src={imgSrc}
                        alt={order.fruit?.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "http://localhost:5000/uploads/placeholder.jpg";
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">{order.fruit?.name}</td>
                    <td className="px-4 py-3 text-center">{order.quantity}</td>
                    <td className="px-4 py-3 text-center">Rs {order.totalPrice}</td>
                    <td className="px-4 py-3">{order.address}</td>
                    <td className="px-4 py-3">{order.phone}</td>
                    <td className="px-4 py-3 text-center">
                      {order.status === "pending" && (
                        <span className="text-yellow-600 font-semibold"> Pending</span>
                      )}
                      {order.status === "shipped" && (
                        <span className="text-blue-600 font-semibold"> Shipped</span>
                      )}
                      {order.status === "delivered" && (
                        <span className="text-green-600 font-semibold"> Delivered</span>
                      )}
                      {order.status === "cancelled" && (
                        <span className="text-red-600 font-semibold">Cancelled</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {order.status === "pending" && (
                        <button
                          onClick={() => openCancelModal(order._id)}
                          className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">
              Cancel Order Reason
            </h3>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border border-blue-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="">-- Select Reason --</option>
              <option value="Changed my mind">Changed my mind</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Found cheaper elsewhere">Found cheaper elsewhere</option>
              <option value="Other">Other</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm"
              >
                Back
              </button>
              <button
                onClick={confirmCancel}
                disabled={!cancelReason}
                className={`px-4 py-2 rounded text-white text-sm transition ${
                  cancelReason
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrder;
