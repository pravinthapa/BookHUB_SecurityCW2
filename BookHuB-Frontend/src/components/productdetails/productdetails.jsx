import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getfruitById } from "../../api/api";
import { useCart } from "../../context/CartContext";

const weights = [100, 250, 500, 1000];

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [weight, setWeight] = useState(100);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prod = await getfruitById(id);
        setProduct(prod);
      } catch (err) {
        toast.error("Product not found");
      }
    };
    fetchData();
  }, [id]);

  if (!product) {
    return <div className="p-10 text-center text-gray-500">Loading product...</div>;
  }

  const totalPrice = Number(((product.pricePerGram || 1) * weight).toFixed(2));
  const imageSrc = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : "http://localhost:5000/uploads/placeholder.jpg";

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      title: product.name,
      pricePerGram: product.pricePerGram,
      weight,
      totalPrice,
      image: imageSrc,
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  return (
    <div className="bg-white text-black px-4 md:px-16 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Product Image */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
        <img
  src={imageSrc}
  alt={product.name}
  className="rounded-2xl w-full max-w-[480px] h-[480px] object-cover shadow-xl border border-gray-200"
/>

        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

          {/* Stock Status */}
          <div className={`text-sm font-semibold ${product.stock > 0 ? "text-blue-600" : "text-red-600"}`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </div>

          {/* Weight Selection */}
          {/* <div>
            <h2 className="text-md font-semibold mb-2">Select Weight</h2>
            <div className="flex flex-wrap gap-3">
              {weights.map((w) => (
                <button
                  key={w}
                  onClick={() => setWeight(w)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    weight === w
                      ? "bg-black text-white"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  {w === 1000 ? "1kg" : `${w}g`}
                </button>
              ))}
            </div>
          </div> */}

          {/* Price */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Rs {totalPrice}</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-1/2 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-medium"
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full sm:w-1/2 border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white py-3 rounded-lg font-medium"
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      
    </div>
  );
}
