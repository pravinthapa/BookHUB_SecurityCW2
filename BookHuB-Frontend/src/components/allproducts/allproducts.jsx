import React, { useState, useEffect, useMemo } from "react";
import { Heart, Star } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { getAllfruits } from "../../api/api";
import { useLocation, useNavigate } from "react-router-dom";

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const query = useQuery();

  const search = query.get("search") || "";
  const debouncedSearch = useDebouncedValue(search, 250);

  useEffect(() => {
    getAllfruits()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load products");
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return products;
    const term = debouncedSearch.trim().toLowerCase();
    return products.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.keywords && p.keywords.toLowerCase().includes(term))
    );
  }, [products, debouncedSearch]);

  return (
    <div className="min-h-screen bg-[#f4fff4] text-blue-900">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto p-4 md:p-10">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-blue-800 tracking-wide">
          Available Books
        </h1>

        {loading ? (
          <div className="text-center py-20 text-lg">Loading products...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { _id, name, pricePerGram, stock, image } = product;
  const [weight, setWeight] = useState(100);

  const imgSrc = image
    ? `http://localhost:5000/uploads/${image}`
    : "http://localhost:5000/uploads/placeholder.jpg";

  const price = Math.round(pricePerGram);
  const originalPrice = Math.round(price * 1.1);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart({
      id: _id,
      title: `${name}`,
      price,
      image: imgSrc,
      stock,
    });
    toast.success(`${name} added to cart!`);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer overflow-hidden border border-blue-100"
      onClick={() => navigate(`/product/${_id}`)}
    >
      <div
        className="relative h-52 bg-cover bg-center transition-transform duration-300 hover:scale-105"
        style={{ backgroundImage: `url(${imgSrc})` }}
      >
        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow">
          10% Off
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-blue-900 mb-1 capitalize">
          {name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Rs {price}{" "}
          <span className="line-through text-gray-400 text-xs ml-2">
            Rs {originalPrice}
          </span>
        </p>

        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2"
        >
          🛒 {stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
