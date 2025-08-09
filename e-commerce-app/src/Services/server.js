import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import process from "process";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(bodyParser.json());

const dbPath = join(__dirname, "../../database.db");

let db;

async function initializeDatabase() {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log("Connected to SQLite database");

    // Drop existing orders table if it exists (for migration)
    await db.exec(`DROP TABLE IF EXISTS orders`);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        total_price REAL NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    const adminUser = await db.get("SELECT id FROM users WHERE username = 'admin'");
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await db.run("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", [
        "admin",
        "admin@example.com",
        hashedPassword,
        "admin",
      ]);
      console.log("Admin user created");
    }

    const editorUser = await db.get("SELECT id FROM users WHERE username = 'editor'");
    if (!editorUser) {
      const hashedPassword = await bcrypt.hash("editor123", 10);
      await db.run("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", [
        "editor",
        "editor@example.com",
        hashedPassword,
        "editor",
      ]);
      console.log("Editor user created");
    }

    console.log("Database initialization completed");
  } catch (error) {
    console.error("Database initialization error:", error);
    process.exit(1);
  }
}

const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
};

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.error("JWT Verification Error:", err);
        return res.status(403).json({ error: "Geçersiz token" });
      }

      req.user = user;
      next();
    });
  } else {
    console.log("Authorization header missing");
    res.status(401).json({ error: "Yetkilendirme başarısız" });
  }
};

// Editor rolü için middleware - sadece ürün işlemlerine izin verir
const authenticateEditor = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.error("JWT Verification Error:", err);
        return res.status(403).json({ error: "Geçersiz token" });
      }

      if (user.role !== "admin" && user.role !== "editor") {
        return res.status(403).json({ error: "Bu işlem için yetkiniz yok" });
      }

      req.user = user;
      next();
    });
  } else {
    console.log("Authorization header missing");
    res.status(401).json({ error: "Yetkilendirme başarısız" });
  }
};

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ error: "Geçersiz şifre" });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "Tüm alanları doldurun" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Şifreler eşleşmiyor" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Şifre en az 6 karakter olmalı" });
  }

  try {
    const existingUser = await db.get("SELECT id FROM users WHERE username = ? OR email = ?", [username, email]);
    if (existingUser) {
      return res.status(400).json({ error: "Kullanıcı adı veya email zaten kullanımda" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [
      username,
      email,
      hashedPassword,
    ]);

    const newUser = {
      id: result.lastID,
      username,
      email,
      role: "user",
    };

    const token = generateToken(newUser);
    res.json({
      success: true,
      token,
      user: newUser,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Kullanıcı oluşturulamadı" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await db.all("SELECT * FROM products");
    res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/products", authenticateEditor, async (req, res) => {
  const { name, price, stock, category } = req.body;

  if (!name || !price || !stock || !category) {
    return res.status(400).json({ error: "Tüm alanları doldurun" });
  }

  if (stock < 0 || stock > 100) {
    return res.status(400).json({ error: "Stok 0-100 arasında olmalı" });
  }

  try {
    const result = await db.run("INSERT INTO products (name, price, stock, category) VALUES (?, ?, ?, ?)", [
      name,
      parseFloat(price),
      parseInt(stock),
      category,
    ]);

    res.json({
      id: result.lastID,
      name,
      price,
      stock,
      category,
    });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ error: "Ürün eklenemedi" });
  }
});

app.put("/products/:id", authenticateEditor, async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;

  try {
    const result = await db.run("UPDATE products SET name = ?, price = ?, stock = ?, category = ? WHERE id = ?", [
      name,
      price,
      stock,
      category,
      id,
    ]);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }

    res.json({
      id,
      name,
      price,
      stock,
      category,
    });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: "Ürün güncellenemedi" });
  }
});

app.delete("/products/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;

  // Sadece admin'ler ürün silebilir
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Bu işlem için admin yetkisi gereklidir" });
  }

  try {
    const result = await db.run("DELETE FROM products WHERE id = ?", [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Ürün silinemedi" });
  }
});

app.get("/orders", authenticateEditor, async (req, res) => {
  try {
    const orders = await db.all(`
      SELECT o.*, p.name as product_name 
      FROM orders o
      JOIN products p ON o.product_id = p.id
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/orders", authenticateEditor, async (req, res) => {
  const { product_id, quantity, customer_name, customer_email } = req.body;

  if (!product_id || !quantity || quantity <= 0 || !customer_name || !customer_email) {
    return res.status(400).json({ error: "Geçersiz sipariş bilgileri" });
  }

  try {
    await db.run("BEGIN TRANSACTION");

    const product = await db.get("SELECT id, price, stock FROM products WHERE id = ?", [product_id]);
    if (!product) {
      await db.run("ROLLBACK");
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }
    if (product.stock < quantity) {
      await db.run("ROLLBACK");
      return res.status(400).json({ error: "Yetersiz stok" });
    }

    const total_price = product.price * quantity;
    const orderResult = await db.run("INSERT INTO orders (product_id, quantity, total_price, customer_name, customer_email) VALUES (?, ?, ?, ?, ?)", [
      product_id,
      quantity,
      total_price,
      customer_name,
      customer_email,
    ]);

    const newStock = product.stock - quantity;
    await db.run("UPDATE products SET stock = ? WHERE id = ?", [newStock, product_id]);

    await db.run("COMMIT");

    res.json({
      id: orderResult.lastID,
      product_id,
      quantity,
      total_price,
      customer_name,
      customer_email,
      product_name: product.name,
    });
  } catch (err) {
    await db.run("ROLLBACK");
    console.error("Create order error:", err);
    res.status(500).json({ error: "Sipariş işlemi başarısız" });
  }
});

app.delete("/orders/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    await db.run("BEGIN TRANSACTION");

    const order = await db.get(
      "SELECT o.id, o.product_id, o.quantity, p.stock FROM orders o JOIN products p ON o.product_id = p.id WHERE o.id = ?",
      [id]
    );

    if (!order) {
      await db.run("ROLLBACK");
      return res.status(404).json({ error: "Sipariş bulunamadı" });
    }

    await db.run("DELETE FROM orders WHERE id = ?", [id]);

    const newStock = order.stock + order.quantity;
    await db.run("UPDATE products SET stock = ? WHERE id = ?", [newStock, order.product_id]);

    await db.run("COMMIT");

    res.json({
      deleted: true,
      restoredStock: order.quantity,
    });
  } catch (err) {
    await db.run("ROLLBACK");
    console.error("Delete order error:", err);
    res.status(500).json({ error: "Sipariş silme işlemi başarısız" });
  }
});

app.get("/dashboard-summary", async (req, res) => {
  try {
    const productCount = await db.get("SELECT COUNT(*) as count FROM products");
    const orderCount = await db.get("SELECT COUNT(*) as count FROM orders");
    const totalSales = await db.get("SELECT SUM(total_price) as total FROM orders");
    const userCount = await db.get("SELECT COUNT(*) as count FROM users");

    res.json({
      productCount: productCount.count,
      orderCount: orderCount.count,
      totalSales: totalSales.total || 0,
      userCount: userCount.count,
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/sales-charts", authenticateEditor, async (req, res) => {
  try {
    const salesData = await db.all(`
      SELECT p.name as urun_adi, SUM(o.quantity) as toplam_satis
      FROM orders o
      JOIN products p ON o.product_id = p.id
      GROUP BY p.name
      ORDER BY toplam_satis DESC
    `);
    res.json(salesData);
  } catch (err) {
    console.error("Sales charts error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/users", authenticateJWT, async (req, res) => {
  try {
    const users = await db.all("SELECT id, username, email, role, created_at FROM users");
    res.json(users);
  } catch (err) {
    console.error("Users error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 Frontend: ${CORS_ORIGIN}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });

process.on("SIGINT", async () => {
  if (db) {
    await db.close();
    console.log("Database connection closed");
  }
  process.exit(0);
});
