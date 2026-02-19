import { Link } from 'react-router-dom';
import '../tailwind.css';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-poppins px-4">
      {/* Visual Icon for 404 */}
      <div className="text-blue-500 mb-4">
        <i className="fa-solid fa-circle-exclamation text-7xl"></i>
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
        404 Page Not Found
      </h1>
      
      <p className="text-lg text-gray-600 text-center mb-8">
        Oops! It looks like you've taken a wrong turn. Please check the URL or return to the shop.
      </p>

      {/* Action Button */}
      <Link 
        to="/" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;