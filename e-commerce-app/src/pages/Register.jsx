import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import { useAuth } from "../context/UseAuth";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Şifreler eşleşmiyor");
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post("/register", {
        username: form.username,
        password: form.password,
        confirmPassword: form.confirmPassword,
        email: form.email,
      });

      if (res.data.success) {
        // Kayıt başarılıysa register fonksiyonunu çağır
        register(res.data.token, res.data.user);
        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
        navigate("/login");
      } else {
        setError(res.data.message || "Kayıt sırasında bir hata oluştu");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Kayıt sırasında bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-success-50 to-primary-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-success-500/5 to-primary-500/5"></div>
      <div
        className="absolute top-0 left-0 w-full h-full opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="w-full max-w-md relative z-10">
        {/* Register Card */}
        <div className="card-gradient p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-success-500 to-primary-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-3xl font-bold text-neutral-800 mb-2 font-display">Hesap Oluştur</h2>
            <p className="text-neutral-600">E-ticaret panelinize katılın</p>
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

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Username Field */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                👤 Kullanıcı Adı
              </label>
              <input
                id="username"
                className="form-input"
                placeholder="Kullanıcı adınızı girin"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                📧 E-posta
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="E-posta adresinizi girin"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                type="password"
                className="form-input"
                placeholder="Şifrenizi girin"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                🔐 Şifre Tekrar
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="form-input"
                placeholder="Şifrenizi tekrar girin"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-success disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner h-5 w-5 mr-2"></div>
                  Kayıt Oluşturuluyor...
                </div>
              ) : (
                <span>✨ Kayıt Ol</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-neutral-600 text-sm">
              Zaten hesabınız var mı?{" "}
              <button 
                type="button" 
                onClick={() => navigate("/login")} 
                className="text-success-600 hover:text-success-700 font-semibold transition-colors duration-300"
              >
                Giriş Yap
              </button>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-success-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}
