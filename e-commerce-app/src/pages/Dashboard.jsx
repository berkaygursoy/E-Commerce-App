import { useEffect, useState } from "react";
import api from "../Services/api";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (err) {
        setError(err.message || "Veri alınamadı");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-16 w-16 mx-auto mb-4"></div>
          <p className="text-neutral-600 text-lg font-medium">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-danger-50 to-warning-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-wiggle">⚠️</div>
          <h2 className="text-2xl font-bold text-danger-600 mb-2">Hata Oluştu</h2>
          <p className="text-danger-500">{error}</p>
        </div>
      </div>
    );
  }

  const toplamUrun = products.length;
  const toplamStok = products.reduce((acc, p) => acc + p.stock, 0);
  const ortalamaFiyat = Math.round(products.reduce((acc, p) => acc + p.price, 0) / toplamUrun);
  const kategoriSayisi = [...new Set(products.map((p) => p.category))].length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-2 font-display">📊 Dashboard</h1>
        <p className="text-neutral-600">E-ticaret performansınızı takip edin</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Toplam Ürün Kartı */}
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Toplam Ürün</p>
              <p className="text-3xl font-bold">{toplamUrun}</p>
            </div>
            <div className="text-4xl animate-float">📦</div>
          </div>
        </div>

        {/* Toplam Stok Kartı */}
        <div className="stats-card-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-100 text-sm font-medium">Toplam Stok</p>
              <p className="text-3xl font-bold">{toplamStok}</p>
            </div>
            <div className="text-4xl animate-float">🏪</div>
          </div>
        </div>

        {/* Ortalama Fiyat Kartı */}
        <div className="stats-card-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warning-100 text-sm font-medium">Ortalama Fiyat</p>
              <p className="text-3xl font-bold">{ortalamaFiyat.toLocaleString()} ₺</p>
            </div>
            <div className="text-4xl animate-float">💰</div>
          </div>
        </div>

        {/* Kategori Sayısı Kartı */}
        <div className="stats-card-danger">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-danger-100 text-sm font-medium">Kategori Sayısı</p>
              <p className="text-3xl font-bold">{kategoriSayisi}</p>
            </div>
            <div className="text-4xl animate-float">🏷️</div>
          </div>
        </div>
      </div>

      {/* Recent Products Section */}
      <div className="card p-6 mb-8">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6 font-display">🆕 Son Eklenen Ürünler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(0, 6).map((product, index) => (
            <div key={index} className="product-card">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold">
                  {product.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-800 truncate">{product.name}</h3>
                  <p className="text-sm text-neutral-600">{product.category}</p>
                  <p className="product-price">{product.price} ₺</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-xl font-bold text-neutral-800 mb-4 font-display">📈 Stok Durumu</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Düşük Stoklu Ürünler</span>
              <span className="font-bold text-danger-500">
                {products.filter(p => p.stock < 10).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Stokta Olan Ürünler</span>
              <span className="font-bold text-success-500">
                {products.filter(p => p.stock > 0).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Stokta Olmayan Ürünler</span>
              <span className="font-bold text-warning-500">
                {products.filter(p => p.stock === 0).length}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-bold text-neutral-800 mb-4 font-display">🏷️ Kategoriler</h3>
          <div className="space-y-2">
            {[...new Set(products.map(p => p.category))].slice(0, 5).map((category, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-neutral-600">{category}</span>
                <span className="font-bold text-primary-600">
                  {products.filter(p => p.category === category).length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-800">📊 Performans</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📈</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Toplam Değer</span>
              <span className="font-bold text-success-600">
                {(products.reduce((acc, p) => acc + (p.price * p.stock), 0)).toLocaleString()} ₺
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Ortalama Stok</span>
              <span className="font-bold text-primary-600">
                {Math.round(toplamStok / toplamUrun)}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-800">⚡ Hızlı Aksiyonlar</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-warning-400 to-warning-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">⚡</span>
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full btn-primary text-sm py-2">
              ➕ Yeni Ürün Ekle
            </button>
            <button className="w-full btn-outline text-sm py-2">
              📊 Rapor Görüntüle
            </button>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-800">🔔 Bildirimler</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-danger-400 to-danger-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🔔</span>
            </div>
          </div>
          <div className="space-y-2">
            {products.filter(p => p.stock < 5).length > 0 && (
              <div className="alert alert-warning text-sm">
                ⚠️ {products.filter(p => p.stock < 5).length} ürün düşük stokta
              </div>
            )}
            {products.filter(p => p.stock === 0).length > 0 && (
              <div className="alert alert-danger text-sm">
                🚫 {products.filter(p => p.stock === 0).length} ürün stokta yok
              </div>
            )}
            {products.filter(p => p.stock < 5).length === 0 && products.filter(p => p.stock === 0).length === 0 && (
              <div className="alert alert-success text-sm">
                ✅ Tüm ürünler stokta mevcut
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
