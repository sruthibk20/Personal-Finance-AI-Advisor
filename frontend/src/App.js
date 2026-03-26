import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ExpenseList from "./pages/ExpenseList";
import AddExpense from "./pages/AddExpense";
import AddIncome from "./pages/AddIncome";
import Budget from "./pages/Budget";
import Chatbot from "./components/Chatbot";
import Profile from "./pages/Profile";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* MAIN APP */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<ExpenseList />} />

        {/* EXPENSE ROUTES */}
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/edit-expense/:id" element={<AddExpense />} />

        {/* INCOME */}
        <Route path="/add-income" element={<AddIncome />} />

        {/* BUDGET */}
        <Route path="/budget" element={<Budget />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>

      <Chatbot />

    </BrowserRouter>

  );

}

export default App;
