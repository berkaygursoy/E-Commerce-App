import { useState, useEffect } from "react";
import api from "../Services/api";

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        api.get("/products"),
        api.get("/orders"),
        api.get("/users"),
      ]);

      const totalRevenue = ordersRes.data.reduce((total, order) => {
        const product = productsRes.data.find(p => p.id === order.productId);
        return total + (product ? product.price * order.quantity : 0);
      }, 0);

      setStats({
        totalProducts: productsRes.data.length,
        totalOrders: ordersRes.data.length,
        totalUsers: usersRes.data.length,
        totalRevenue,
      });
    } catch (err) {
      setError(err.message || "İstatistikler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, icon, color }) => (
    <div className={`bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-${color}-100 text-sm font-medium`}>{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon, color, onClick }) => (
    <div 
      className={`bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-2xl shadow-xl p-6 text-white cursor-pointer transform hover:scale-105 transition-all duration-300`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        <div className="text-2xl">→</div>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className={`text-${color}-100 text-sm`}>{description}</p>
    </div>
  );

  const StatusCard = ({ title, status, icon, color }) => (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r from-${color}-400 to-${color}-500 rounded-xl flex items-center justify-center text-white text-2xl`}>
          {icon}
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${color}-100 text-${color}-800`}>
          {status}
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">Sistem durumu normal</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Admin paneli yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Hata Oluştu</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">👑 Admin Paneli</h1>
        <p className="text-gray-600">Sistem yönetimi ve genel bakış</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Toplam Ürün"
          value={stats.totalProducts}
          icon="📦"
          color="blue"
        />
        <MetricCard
          title="Toplam Sipariş"
          value={stats.totalOrders}
          icon="📋"
          color="green"
        />
        <MetricCard
          title="Toplam Kullanıcı"
          value={stats.totalUsers}
          icon="👥"
          color="purple"
        />
        <MetricCard
          title="Toplam Gelir"
          value={`${stats.totalRevenue.toLocaleString()} ₺`}
          icon="💰"
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">⚡ Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            title="Ürün Yönetimi"
            description="Ürünleri ekle, düzenle ve sil"
            icon="📦"
            color="blue"
            onClick={() => window.location.href = '/products'}
          />
          <QuickActionCard
            title="Sipariş Yönetimi"
            description="Siparişleri görüntüle ve yönet"
            icon="📋"
            color="green"
            onClick={() => window.location.href = '/orders'}
          />
          <QuickActionCard
            title="Kullanıcı Yönetimi"
            description="Kullanıcıları yönet ve izinleri ayarla"
            icon="👥"
            color="purple"
            onClick={() => window.location.href = '/users'}
          />
          <QuickActionCard
            title="Satış Analizi"
            description="Detaylı satış raporları ve grafikler"
            icon="📊"
            color="orange"
            onClick={() => window.location.href = '/charts'}
          />
        </div>
      </div>

      {/* System Status */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🔧 Sistem Durumu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatusCard
            title="Veritabanı"
            status="Aktif"
            icon="🗄️"
            color="green"
          />
          <StatusCard
            title="API Servisi"
            status="Çalışıyor"
            icon="🔌"
            color="blue"
          />
          <StatusCard
            title="Güvenlik"
            status="Güvenli"
            icon="🔒"
            color="purple"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Son Aktiviteler</h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mr-4">
              ✅
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Sistem Başlatıldı</h3>
              <p className="text-gray-600 text-sm">Admin paneli başarıyla yüklendi</p>
            </div>
            <span className="text-gray-500 text-sm">Şimdi</span>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-4">
              📊
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">İstatistikler Güncellendi</h3>
              <p className="text-gray-600 text-sm">Tüm veriler başarıyla yüklendi</p>
            </div>
            <span className="text-gray-500 text-sm">1 dk önce</span>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white mr-4">
              🔒
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Güvenlik Kontrolü</h3>
              <p className="text-gray-600 text-sm">Tüm güvenlik protokolleri aktif</p>
            </div>
            <span className="text-gray-500 text-sm">2 dk önce</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
