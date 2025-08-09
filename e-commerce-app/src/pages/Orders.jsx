import { useState, useEffect } from "react";
import api from "../Services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    customerName: "",
    customerEmail: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        api.get("/orders"),
        api.get("/products"),
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      setError(err.message || "Veriler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Form verilerini backend API'sine uygun hale getir
      const orderData = {
        product_id: parseInt(formData.productId),
        quantity: parseInt(formData.quantity),
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
      };
      
      await api.post("/orders", orderData);
      fetchData();
      setShowForm(false);
      setFormData({ productId: "", quantity: "", customerName: "", customerEmail: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Sipariş oluşturulamadı");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu siparişi silmek istediğinizden emin misiniz?")) {
      try {
        await api.delete(`/orders/${id}`);
        fetchData();
      } catch (err) {
        setError(err.response?.data?.error || "Silme işlemi başarısız");
      }
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : "Bilinmeyen Ürün";
  };

  const getTotalRevenue = () => {
    return orders.reduce((total, order) => {
      const product = products.find(p => p.id === order.product_id);
      return total + (product ? product.price * order.quantity : 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-16 w-16 mx-auto mb-4"></div>
          <p className="text-neutral-600 text-lg font-medium">Siparişler yükleniyor...</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-2 font-display">📦 Sipariş Yönetimi</h1>
        <p className="text-neutral-600">Siparişlerinizi görüntüleyin ve yönetin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Toplam Sipariş</p>
              <p className="text-3xl font-bold">{orders.length}</p>
            </div>
            <div className="text-4xl animate-float">📦</div>
          </div>
        </div>

        <div className="stats-card-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-100 text-sm font-medium">Toplam Gelir</p>
              <p className="text-3xl font-bold">{getTotalRevenue().toLocaleString()} ₺</p>
            </div>
            <div className="text-4xl animate-float">💰</div>
          </div>
        </div>

        <div className="stats-card-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warning-100 text-sm font-medium">Ortalama Sipariş</p>
              <p className="text-3xl font-bold">
                {orders.length > 0 ? Math.round(getTotalRevenue() / orders.length) : 0} ₺
              </p>
            </div>
            <div className="text-4xl animate-float">📊</div>
          </div>
        </div>

        <div className="stats-card-danger">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-danger-100 text-sm font-medium">Aktif Ürünler</p>
              <p className="text-3xl font-bold">{products.filter(p => p.stock > 0).length}</p>
            </div>
            <div className="text-4xl animate-float">🏪</div>
          </div>
        </div>
      </div>

      {/* Add Order Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <span className="mr-2">➕</span>
          Yeni Sipariş Ekle
        </button>
      </div>

      {/* Add Order Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6 font-display">➕ Yeni Sipariş Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">
                  🏷️ Ürün Seçin
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="form-select"
                  required
                >
                  <option value="">Ürün seçin</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.price} ₺ (Stok: {product.stock})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">
                  📦 Miktar
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  👤 Müşteri Adı
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  📧 Müşteri E-posta
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-success"
                >
                  ➕ Ekle
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ productId: "", quantity: "", customerName: "", customerEmail: "" });
                  }}
                  className="flex-1 btn-secondary"
                >
                  ❌ İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6 font-display">📋 Sipariş Listesi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const product = products.find(p => p.id === order.product_id);
            const totalPrice = product ? product.price * order.quantity : 0;
            
            return (
              <div key={order.id} className="product-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {order.customer_name?.charAt(0).toUpperCase() || "M"}
                  </div>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="p-2 bg-danger-500 text-white rounded-lg hover:bg-danger-600 transition-colors duration-300"
                  >
                    🗑️
                  </button>
                </div>
                <h3 className="font-semibold text-neutral-800 mb-2">{order.customer_name}</h3>
                <p className="text-sm text-neutral-600 mb-2">📧 {order.customer_email}</p>
                <p className="text-sm text-neutral-600 mb-2">📦 {getProductName(order.product_id)}</p>
                <p className="text-sm text-neutral-600 mb-2">🔢 Miktar: {order.quantity}</p>
                <p className="product-price">💰 {totalPrice.toLocaleString()} ₺</p>
                <p className="text-xs text-neutral-500 mt-2">
                  {new Date(order.created_at).toLocaleDateString('tr-TR')}
                </p>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 animate-float">📦</div>
            <h3 className="text-2xl font-bold text-neutral-600 mb-2 font-display">Henüz Sipariş Yok</h3>
            <p className="text-neutral-500">İlk siparişinizi oluşturmak için yukarıdaki butona tıklayın.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

