import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000, // 10 saniye timeout
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Token geçersiz, kullanıcı logout ediliyor");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    const errorMessage =
      error.response?.data?.error || error.response?.data?.message || error.message || "Bir hata oluştu";

    console.error("API Error:", {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url,
    });

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export const fetchWithRetry = async (config, retries = 3) => {
  try {
    return await api(config);
  } catch (error) {
    if (retries > 0 && error.response?.status >= 500) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchWithRetry(config, retries - 1);
    }
    throw error;
  }
};

export const getProductSales = async () => {
  try {
    const response = await api.get("/dashboard-summary");
    return response.data;
  } catch (error) {
    console.error("Ürün satış verileri alınamadı:", error);
    throw error;
  }
};

export const getAdminSummary = async () => {
  try {
    const response = await api.get("/dashboard-summary");
    return response.data;
  } catch (error) {
    console.error("Admin özet verileri alınamadı:", error);
    throw error;
  }
};

export const getSalesCharts = async () => {
  try {
    const response = await api.get("/sales-charts");
    return response.data;
  } catch (error) {
    console.error("Satış grafik verileri alınamadı:", error);
    throw error;
  }
};

export default api;
