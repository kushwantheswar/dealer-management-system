import { Link, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/"); // Smooth navigation without full page reload
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Left Side: Logo */}
            <div className="flex items-center">
              <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
                DMS
              </Link>
            </div>

            {/* Center: Navigation Links (Hidden on very small screens) */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/dashboard" 
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/job-list" 
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
              >
                Job Cards
              </Link>
              <Link 
                to="/customers" 
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
              >
                Customers
              </Link>
              <Link 
                to="/billing" 
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
              >
                Billing
              </Link>
              <Link to="/close-ro" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
               Close RO
              </Link>
            </div>

            {/* Right Side: User & Logout */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium hidden sm:block">
                Admin User
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold 
                           hover:bg-red-600 transition-colors shadow-sm"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;