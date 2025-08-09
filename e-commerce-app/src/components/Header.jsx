import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/UseAuth";

export default function Header() {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isRegisterPage = location.pathname === "/register";
  const isLoginPage = location.pathname === "/login";

  return (
    <header className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 shadow-large border-b-4 border-primary-400 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20"></div>
      <div
        className="absolute top-0 left-0 w-full h-full opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-start items-center h-16 px-4">
          {/* Sol taraf - Logo */}
          <div className="flex items-center pl-0">
            <Link to={"/"} className="flex items-center text-2xl font-bold text-white tracking-wide group">
              <div className="w-10 h-10 bg-gradient-to-r from-white/20 to-white/10 rounded-xl flex items-center justify-center mr-3 backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300">
                🛒
              </div>
            </Link>
          </div>

          {/* Sağ taraf - Kullanıcı menüsü */}
          <div className="flex items-center space-x-4 ml-auto">
            {token ? (
              <>
                {user?.role === "admin" ? (
                  <Link
                    to="/panel"
                    className="flex items-center px-4 py-2 bg-glass text-white rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/30 shadow-soft"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-success-400 to-success-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white font-bold text-sm">
                        {user?.username?.charAt(0).toUpperCase() || "A"}
                      </span>
                    </div>
                    <span className="font-medium">{user?.username || "Admin"}</span>
                    <span className="ml-2 badge badge-success">Admin</span>
                  </Link>
                ) : (
                  <div className="flex items-center px-4 py-2 bg-glass text-white rounded-xl border border-white/30 shadow-soft">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white font-bold text-sm">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="font-medium">{user?.username || "Kullanıcı"}</span>
                    <span className="ml-2 badge badge-primary capitalize">{user?.role}</span>
                  </div>
                )}

                <button onClick={handleLogout} className="btn-danger flex items-center">
                  <span className="mr-2">🚪</span>
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                {isLoginPage && (
                  <Link to="/register" className="btn-success flex items-center">
                    <span className="mr-2">✨</span>
                    Kayıt Ol
                  </Link>
                )}

                {isRegisterPage && (
                  <Link to="/login" className="btn-primary flex items-center">
                    <span className="mr-2">🔑</span>
                    Giriş Yap
                  </Link>
                )}

                {!isRegisterPage && !isLoginPage && (
                  <>
                    <Link to="/register" className="btn-success flex items-center">
                      <span className="mr-2">✨</span>
                      Kayıt Ol
                    </Link>
                    <Link to="/login" className="btn-primary flex items-center">
                      <span className="mr-2">🔑</span>
                      Giriş Yap
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
