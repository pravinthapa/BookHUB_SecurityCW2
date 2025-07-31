import React from "react";
import logo from "../../assetS/BOOKHUB.png";
import { FaTruck, FaAppleAlt, FaMedal, FaHeadset } from "react-icons/fa";

export default function About() {
  return (
    <div className="w-full bg-white text-gray-800 pt-16 pb-24">
      <section className="bg-white py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <img
            src={logo}
            alt="BookHub Logo"
            className="w-[30%] max-w-md mx-auto md:mx-0 object-contain rounded-md shadow-md"
          />
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-6 leading-tight">
              Welcome toBookHuB
            </h1>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
              BookHub is a collaboration between Booksellers Aotearoa NZ and
              independent bookstores in Nepal. It allows users to search
              for books and find which local bookstores have them in stock,
              facilitating in-store purchases or online orders.
            </p>
            <a
              href="/allproducts"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition"
            >
              Explore Our Book
            </a>
          </div>
        </div>
      </section>

      {/* Highlights Section
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-20 space-y-12">
        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h2>
            <p className="text-gray-700">
              To connect Nepal’s freshest fruitss from farm to table with love, care, and nutrition.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Our Vision</h2>
            <p className="text-gray-700">
              To be Nepal’s go-to fruit brand, known for sustainability, freshness, and community upliftment.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Why Choose Us?</h2>
            <ul className="text-gray-700 list-disc pl-5 text-left space-y-1">
              <li><strong>Homegrown Roots:</strong> 100% Nepali-sourced and proud.</li>
              <li><strong>Premium Quality:</strong> Farm-picked, carefully handled, and naturally nutritious.</li>
              <li><strong>Customer-Centered:</strong> Your satisfaction fuels our passion.</li>
            </ul>
          </div>
        </div>
      </section> */}

      {/* Feature Icons Section */}
      {/* <section className="bg-gray-50 py-16">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
    {[
      {
        title: "Free Shipping",
        subtitle: "On orders over Rs. 1000",
        color: "bg-pink-200",
        icon: <FaTruck size={28} className="text-pink-700" />,
      },
      {
        title: "Always Fresh",
        subtitle: "Harvested & packed daily",
        color: "bg-yellow-200",
        icon: <FaAppleAlt size={28} className="text-yellow-700" />,
      },
      {
        title: "Superior Quality",
        subtitle: "Premium Grade Fruitsss",
        color: "bg-blue-200",
        icon: <FaMedal size={28} className="text-blue-700" />,
      },
      {
        title: "Support",
        subtitle: "24/7 Fruit Care",
        color: "bg-green-200",
        icon: <FaHeadset size={28} className="text-green-700" />,
      },
    ].map((item, i) => (
      <div key={i} className="flex flex-col items-center justify-center">
        <div className={`w-20 h-20 ${item.color} rounded-full flex items-center justify-center mb-4`}>
          {item.icon}
        </div>
        <h3 className="font-bold text-gray-900">{item.title.toUpperCase()}</h3>
        <p className="text-sm text-gray-600">{item.subtitle}</p>
      </div>
    ))}
  </div>
</section> */}

      {/* Testimonials Section */}
      {/* <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
          What Our Customers Say
        </h2>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          {[
            {
              name: "Sita Rana",
              role: "Health Blogger",
              text: "Fruitmandu never disappoints! Always fresh, quick delivery, and great service.",
            },
            {
              name: "Bikash Thapa",
              role: "Entrepreneur",
              text: "I love the quality and variety. Their Apple and Mango are the best in Nepal!",
            },
            {
              name: "Manisha Gurung",
              role: "Nutritionist",
              text: "My go-to brand for trusted nutrition. My clients love Fruitmandu!",
            },
          ].map((testimonial, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6">
              <p className="italic text-gray-700 mb-4">“{testimonial.text}”</p>
              <h3 className="text-md font-bold text-gray-900">{testimonial.name}</h3>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
}
