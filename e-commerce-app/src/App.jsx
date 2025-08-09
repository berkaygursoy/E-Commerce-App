import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./context/UseAuth";
import PrivateRoute from "./PrivateRoute";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SalesCharts from "./pages/SalesCharts";

// Özel route bileşeni
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === "admin" ? children : <Navigate to="/" />;
};

// Editor ve Admin route bileşeni
const EditorRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === "admin" || user?.role === "editor" ? children : <Navigate to="/" />;
};

// Ana uygulama yapısı
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

// Uygulama içeriği (ayrı bileşen olarak)
function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
      <Header />
      <div className="flex min-h-screen">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

// Ana içerik alanı
function MainContent() {
  return (
    <div className="flex-1 p-6">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <EditorRoute>
                <Products />
              </EditorRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <EditorRoute>
                <Orders />
              </EditorRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/panel"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/charts"
          element={
            <PrivateRoute>
              <EditorRoute>
                <SalesCharts />
              </EditorRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <AdminRoute>
                <EditorRoute>
                  <Users />
                </EditorRoute>
              </AdminRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
