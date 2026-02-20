import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../tailwind.css';

const Home = () => {
  const navigate = useNavigate();
  // --- State Management ---
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loginMessage, setLoginMessage] = useState({ text: '', color: '' });
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  // --- Image Rotation Logic ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [products]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoginMessage({ text: "Processing...", color: "blue" });

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.find(user => user.username === formData.username);

    if (userExists) {
      setLoginMessage({ text: "Username already exists", color: "red" });
      return;
    }

    // "Hashing" the password for demonstration. In a real app, use a proper library like bcrypt.
    const hashedPassword = formData.password + '_hashed';
    users.push({ username: formData.username, password: hashedPassword });
    localStorage.setItem('users', JSON.stringify(users));

    setLoginMessage({ text: "User created successfully!", color: "green" });
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      setLoginMessage({ text: "Please enter credentials", color: "red" });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === formData.username);
    const hashedPassword = formData.password + '_hashed';

    if (!user || user.password !== hashedPassword) {
      setLoginMessage({ text: "Invalid username or password", color: "red" });
      return;
    }

    setLoginMessage({ text: "Login successful!", color: "green" });
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    setTimeout(() => {
      setIsSignUpOpen(false);
      setLoginMessage({ text: '', color: '' });
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <>
      <div className={`font-poppins m-0 p-0 transition-all ${isSignUpOpen && !isLoggedIn ? 'blur-sm pointer-events-none' : ''}`}>
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
            <Link 
              to="/" 
              className="block no-underline text-white hover:underline"
              onClick={() => setIsSideNavOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/collection" 
              className="block no-underline text-white hover:underline"
              onClick={() => setIsSideNavOpen(false)}
            >
              Collection
            </Link>
            <Link 
              to="/wishlist" 
              className="block no-underline text-white hover:underline"
              onClick={() => setIsSideNavOpen(false)}
            >
              Wishlist
            </Link>
            {isLoggedIn && (
              <button 
                onClick={() => { handleLogout(); setIsSideNavOpen(false); }} 
                className="block no-underline text-white hover:underline px-4 py-2 border border-white rounded"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* --- Header / Hero --- */}
        <div className="flex flex-col sm:flex-row gap-12 p-12 justify-center items-center">
          <div className="text-center">
            <h1 className="font-extrabold text-2xl mb-2">Level up your products</h1>
            <p className="mb-4">With our Collection</p>
            <button 
              onClick={() => navigate('/collection?focusSearch=true')}
              className="px-5 py-2.5 mt-2.5 bg-black text-white rounded"
            >
              Shop now
            </button>
            {!isLoggedIn && (
              <button 
                onClick={() => setIsSignUpOpen(true)}
                className="px-5 py-2.5 mt-2.5 border border-black rounded ml-4"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>

        {/* --- Image Carousel Section --- */}
        <div className="flex flex-col sm:flex-row justify-center gap-12 p-12">
          <div className="images mt-3 sm:mt-0 flex justify-center items-center min-h-[300px] loading-lazy">
            {products.length > 0 && (
              <img 
                src={products[currentIndex].image} 
                alt="Product" 
                className="max-w-[50%] max-h-[300px] object-contain transition-opacity duration-500"
              />
            )}
          </div>
        </div>

        {/* --- Services --- */}
        <div className="p-5 pb-32">
          <div className="hidden sm:flex gap-2.5 flex-col sm:flex-row w-full bg-white">
            {[
              { title: "Satisfaction guarantee", desc: "We ensure that our customers have the best shopping experience" },
              { title: "New arrival", desc: "Discover the latest trends with our brand-new arrivals and fresh styles." },
              { title: "Fast and free shipping", desc: "Enjoy lightning-fast delivery at no extra cost, straight to your doorstep." }
            ].map((service, index) => (
              <div key={index} className="bg-blue-100 rounded p-4 flex-1">
                <i className="fa-regular fa-face-smile mb-2"></i>
                <h4 className="font-bold">{service.title}</h4>
                <p className="text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- Footer --- */}
        <footer className="w-full fixed bottom-0 bg-gray-900 text-gray-200 p-4 text-center z-10">
          <h2 className="font-bold text-lg">Get in touch</h2>
          <div className="mt-2.5 flex gap-5 justify-center">
            <i className="fa-brands fa-instagram text-white cursor-pointer"></i>
            <i className="fa-brands fa-facebook text-white cursor-pointer"></i>
            <i className="fa-brands fa-twitter text-white cursor-pointer"></i>
          </div>
          <p className="mt-2.5 text-xs">2026 @FamousShopin</p>
        </footer>
      </div>

      {/* --- Signup Modal (Outside the blur wrapper or handled via conditional rendering) --- */}
      {isSignUpOpen && !isLoggedIn && (
        <div 
          className="fixed inset-0 bg-background bg-opacity-30 flex justify-center items-center z-[100] pointer-events-auto"
        >
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm relative mx-auto sm:mx-0 mt-60 ml-0 sm:mt-0">
            <button 
              onClick={() => setIsSignUpOpen(false)} 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h2 className="text-xl font-bold mb-4">Sign Up</h2>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Username</label>
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div className="flex justify-between">
                <button 
                  type="button" 
                  onClick={handleLogin}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Sign In
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Create Account
                </button>
              </div>
            </form>
            {loginMessage.text && (
              <div className="mt-2 text-center text-sm" style={{ color: loginMessage.color }}>
                {loginMessage.text}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
