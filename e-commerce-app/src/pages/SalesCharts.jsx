import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import api from "../Services/api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const SalesCharts = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([api.get("/products"), api.get("/orders")]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      setError(err.message || "Veriler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "Bilinmeyen Ürün";
  };

  const getTotalRevenue = () => {
    return orders.reduce((total, order) => {
      const product = products.find((p) => p.id === order.product_id);
      return total + (product ? product.price * order.quantity : 0);
    }, 0);
  };

  const getTopSellingProducts = () => {
    const productSales = {};
    orders.forEach((order) => {
      const productName = getProductName(order.product_id);
      if (productSales[productName]) {
        productSales[productName] += order.quantity;
      } else {
        productSales[productName] = order.quantity;
      }
    });

    return Object.entries(productSales)
      .map(([name, quantity]) => ({ name, miktar: quantity }))
      .sort((a, b) => b.miktar - a.miktar)
      .slice(0, 5);
  };

  const getCategoryData = () => {
    const categorySales = {};
    orders.forEach((order) => {
      const product = products.find((p) => p.id === order.product_id);
      if (product) {
        if (categorySales[product.category]) {
          categorySales[product.category] += order.quantity;
        } else {
          categorySales[product.category] = order.quantity;
        }
      }
    });

    return Object.entries(categorySales)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-16 w-16 mx-auto mb-4"></div>
          <p className="text-neutral-600 text-lg font-medium">Grafikler yükleniyor...</p>
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

  const topSellingProducts = getTopSellingProducts();
  const categoryData = getCategoryData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-2 font-display">📊 Satış Analizi</h1>
        <p className="text-neutral-600">Satış performansınızı analiz edin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Toplam Ürün</p>
              <p className="text-3xl font-bold">{products.length}</p>
            </div>
            <div className="text-4xl animate-float">📦</div>
          </div>
        </div>

        <div className="stats-card-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-100 text-sm font-medium">Toplam Sipariş</p>
              <p className="text-3xl font-bold">{orders.length}</p>
            </div>
            <div className="text-4xl animate-float">📋</div>
          </div>
        </div>

        <div className="stats-card-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warning-100 text-sm font-medium">Toplam Gelir</p>
              <p className="text-3xl font-bold">{getTotalRevenue().toLocaleString()} ₺</p>
            </div>
            <div className="text-4xl animate-float">💰</div>
          </div>
        </div>

        <div className="stats-card-danger">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-danger-100 text-sm font-medium">Ortalama Sipariş</p>
              <p className="text-3xl font-bold">
                {orders.length > 0 ? Math.round(getTotalRevenue() / orders.length) : 0} ₺
              </p>
            </div>
            <div className="text-4xl animate-float">📊</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6 font-display">📈 Satış Grafiği</h2>
          <ResponsiveContainer width="100%" height={400} className="relative z-10">
            <BarChart data={topSellingProducts}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Bar dataKey="miktar" fill="#3B82F6" radius={[4, 4, 0, 0]} gradient={true} name="Miktar" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6 font-display">🥧 Satış Dağılımı</h2>
          <ResponsiveContainer width="100%" height={400} className="relative z-10">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Selling Products Table */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6 font-display">🏆 En Çok Satan Ürünler</h2>
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left py-4 px-6 font-semibold text-neutral-700">🏆 Sıra</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-700">📦 Ürün</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-700">📊 Satış Miktarı</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-700">💰 Toplam Gelir</th>
              </tr>
            </thead>
            <tbody>
              {topSellingProducts.map((product, index) => {
                const productInfo = products.find((p) => p.name === product.name);
                const totalRevenue = productInfo ? productInfo.price * product.miktar : 0;

                return (
                  <tr key={index} className="table-row">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0
                              ? "bg-warning-500"
                              : index === 1
                              ? "bg-neutral-400"
                              : index === 2
                              ? "bg-danger-500"
                              : "bg-primary-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                          {product.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-neutral-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-neutral-700">{product.miktar} adet</td>
                    <td className="py-4 px-6 font-bold text-success-600">{totalRevenue.toLocaleString()} ₺</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {topSellingProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 animate-float">📊</div>
            <h3 className="text-2xl font-bold text-neutral-600 mb-2 font-display">Henüz Satış Verisi Yok</h3>
            <p className="text-neutral-500">Satış verileri görüntülemek için siparişler oluşturun.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesCharts;
