import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const port = 4000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "Root1",
  password: "",
  database: "fast_food_website",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

app.get("/", async (req, res) => {
  res.send("API is running");
});

// Get all menu items
app.get("/menu_items", async (req, res) => {
  try {
    const [rows, fields] = await promisePool.query(
      "SELECT * FROM Menu_Items ORDER BY category"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while retrieving menu items" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await promisePool.query(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the user is admin
    const isAdmin = email === "webhost@gmail.com" && password === "root";

    const token = jwt.sign(
      { user_id: user.user_id, isAdmin },
      "your_jwt_secret"
    );
    res.json({ token, user, isAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while logging in" });
  }
});

// Register route
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await promisePool.query(
      "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );
    const user = { user_id: result.insertId, username, email };

    // Check if the user is admin
    const isAdmin = email === "webhost@gmail.com" && password === "root";

    const token = jwt.sign(
      { user_id: user.user_id, isAdmin },
      "your_jwt_secret"
    );
    res.json({ token, user, isAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while registering" });
  }
});

// Get orders for a specific user
app.get("/orders/:user_id", async (req, res) => {
  try {
    const [rows, fields] = await promisePool.query(
      "SELECT * FROM Orders WHERE user_id = ?",
      [req.params.user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while retrieving orders" });
  }
});

// Create a new order
app.post("/orders", async (req, res) => {
  const { items, total_amount, status } = req.body;
  const user_id = req.body.user_id;
  const order_date = new Date();
  try {
    // Перевірка наявності товарів у замовленні
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // Перевірка наявності необхідних даних
    if (typeof total_amount !== "number" || typeof status !== "string") {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // Отримання першого співробітника
    const [firstEmployee] = await promisePool.query(
      "SELECT employee_id FROM Employees ORDER BY employee_id ASC LIMIT 1"
    );
    if (firstEmployee.length === 0) {
      return res.status(500).json({ message: "No employees found" });
    }
    const employee_id = firstEmployee[0].employee_id;

    // Створення замовлення
    const [result] = await promisePool.query(
      "INSERT INTO Orders (user_id, employee_id, order_date, total_amount, status) VALUES (?, ?, ?, ?, ?)",
      [user_id, employee_id, order_date, total_amount, status]
    );
    const order_id = result.insertId;

    // Створення деталей замовлення
    const orderDetails = items.map((item) => [
      order_id,
      item.id,
      item.quantity,
      item.price,
    ]);
    await promisePool.query(
      "INSERT INTO Order_Details (order_id, item_id, quantity, price) VALUES ?",
      [orderDetails]
    );

    res.status(201).json({ message: "Order created successfully" });
  } catch (err) {
    console.error("Error while creating order:", err);
    res
      .status(500)
      .json({ message: "Error while creating order", error: err.message });
  }
});

// Delete user route
app.delete("/users/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    await promisePool.query("DELETE FROM Users WHERE user_id = ?", [user_id]);
    await promisePool.query("DELETE FROM Orders WHERE user_id = ?", [user_id]);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while deleting user" });
  }
});

// Update price of a menu item
app.put("/menu_items/:item_id/price", async (req, res) => {
  const { item_id } = req.params;
  const { price } = req.body;
  try {
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }
    const [result] = await promisePool.query(
      "UPDATE Menu_Items SET price = ? WHERE item_id = ?",
      [price, item_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({ message: "Price updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while updating price" });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      "SELECT user_id, username FROM Users"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while retrieving users" });
  }
});

// Get all employees
app.get("/employees", async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      "SELECT employee_id, name FROM Employees"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while retrieving employees" });
  }
});

// Get employee info
app.get("/employees/:employee_id", async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      "SELECT * FROM Employees WHERE employee_id = ?",
      [req.params.employee_id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while retrieving employee info" });
  }
});

// Get all orders
app.get("/orders", async (req, res) => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM Orders");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while retrieving orders" });
  }
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
