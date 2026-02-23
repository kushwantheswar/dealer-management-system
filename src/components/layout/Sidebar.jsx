import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-60 bg-gray-100 min-h-screen p-5 border-r">
      <nav className="space-y-4 font-medium">
        <Link className="block hover:text-blue-600" to="/dashboard">
          Dashboard
        </Link>
        <Link className="block hover:text-blue-600" to="/customers">
          Customers
        </Link>
        {/* CHANGE THIS LINE: to="/ro-list" */}
        <Link className="block hover:text-blue-600" to="/ro-list">
          Job Cards
        </Link>
      </nav>
    </div>
  );
}