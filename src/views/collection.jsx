import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../tailwind.css';

const CollectionPage = () => {
  // --- State Management ---
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  // Detail Card State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });

  // --- Fetch Products ---
  useEffect(() => {
    axios.get("https://fakestoreapi.com/products")
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  // --- Search Logic ---
  useEffect(() => {
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // --- Wishlist Logic ---
  const addToWishlist = (product) => {
    const savedWishlist = localStorage.getItem("wishlist");
    const wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];

    if (!wishlist.find(item => item.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert(`Added "${product.title}" to wishlist!`);
    } else {
      alert(`"${product.title}" is already in your wishlist.`);
    }
  };

  // --- Product Detail Popover Logic ---
  const handleViewProduct = (e, product) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    setCardPosition({
      top: rect.bottom + scrollTop + 10,
      left: rect.left
    });
    setSelectedProduct(product);
  };

  const closeDetailCard = () => {
    setSelectedProduct(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <div className="font-poppins m-0 p-0 min-h-screen bg-gray-50" onClick={closeDetailCard}>

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

      {/* --- Side Navbar Backdrop --- */}
      {isSideNavOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSideNavOpen(false)}
        ></div>
      )}

      {/* --- Side Navbar --- */}
      <div
        className="w-64 h-full fixed top-0 p-5 text-white transition-all duration-500 bg-blue-400 z-50"
        style={{ right: isSideNavOpen ? "0" : "-100%" }}
      >
        <p className="text-right">
          <i className="fa-solid fa-xmark cursor-pointer" onClick={() => setIsSideNavOpen(false)}></i>
        </p>
        <div className="space-y-7 mt-5">
          <Link to="/" className="block no-underline text-white hover:underline" onClick={() => setIsSideNavOpen(false)}>Home</Link>
          <Link to="/collection" className="block no-underline text-white hover:underline" onClick={() => setIsSideNavOpen(false)}>Collection</Link>
          <Link to="/wishlist" className="block no-underline text-white hover:underline" onClick={() => setIsSideNavOpen(false)}>Wishlist</Link>
          {isLoggedIn && (
            <button onClick={() => { handleLogout(); setIsSideNavOpen(false); }} className="block no-underline text-white hover:underline px-4 py-2 border border-white rounded">Logout</button>
          )}
        </div>
      </div>

      {/* --- Search Bar --- */}
      <div className="mt-5 p-5">
        <div className="flex justify-between items-center border-2 border-black rounded-full max-w-4xl mx-auto p-2 bg-white">
          <input
            type="search"
            placeholder="Search for products"
            className="w-full bg-transparent text-lg focus:outline-none px-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fa-solid fa-magnifying-glass pr-4 cursor-pointer"></i>
        </div>

        {/* --- Product Grid --- */}
        <div className="flex flex-wrap gap-4 justify-center mt-8 pb-24">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`text-center basis-full sm:basis-1/3 md:basis-1/5 border border-gray-300 p-4 rounded-md flex flex-col items-center justify-between bg-white transition-all duration-300 ${selectedProduct && selectedProduct.id !== product.id ? 'blur-[2px] opacity-50' : ''}`}
              style={{ height: "350px" }}
            >
              <img src={product.image} alt={product.title} className="mx-auto h-40 object-contain" />
              <p className="mt-2 text-center text-sm font-medium line-clamp-2">{product.title}</p>

              <div className="flex flex-col gap-2 w-full mt-2">
                <button
                  onClick={(e) => handleViewProduct(e, product)}
                  className="view-product-btn bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700 transition"
                >
                  View Product
                </button>
                <button
                  onClick={() => addToWishlist(product)}
                  className="bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700 transition"
                >
                  Add to Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Product Detail Card (Popover) --- */}
      {selectedProduct && (
        <div
          className="absolute bg-white border border-gray-300 rounded-md p-4 shadow-2xl max-w-xs z-[60]"
          style={{
            top: `${cardPosition.top}px`,
            left: `${cardPosition.left}px`,
            position: 'absolute'
          }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the card
        >
          <h2 className="text-lg font-bold mb-2">{selectedProduct.title}</h2>
          <p className="text-green-600 font-bold mb-2">${selectedProduct.price.toFixed(2)}</p>
          <p className="text-gray-700 text-sm mb-2">{selectedProduct.description}</p>
          <p className="italic text-gray-500 text-xs">Category: {selectedProduct.category}</p>
          <button
            className="mt-3 text-xs text-red-500 font-bold"
            onClick={closeDetailCard}
          >
            Close
          </button>
        </div>
      )}

      {/* --- Footer --- */}
      <footer className="w-full fixed bottom-0 bg-gray-900 text-gray-200 p-4 text-center z-10">
        <h2 className="font-bold text-lg">Get in touch</h2>
        <div className="mt-2.5 flex gap-5 justify-center">
          <i className="fa-brands fa-instagram cursor-pointer"></i>
          <i className="fa-brands fa-facebook cursor-pointer"></i>
          <i className="fa-brands fa-twitter cursor-pointer"></i>
        </div>
        <p className="mt-2.5 text-xs">2026 @FamousShopin</p>
      </footer>
    </div>
  );
};

export default CollectionPage;