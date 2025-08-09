import { useState, useEffect } from "react";
import api from "../Services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (err) {
      setError(err.message || "Ürünler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
      } else {
        await api.post("/products", formData);
      }
      fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: "", price: "", stock: "", category: "" });
    } catch (err) {
      setError(err.response?.data?.error || "İşlem başarısız");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.error || "Silme işlemi başarısız");
      }
    }
  };

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-16 w-16 mx-auto mb-4"></div>
          <p className="text-neutral-600 text-lg font-medium">Ürünler yükleniyor...</p>
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
        <h1 className="text-4xl font-bold text-gradient mb-2 font-display">📦 Ürün Yönetimi</h1>
        <p className="text-neutral-600">Ürünlerinizi ekleyin, düzenleyin ve yönetin</p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-search"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">🔍</div>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center">
          <span className="mr-2">➕</span>
          Yeni Ürün Ekle
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6 font-display">
              {editingProduct ? "✏️ Ürün Düzenle" : "➕ Yeni Ürün Ekle"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">📝 Ürün Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">💰 Fiyat</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">📦 Stok Miktarı</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">🏷️ Kategori</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 btn-success">
                  {editingProduct ? "💾 Güncelle" : "➕ Ekle"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    setFormData({ name: "", price: "", stock: "", category: "" });
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {product.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-300"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-danger-500 text-white rounded-lg hover:bg-danger-600 transition-colors duration-300"
                >
                  🗑️
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-neutral-800 mb-2">{product.name}</h3>
            <p className="text-neutral-600 mb-2">🏷️ {product.category}</p>
            <p className="product-price mb-2">💰 {product.price} ₺</p>
            <p className="product-stock">📦 Stok: {product.stock}</p>

            {/* Stock Status Badge */}
            <div className="mt-3">
              {product.stock === 0 ? (
                <span className="badge badge-danger">Stokta Yok</span>
              ) : product.stock < 10 ? (
                <span className="badge badge-warning">Düşük Stok</span>
              ) : (
                <span className="badge badge-success">Stokta Mevcut</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 animate-float">📦</div>
          <h3 className="text-2xl font-bold text-neutral-600 mb-2 font-display">Ürün Bulunamadı</h3>
          <p className="text-neutral-500">Arama kriterlerinize uygun ürün bulunmuyor.</p>
        </div>
      )}

      {/* Products Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Toplam Ürün</p>
              <p className="text-2xl font-bold text-primary-600">{products.length}</p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Toplam Değer</p>
              <p className="text-2xl font-bold text-success-600">
                {products.reduce((acc, p) => acc + p.price * p.stock, 0).toLocaleString()} ₺
              </p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Kategoriler</p>
              <p className="text-2xl font-bold text-secondary-600">
                {[...new Set(products.map((p) => p.category))].length}
              </p>
            </div>
            <div className="text-3xl">🏷️</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
