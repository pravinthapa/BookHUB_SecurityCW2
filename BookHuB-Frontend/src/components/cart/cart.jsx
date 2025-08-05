import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getProfile } from "../../api/api";
import toast from "react-hot-toast";
import Payment from "../Payment/Payment";
import { v4 as uuidv4 } from "uuid";
import { generateEsewaSignature } from "../../utils/esewaSignature";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, updateWeight } =
    useCart();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const esewaFormRef = useRef(null);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setAddress(data.address || "");
        setPhone(data.phone || "");
      })
      .catch((err) =>
        toast.error(err.message || "Failed to fetch profile info")
      );
  }, []);

  const weightOptions = [100, 250, 500, 1000];
  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
  const shipping = cartItems.length > 0 ? 20 : 0;
  const total = subtotal + shipping;

  const handlePaymentSuccess = () => {
    setShowModal(true);
    setTimeout(() => {
      clearCart();
      navigate("/");
    }, 3000);
  };

  return (
    <section className="min-h-screen px-6 py-10 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
        {/* Left: Cart */}
        <div className="bg-white/60 backdrop-blur-lg p-6 rounded-3xl shadow-md">
          <h2 className="text-3xl font-bold text-blue-700 mb-6">
            Your Shopping Cart
          </h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center">
              Your cart is currently empty.
            </p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id + item.weight}
                className="flex items-center gap-6 mb-6 border-b pb-4"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 rounded-xl object-cover shadow-md"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                   
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span>Qty:</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.weight,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="border px-2 rounded hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.weight, item.quantity + 1)
                      }
                      className="border px-2 rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-2 font-semibold text-blue-700">
                    Rs {item.price * item.quantity}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.weight)}
                    className="text-sm text-blue-500 mt-1 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white/60 backdrop-blur-lg p-6 rounded-3xl shadow-md space-y-6">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">Checkout</h2>

          <div className="space-y-3">
            <input
              type="text"
              className="w-full border px-4 py-2 rounded text-sm"
              placeholder="Full Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="text"
              className="w-full border px-4 py-2 rounded text-sm"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>Rs {subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping:</span>
              <span>Rs {shipping}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg text-blue-700">
              <span>Total:</span>
              <span>Rs {total}</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Choose Payment</h4>
            <div className="flex flex-col gap-2">
              {["cod", "khalti", "esewa"].map((method) => (
                <label key={method} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  {method === "cod" && "Cash on Delivery"}
                  {method === "khalti" && "Khalti"}
                  {method === "esewa" && "eSewa"}
                </label>
              ))}
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          {paymentMethod !== "esewa" ? (
            <button
              onClick={() =>
                Payment({
                  cart: cartItems,
                  address,
                  contact: phone,
                  paymentMethod,
                  total,
                  setError,
                  setLoading: () => {},
                  onSuccess: handlePaymentSuccess,
                })
              }
              className={`w-full py-2 px-4 rounded font-semibold transition ${
                paymentMethod === "cod"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : paymentMethod === "khalti"
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-500 text-white"
              }`}
            >
              {paymentMethod === "cod" && "Place Order (Cash on Delivery)"}
              {paymentMethod === "khalti" && "Pay with Khalti"}
            </button>
          ) : (
            cartItems.length > 0 &&
            (() => {
              const transaction_uuid = uuidv4();
              const { signedFieldNames, signature } = generateEsewaSignature({
                total_amount: total,
                transaction_uuid,
                product_code: "EPAYTEST",
              });

              return (
                <form
                  ref={esewaFormRef}
                  action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
                  method="POST"
                  className="mt-4"
                >
                  <input type="hidden" name="amount" value={subtotal} />
                  <input type="hidden" name="tax_amount" value="0" />
                  <input type="hidden" name="total_amount" value={total} />
                  <input
                    type="hidden"
                    name="transaction_uuid"
                    value={transaction_uuid}
                  />
                  <input type="hidden" name="product_code" value="EPAYTEST" />
                  <input
                    type="hidden"
                    name="product_service_charge"
                    value="0"
                  />
                  <input
                    type="hidden"
                    name="product_delivery_charge"
                    value={shipping}
                  />
                  <input
                    type="hidden"
                    name="success_url"
                    value="http://localhost:5173/paymentsuccess"
                  />
                  <input
                    type="hidden"
                    name="failure_url"
                    value="http://localhost:5173/paymentfailure"
                  />
                  <input
                    type="hidden"
                    name="signed_field_names"
                    value={signedFieldNames}
                  />
                  <input type="hidden" name="signature" value={signature} />
                  <button
                    type="submit"
                    className="w-full py-2 px-4 mt-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
                  >
                    eSewa
                  </button>
                </form>
              );
            })()
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl text-center shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold text-blue-700">
              Order Successful!
            </h3>
            <p className="text-sm mt-2 text-gray-600">Redirecting to home...</p>
            <div className="w-full h-2 mt-4 bg-gray-200 rounded">
              <div className="h-full bg-blue-700 animate-pulse w-full rounded"></div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Cart;
