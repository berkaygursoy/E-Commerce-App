# E-Ticaret Admin Paneli

Modern bir React tabanlı admin paneli, e-ticaret sisteminizi yönetmek için tasarlanmıştır. Kullanıcı yönetimi, ürün takibi, sipariş yönetimi ve detaylı analizler sunar.

## ✨ Özellikler

- **Kapsamlı Dashboard:** Satış istatistikleri ve özet bilgiler
- **Kullanıcı Yönetimi:** Rol tabanlı erişim kontrolü (Admin/Editor/User)
- **Ürün Yönetimi:** CRUD işlemleri ve stok takibi
- **Sipariş Yönetimi:** Sipariş oluşturma, görüntüleme ve silme
- **Analitik Raporlar:** Satış grafikleri ve performans metrikleri
- **Güvenlik:** JWT tabanlı kimlik doğrulama

## 🛠 Teknoloji Stack'i

### Frontend
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **React Router**
- **Axios**
- **Recharts** (veri görselleştirme)

### Backend
- **Node.js**
- **Express**
- **SQLite**
- **JWT Authentication**
- **Bcrypt** (şifre hashleme)

## 🚀 Kurulum Adımları

### Adım 1: Repo'yu Klonlayın
Projeyi yerel makinenize klonlamak için şu komutu kullanın:
```bash
git clone https://github.com/[kullanici-adi]/e-ticaret-admin.git

Adım 2: Bağımlılıkları Yükleyin
cd e-ticaret-admin
npm install

Adım 3: Backend'i Başlatın
cd src/Services
node server.js

Adım 4: Frontend'i Başlatın
npm run dev
Proje, varsayılan olarak http://localhost:3000'de çalışacaktır.

📂 Proje Yapısı
src/
├── components/    # Paylaşılan UI bileşenleri
├── context/       # Auth context ve provider'lar
├── pages/         # Uygulama sayfaları
├── Services/      # Backend API ve config
└── styles/        # Global stiller

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# E-Commerce Admin Panel

A modern React-based admin panel designed for managing an e-commerce system. It offers user management, product tracking, order management, and detailed analytics.

## ✨ Features

- **Comprehensive Dashboard:** Sales statistics and summary information
- **User Management:** Role-based access control (Admin/Editor/User)
- **Product Management:** CRUD operations and stock tracking
- **Order Management:** Create, view, and delete orders
- **Analytic Reports:** Sales charts and performance metrics
- **Security:** JWT-based authentication

## 🛠 Technology Stack

### Frontend
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **React Router**
- **Axios**
- **Recharts** (data visualization)

### Backend
- **Node.js**
- **Express**
- **SQLite**
- **JWT Authentication**
- **Bcrypt** (password hashing)

## 🚀 Setup Instructions

### Step 1: Clone the Repository
To get started, clone the repository to your local machine:
```bash
git clone https://github.com/[username]/e-ticaret-admin.git
Step 2: Install Dependencies
cd e-ticaret-admin
npm install

Step 3: Start the Backend
cd src/Services
node server.js

Step 4: Start the Frontend
bash
Kopyala
Düzenle
npm run dev
The project will be available at http://localhost:3000 by default.

📂 Project Structure
src/
├── components/    # Shared UI components
├── context/       # Auth context and providers
├── pages/         # Application pages
├── Services/      # Backend API and configurations
└── styles/        # Global styles
