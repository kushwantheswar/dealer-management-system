import { useNavigate, Link } from "react-router-dom"; // 1. Add Link here

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center bg-gray-900 text-white px-6 py-3">
      <h1 className="font-bold text-lg">Garage Management System</h1>

      {/* 2. Wrap links in a div to keep them together */}
      <div className="flex gap-6 items-center">
        <Link 
          to="/repair-order" 
          className="hover:text-red-400 transition"
        >
          Create RO
        </Link>
        
        <Link 
          to="/ro-list" 
          className="hover:text-red-400 transition"
        >
          Job Cards
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;