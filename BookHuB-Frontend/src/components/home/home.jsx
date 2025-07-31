import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Star, Truck, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { getAllfruits } from "../../api/api";
import storage from "../../assets/storage.jpg";
import Hero from "../Hero/Hero";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllfruits()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch products");
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gradient-to-b from-lime-50 to-white text-black font-sans">
      <Hero />
      <ProductGallery
        title="Featured Books"
        products={products.slice(0, 4)}
        loading={loading}
        error={error}
      />
      {/* <DealOfDay /> */}
      {/* <CompanySection /> */}
      {/* <TestimonialSection /> */}
    </div>
  );
}

function ProductGallery({ title, products, loading, error }) {
  const navigate = useNavigate();
  return (
    <section className="px-6 md:px-16 py-16 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">
          {title}
        </h2>
        <button
          onClick={() => navigate("/allproducts")}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          View All Books
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500 py-10 text-lg">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [weight, setWeight] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { _id, name, pricePerGram, stock, image } = product;
  console.log(name);
  const imgSrc = image
    ? `http://localhost:5000/uploads/${image}`
    : "/placeholder.jpg";
  const price = Math.round(pricePerGram);
  const originalPrice = Math.round(price * 1.15);
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: _id,
      title: `${name}`,
      price,
      image: imgSrc,
      stock,
    });
    toast.success(` ${name}  added to cart!`, {
      duration: 3000,
      style: {
        background: "#0000FF",
        color: "white",
      },
    });
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast.success(
      isLiked ? "💔 Removed from wishlist" : "❤️ Added to wishlist",
      {
        duration: 2000,
      }
    );
  };

  return (
    <div
      onClick={() => navigate(`/product/${_id}`)}
      className="cursor-pointer group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-lime-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          -{discount}% OFF
        </div>
      )}

      <button
        onClick={handleLike}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-md"
      >
        <Heart
          size={18}
          className={`transition-all duration-200 ${
            isLiked
              ? "text-red-500 fill-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </button>

      <div className="relative h-56 bg-gradient-to-br from-lime-50 to-blue-100 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${imgSrc})` }}
        />

        {stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-lg text-gray-800 leading-tight">
            {name}
          </h3>
        </div>

        {/* Price Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">Rs {price}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Truck size={12} />
            <span>Free delivery over Rs 200</span>
          </div>
        </div>

        {/* Weight Selector */}
        {/* <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">
            Select Weight:
          </label>
          <select
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value))}
            onClick={(e) => e.stopPropagation()}
            className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none bg-lime-50/50"
          >
            <option value={100}>100g - Light Pack</option>
            <option value={250}>250g - Family Pack</option>
            <option value={500}>500g - Value Pack</option>
            <option value={1000}>1kg - Bulk Pack</option>
          </select>
        </div> */}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            stock === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          }`}
        >
          {stock === 0 ? (
            "❌ Out of Stock"
          ) : (
            <>
              <ShoppingCart size={18} />
              Add to Cart
            </>
          )}
        </button>

        {/* Quick Info Tags */}
        {/* <div className="flex flex-wrap gap-1 pt-2">
          <span className="text-xs bg-green-100 text-blue-700 px-2 py-1 rounded-full">
            🌱 Organic
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            ❄️ Fresh
          </span>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
            🚚 Same Day
          </span>
        </div> */}
      </div>

      {/* Hover Overlay Effect */}
      {isHovered && (
        <div className="absolute inset-0 bg-lime-500/5 pointer-events-none transition-opacity duration-300" />
      )}
    </div>
  );
}

// function DealOfDay() {
//   return (
//     <div className="bg-white text-center py-20 px-6 md:px-0 relative overflow-hidden">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 opacity-5">
//         <div className="absolute top-10 left-10 text-6xl">🍃</div>
//         <div className="absolute top-20 right-20 text-4xl">🍎</div>
//         <div className="absolute bottom-10 left-20 text-5xl">🥕</div>
//         <div className="absolute bottom-20 right-10 text-3xl">🍓</div>
//       </div>

//       <div className="relative z-10">
//         <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-3 text-blue-700">
//           ⚡ Deal of the Day ⚡
//         </h2>
//         <p className="mb-4 text-lg text-gray-600">
//           Limited time offer - Don't miss out!
//         </p>
//         <div className="bg-lime-50 border-2 border-blue-200 rounded-2xl p-8 max-w-md mx-auto">
//           <p className="text-4xl font-extrabold mb-2 text-blue-700">
//             🥬 Spinach
//           </p>
//           <p className="text-xl mb-3 text-gray-700">
//             Special Price:{" "}
//             <span className="font-bold text-blue-600">Rs 5 OFF</span>
//           </p>
//           <div className="text-sm bg-blue-100 text-blue-700 rounded-full px-4 py-2 inline-block font-semibold">
//             ⏰ Valid for: 1 Day, 18 Hours
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CompanySection() {
//   return (
//     // <div className="py-20 px-6 md:px-16 grid md:grid-cols-2 gap-12 items-center bg-white">
//     //   <div className="space-y-6">
//     //     <h2 className="text-3xl md:text-4xl font-bold text-blue-700">
//     //       About Bookhub
//     //     </h2>
//     //     <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
//     //     <p className="text-gray-600 leading-relaxed text-lg">
//     //       At BookHub, Lorem ipsum dolor sit amet consectetur adipisicing elit.
//     //       Vel modi eaque dolores nostrum odio et corporis soluta ipsa officiis
//     //       possimus assumenda, dolor consequuntur temporibus at sequi eligendi
//     //       fugiat, veniam molestias!
//     //     </p>
//     //     <div className="flex flex-wrap gap-3">
//     //       <span className="bg-lime-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
//     //         🌱 100% Organic
//     //       </span>
//     //       <span className="bg-lime-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
//     //         🚚 Same Day Delivery
//     //       </span>
//     //       <span className="bg-lime-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
//     //         💯 Quality Guaranteed
//     //       </span>
//     //     </div>
//     //   </div>
//     //   {/* <div className="grid grid-cols-2 gap-8">
//     //     <Stat icon="🏆" title="Top Quality" label="Certified by Experts" />
//     //     <Stat icon="🚚" title="10+ Districts" label="Fast Delivery" />
//     //     <Stat icon="🥣" title="1000+ Customers" label="Loved Nationwide" />
//     //     <Stat icon="🍇" title="20+ Varieties" label="Fruits & Veggies" />
//     //   </div> */}
//     // </div>
//   );
// }

// function Stat({ icon, title, label }) {
//   return (
//     <div className="text-center p-6 bg-lime-50 rounded-2xl hover:bg-lime-100 transition-colors duration-300">
//       <div className="text-4xl mb-3">{icon}</div>
//       <h3 className="font-bold text-lime-700 text-lg">{title}</h3>
//       <p className="text-sm text-gray-600 mt-1">{label}</p>
//     </div>
//   );
// }

// function StorageTip({ icon, text }) {
//   return (
//     <li className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
//       <span className="text-2xl flex-shrink-0">{icon}</span>
//       <span className="text-base leading-relaxed">{text}</span>
//     </li>
//   );
// }

// function TestimonialSection() {
//   const testimonials = [
//     {
//       quote: "Fruitmandu never disappoints. Top quality every time!",
//       name: "Aarav Shrestha",
//       rating: 5,
//     },
//     {
//       quote: "I love their packaging and taste. Super fast delivery too!",
//       name: "Nisha Gurung",
//       rating: 5,
//     },
//     {
//       quote: "The only place I trust for premium fruit in Nepal.",
//       name: "Hari Bhattarai",
//       rating: 5,
//     },
//   ];
//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(
//       () => setCurrent((prev) => (prev + 1) % testimonials.length),
//       4000
//     );
//     return () => clearInterval(interval);
//   }, []);

// }
