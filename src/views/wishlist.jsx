import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../tailwind.css';

const WishlistPage = () => {
  // --- State Management ---
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  // --- Initialize Wishlist from LocalStorage ---
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // --- Handlers ---
  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const toggleSideNav = (isOpen) => {
    setIsSideNavOpen(isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <div className="font-poppins m-0 p-0 min-h-screen bg-gray-50">
      {/* --- Navigation Bar --- */}
      <nav 
          className="flex justify-between items-center p-4 bg-white" 
          style={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px" }}
        >
          <h1 className="font-bold text-xl">Famous Shopin</h1>
          <div className="hidden sm:flex items-center space-x-5">
            <Link to="/" className="no-underline text-gray-900 text-lg">Home</Link>
            <Link to="/collection" className="no-underline text-gray-900 text-lg">Collection</Link>
            <Link to="/wishlist" className="no-underline text-gray-900 text-lg">Wishlist</Link>
            {isLoggedIn && (
              <button onClick={handleLogout} className="no-underline text-gray-900 px-4 py-2 border border-black rounded">Logout</button>
            )}
          </div>
          <div className="block sm:hidden">
            <i className="fa-solid fa-bars cursor-pointer" onClick={() => setIsSideNavOpen(true)}></i>
          </div>
        </nav>

      {/* --- Side Navbar --- */}
      <div
        className="w-2/5 h-full fixed top-0 p-5 text-white transition-all duration-500 bg-blue-400 z-50"
        style={{ right: isSideNavOpen ? "0" : "-60%" }}
      >
        <p className="text-right">
          <i className="fa-solid fa-xmark cursor-pointer" onClick={() => toggleSideNav(false)}></i>
        </p>
        <div className="space-y-7">
          <Link to="/" className="block no-underline text-white hover:underline">Home</Link>
          <Link to="/collection" className="block no-underline text-white hover:underline">Collection</Link>
          <Link to="/wishlist" className="block no-underline text-white hover:underline">Wishlist</Link>
          {isLoggedIn && (
            <button onClick={handleLogout} className="block no-underline text-white hover:underline px-4 py-2 border border-white rounded">Logout</button>
          )}
        </div>
      </div>

      {/* --- Wishlist Content --- */}
      <div className="max-w-6xl mx-auto p-5 pb-24">
        <h1 className="text-3xl font-bold mb-6 text-center pt-5">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">Your wishlist is empty.</p>
            <Link to="/collection" className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded shadow flex flex-col items-center">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-40 object-contain mb-4"
                />
                <p className="text-center font-semibold mb-2 line-clamp-2 h-12">
                  {product.title}
                </p>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Footer --- */}
      <footer className="w-full fixed bottom-0 bg-gray-900 text-gray-200 p-4 text-center z-10">
        <div>
          <h2 className="font-bold text-lg">Get in touch</h2>
          <div className="mt-2.5 flex gap-5 align-center justify-center">
            <i className="fa-brands fa-instagram text-white cursor-pointer hover:text-pink-400"></i>
            <i className="fa-brands fa-facebook text-white cursor-pointer hover:text-blue-400"></i>
            <i className="fa-brands fa-twitter text-white cursor-pointer hover:text-blue-300"></i>
          </div>
          <p className="mt-2.5 text-xs">2026 @FamousShopin</p>
        </div>
      </footer>
    </div>
  );
};

export default WishlistPage;