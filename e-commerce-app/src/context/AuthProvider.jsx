import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        return storedToken;
      } catch (error) {
        console.error("Initial state parsing error:", error);
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

    console.log("AuthProvider - Stored token:", storedToken);
    console.log("AuthProvider - Stored user:", storedUser);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        console.log("AuthProvider - Token and user set successfully");
        console.log("AuthProvider - Token state after useEffect:", storedToken);
      } catch (error) {
        console.error("Parsing error:", error);
        logout();
      }
    } else {
      console.log("AuthProvider - No stored token or user found");
    }
  }, []);

  const login = (newToken, userData, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    } else {
      sessionStorage.setItem("token", newToken);
      sessionStorage.setItem("user", JSON.stringify(userData));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setToken(newToken);
    setUser(userData);
  };

  const register = (newToken, userData) => {
    login(newToken, userData);
  };

  const logout = () => {
    // Hem localStorage hem sessionStorage'ı temizle
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    
    // State'leri sıfırla
    setToken(null);
    setUser(null);
    
    console.log("AuthProvider - Logout completed, all storage cleared");
  };

  console.log("AuthProvider - Current token state in render:", token);
  console.log("AuthProvider - Current user state in render:", user);
  return <AuthContext.Provider value={{ token, user, login, logout, register }}>{children}</AuthContext.Provider>;
};
