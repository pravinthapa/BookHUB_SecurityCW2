import { useEffect, useState } from "react";
import KhaltiCheckout from "khalti-checkout-web";
import axios from "axios";
import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../../api/api";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { generateEsewaSignature } from "../../utils/esewaSignature";

const publicTestKey = "test_public_key_402c2b0e98364222bb1c1ab02369cefd";

const Payment = ({
  cart,
  address,
  contact,
  paymentMethod,
  total,
  setError,
  setLoading,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [checkout, setCheckout] = useState(null);

  useEffect(() => {
    const khaltiCheckout = new KhaltiCheckout({
      publicKey: publicTestKey,
      productIdentity: "BookHuB-order",
      productName: "BookHuB Basket",
      productUrl: "http://localhost:5173",
      eventHandler: {
        onSuccess(payload) {
          handlePaymentSuccess(payload.token);
        },
        onError(error) {
          setError("Khalti payment failed. Please try again.");
          setLoading(false);
        },
        onClose() {
          setLoading(false);
        },
      },
      paymentPreference: [
        "KHALTI",
        "EBANKING",
        "MOBILE_BANKING",
        "CONNECT_IPS",
        "SCT",
      ],
    });
    setCheckout(khaltiCheckout);
  }, []);

  const handlePaymentSuccess = async (transactionId = null) => {
    try {
      for (const item of cart) {
        const bookingData = {
          fruit: item.id,
          quantity: item.quantity,
          totalPrice: item.totalPrice * item.quantity,
          address,
          phone: contact,
          weight: item.weight,
          pricePerGram: item.totalPrice,
          paymentMethod,
          khaltiTransactionId: transactionId,
        };
        await createBooking(bookingData);
      }
      clearCart();
      onSuccess();
      navigate("/success");
    } catch (err) {
      setError(err.message || "Failed to complete order");
      toast.error(err.message || "Failed to complete order");
      setLoading(false);
    }
  };

  const handleCashOnDelivery = async () => {
    try {
      for (const item of cart) {
        const bookingData = {
          fruit: item.id,
          quantity: item.quantity,
          totalPrice: item.totalPrice * item.quantity,
          address,
          phone: contact,
          weight: item.weight,
          pricePerGram: item.totalPrice,
          paymentMethod: "cod",
        };
        await createBooking(bookingData);
      }
      clearCart();
      onSuccess();
      navigate("/success");
    } catch (err) {
      setError(err.message || "Failed to complete order");
      toast.error(err.message || "Failed to complete order");
      setLoading(false);
    }
  };

  const handleEsewaPayment = async () => {
    try {
      for (const item of cart) {
        const bookingData = {
          fruit: item.id,
          quantity: item.quantity,
          totalPrice: item.totalPrice * item.quantity,
          address,
          phone: contact,
          weight: item.weight,
          pricePerGram: item.totalPrice,
          paymentMethod: "esewa",
        };
        await createBooking(bookingData);
      }
      clearCart();
      onSuccess();
      navigate("/success");
    } catch (err) {
      setError(err.message || "Failed to prepare eSewa payment");
      toast.error(err.message || "Failed to prepare eSewa payment");
      setLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!contact || !address) {
      setError("Please enter address and contact number.");
      return;
    }
    if (cart.length === 0) return;
    setLoading(true);

    if (paymentMethod === "khalti") {
      if (checkout) checkout.show({ amount: total * 100 });
      else {
        setError("Payment system not ready. Please try again.");
        setLoading(false);
      }
    } else if (paymentMethod === "cod") {
      handleCashOnDelivery();
    } else if (paymentMethod === "esewa") {
      handleEsewaPayment();
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleConfirmOrder}
        className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-md
          ${paymentMethod === "khalti" ? "bg-purple-600 hover:bg-purple-700" : ""}
          ${paymentMethod === "cod" ? "bg-blue-600 hover:bg-blue-700" : ""}
          ${paymentMethod === "esewa" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
        disabled={cart.length === 0}
      >
        {paymentMethod === "khalti"
          ? "Pay Securely with Khalti"
          : paymentMethod === "esewa"
          ? "Proceed to eSewa"
          : "Complete Order (Cash on Delivery)"}
      </button>
    </div>
  );
};

export default Payment;
