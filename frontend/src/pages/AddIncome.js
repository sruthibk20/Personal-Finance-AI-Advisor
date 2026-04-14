import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function AddIncome() {

  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.userId;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await fetch("https://personal-finance-ai-advisor-1.onrender.com/api/income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          source,
          amount,
          date
        })
      });

      alert("Income added");

      setSource("");
      setAmount("");
      setDate("");

    } catch (error) {
      console.error(error);
      alert("Error adding income");
    }
  };

  return (
    <Layout>

      <div className="page-card form-page-card">

        <div className="dashboard-form-shell">

          <div className="dashboard-form-card">

            <button
              type="button"
              className="dashboard-back-button"
              onClick={() => navigate("/transactions")}
            >
              Back
            </button>

            <p className="dashboard-form-eyebrow">Income Tracking</p>

            <h2 className="dashboard-form-title">Add Income</h2>

            <p className="dashboard-form-subtitle">
              Record new income sources with a polished, dashboard-friendly form.
            </p>

            <form onSubmit={handleSubmit} className="dashboard-form">

              <div className="dashboard-field">
                <label className="dashboard-label">Source</label>
                <input
                  className="dashboard-input"
                  type="text"
                  placeholder="Salary, freelance, investment..."
                  value={source}
                  onChange={(e)=>setSource(e.target.value)}
                  required
                />
              </div>

              <div className="dashboard-field">
                <label className="dashboard-label">Amount</label>
                <input
                  className="dashboard-input"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e)=>setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="dashboard-field">
                <label className="dashboard-label">Date</label>
                <input
                  className="dashboard-input"
                  type="date"
                  value={date}
                  onChange={(e)=>setDate(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="dashboard-submit">Add Income</button>

            </form>

          </div>

        </div>
        
      </div>

    </Layout>
  );
}

export default AddIncome;
