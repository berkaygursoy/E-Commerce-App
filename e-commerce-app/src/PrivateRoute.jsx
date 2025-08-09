import { Navigate } from "react-router-dom";
import { useAuth } from "./context/UseAuth";

export default function PrivateRoute({ children }) {
  const { token } = useAuth();
  console.log("PrivateRoute - Token:", token);
  console.log("PrivateRoute - Token exists:", !!token);
  return token ? children : <Navigate to="/login" replace />;
}
