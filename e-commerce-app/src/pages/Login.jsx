import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UseAuth";
import api from "../Services/api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/login", form);

      if (response.data.token && response.data.user) {
        console.log("Login - Token received:", response.data.token);
        console.log("Login - User received:", response.data.user);
        login(response.data.token, response.data.user, rememberMe);
        console.log("Login - Login function called, navigating to /");
        navigate("/");
      } else {
        setError("Geçersiz yanıt formatı");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Giriş başarısız");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5"></div>
      <div
        className="absolute top-0 left-0 w-full h-full opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230ea5e9' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="w-full max-w-md relative z-10">
        {/* Login Card */}
        <div className="card-gradient p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <span className="text-2xl">🔐</span>
            </div>
            <h2 className="text-3xl font-bold text-neutral-800 mb-2 font-display">Hoş Geldiniz</h2>
            <p className="text-neutral-600">E-ticaret panelinize giriş yapın</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger mb-6">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                👤 Kullanıcı Adı
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Kullanıcı adınızı girin"
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                🔒 Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Şifrenizi girin"
                required
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded mr-2"
              />
              <label htmlFor="rememberMe" className="text-sm text-neutral-700 select-none cursor-pointer">
                Beni Hatırla
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner h-5 w-5 mr-2"></div>
                  Giriş Yapılıyor...
                </div>
              ) : (
                <span>🚀 Giriş Yap</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-neutral-600 text-sm">
              Hesabınız yok mu?{" "}
              <a href="/register" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-300">
                Kayıt Ol
              </a>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}
