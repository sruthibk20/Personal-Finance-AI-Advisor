require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const chatbotRoutes = require("./routes/chatbotRoutes"); // chatbot route

const app = express();

// middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// connect database
connectDB();

// routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/income", require("./routes/incomeRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/summary", require("./routes/summaryRoutes"));
app.use("/api/ml", require("./routes/mlRoutes"));
app.use("/api/budget", require("./routes/budgetRoutes"));
app.use("/api/charts", require("./routes/chartRoutes"));
app.use("/api/chatbot", chatbotRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Personal Finance Advisor API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
