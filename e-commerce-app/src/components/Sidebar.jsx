import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/UseAuth";

const Sidebar = () => {
  const { user, token } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "📊", roles: ["admin", "editor"], color: "from-primary-500 to-primary-600" },
    {
      path: "/products",
      label: "Ürünler",
      icon: "📦",
      roles: ["admin", "editor"],
      color: "from-success-500 to-success-600",
    },
    {
      path: "/orders",
      label: "Siparişler",
      icon: "🛒",
      roles: ["admin", "editor"],
      color: "from-warning-500 to-warning-600",
    },
    {
      path: "/charts",
      label: "Grafikler",
      icon: "📈",
      roles: ["admin", "editor"],
      color: "from-secondary-500 to-secondary-600",
    },
    {
      path: "/users",
      label: "Kullanıcılar",
      icon: "👥",
      roles: ["admin"],
      color: "from-danger-500 to-danger-600",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white shadow-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10"></div>
      <div
        className="absolute top-0 left-0 w-full h-full opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🛒</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide font-display">E-Ticaret</h2>
              <p className="text-xs text-primary-200 font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* User Info - Sadece giriş yapmış kullanıcılar için */}
        {token && user && (
          <div className="p-6 border-b border-white/10 backdrop-blur-sm">
            <div className="flex items-center space-x-3 p-3 bg-glass rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-success-400 via-primary-500 to-secondary-600 rounded-full flex items-center justify-center shadow-lg relative">
                <span className="text-white font-bold text-lg">{user?.username?.charAt(0).toUpperCase() || "U"}</span>
                {/* Online Status Indicator */}
                <div className="status-online absolute -bottom-1 -right-1"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white truncate">{user?.username || "Kullanıcı"}</p>
                <p className="text-xs text-primary-200 capitalize font-medium">{user?.role || "user"}</p>
              </div>
            </div>
          </div>
        )}

        {token && user ? (
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-xs font-bold text-primary-200 uppercase tracking-wider mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                Hoş Geldiniz
              </h3>
            </div>

            <ul className="space-y-2">
              {menuItems.map((item) => {
                if (item.roles && !item.roles.includes(user?.role)) return null;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`nav-link ${
                        isActive(item.path)
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                      ></div>

                      {/* Icon */}
                      <div
                        className={`relative z-10 text-lg transform group-hover:scale-110 transition-transform duration-300 ${
                          isActive(item.path) ? "animate-pulse" : ""
                        }`}
                      >
                        {item.icon}
                      </div>

                      {/* Label */}
                      <span className="relative z-10 font-medium flex-1">{item.label}</span>

                      {/* Active Indicator */}
                      {isActive(item.path) && (
                        <div className="relative z-10 ml-auto flex items-center space-x-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}

                      {/* Hover Arrow */}
                      {!isActive(item.path) && (
                        <div className="relative z-10 ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300">
                          <span className="text-primary-300">→</span>
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : (
          <div className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-float">🔐</div>
              <p className="text-gray-300 text-sm">Giriş yapın</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-white/10 backdrop-blur-sm">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="status-online animate-pulse"></div>
              <p className="text-xs text-success-400 font-medium">Sistem Aktif</p>
            </div>
            <p className="text-xs text-gray-400">© 2025 E-Ticaret Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
