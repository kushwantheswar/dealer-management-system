import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const auth = localStorage.getItem("auth");

  if (auth === "true") {
    return children;
  }

  return <Navigate to="/" replace />;
};

export default PrivateRoute;
