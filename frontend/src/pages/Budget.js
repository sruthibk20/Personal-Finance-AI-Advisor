import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function Budget() {

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.userId;

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  const [month, setMonth] = useState(getCurrentMonth());
  const [budgetLimit, setBudgetLimit] = useState("");
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBudget = async () => {
      if (!userId) return;

      setLoading(true);
      setBudgetData(null);

      try {
        const res = await fetch(
          `http://localhost:5000/api/budget/${userId}?month=${month}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch budget");
        }

        const data = await res.json();

        setBudgetData(data);

        if (data) {
          setBudgetLimit(String(data.limit ?? ""));
        } else {
          setBudgetLimit("");
        }

      } catch (error) {
        console.error(error);
        alert("Error fetching budget");
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [userId, month]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User not found");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("http://localhost:5000/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          month,
          limit: budgetLimit
        })
      });

      if (!res.ok) {
        throw new Error("Failed to save budget");
      }

      const savedBudget = await res.json();
      const savedLimit = Number(savedBudget.limit ?? budgetLimit ?? 0);

      // Update the summary immediately so the UI changes without a reload.
      setBudgetData((prev) => {
        const totalExpense = Number(prev?.totalExpense ?? 0);
        const remainingBudget = savedLimit - totalExpense;

        return {
          month: savedBudget.month || month,
          limit: savedLimit,
          totalExpense,
          remainingBudget,
          alertMessage: remainingBudget < 0
            ? `Budget exceeded by ₹${Math.abs(remainingBudget)}`
            : "You are within your budget."
        };
      });

      setBudgetLimit(String(savedLimit));

      const budgetRes = await fetch(
        `http://localhost:5000/api/budget/${userId}?month=${month}`
      );

      if (!budgetRes.ok) {
        throw new Error("Failed to refresh budget");
      }

      const refreshedBudget = await budgetRes.json();

      if (refreshedBudget) {
        setBudgetData(refreshedBudget);
        setBudgetLimit(String(refreshedBudget.limit ?? ""));
      }

      alert("Budget saved");

    } catch (error) {
      console.error(error);
      alert("Error saving budget");
    } finally {
      setSaving(false);
    }
  };

  const displayMonth = budgetData?.month || month;
  const displayLimit = Number(budgetData?.limit ?? budgetLimit ?? 0);
  const totalExpense = Number(budgetData?.totalExpense ?? 0);
  const remainingBudget = Number(
    budgetData?.remainingBudget ?? (displayLimit - totalExpense)
  );
  const alertMessage = budgetData?.alertMessage || "You are within your budget.";
  const progress = displayLimit > 0
    ? Math.min((totalExpense / displayLimit) * 100, 100)
    : 0;
  const isExceeded = displayLimit > 0 && totalExpense > displayLimit;

  return (

    <Layout>

      <div className="page-card budget-page-card">

        <div className="budget-layout">

          <div className="budget-form-card">

            <p className="dashboard-form-eyebrow">Monthly Budget</p>

            <h2 className="dashboard-form-title">Budget Planner</h2>

            <p className="dashboard-form-subtitle">
              Set your monthly spending limit and track how much budget is still available.
            </p>

            <form onSubmit={handleSubmit} className="dashboard-form budget-form">

              <div className="budget-form-grid">

                <div className="dashboard-field">
                  <label className="dashboard-label">Month</label>
                  <input
                    className="dashboard-input"
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                  />
                </div>

                <div className="dashboard-field">
                  <label className="dashboard-label">Budget Amount</label>
                  <input
                    className="dashboard-input"
                    type="number"
                    min="0"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    placeholder="Enter monthly budget"
                    required
                  />
                </div>

              </div>

              <button type="submit" className="dashboard-submit" disabled={saving}>
                {saving ? "Saving..." : budgetData ? "Update Budget" : "Save Budget"}
              </button>

            </form>

          </div>

          <div className="budget-summary-card">

            <div className="budget-summary-header">
              <div>
                <p className="dashboard-form-eyebrow">Summary</p>
                <h3 className="budget-summary-title">Budget Overview</h3>
              </div>

              <span className={`budget-status ${isExceeded ? "budget-status-danger" : "budget-status-safe"}`}>
                {isExceeded ? "Exceeded" : "On Track"}
              </span>
            </div>

            <div className="budget-metrics-grid">
              <div className="budget-metric">
                <span className="budget-metric-label">Month</span>
                <strong>{displayMonth}</strong>
              </div>

              <div className="budget-metric">
                <span className="budget-metric-label">Budget Limit</span>
                <strong>₹{displayLimit}</strong>
              </div>

              <div className="budget-metric">
                <span className="budget-metric-label">Total Expense</span>
                <strong>₹{totalExpense}</strong>
              </div>

              <div className="budget-metric">
                <span className="budget-metric-label">Remaining</span>
                <strong className={isExceeded ? "budget-danger-text" : "budget-safe-text"}>
                  ₹{remainingBudget}
                </strong>
              </div>
            </div>

            <div className="budget-progress-block">
              <div className="budget-progress-labels">
                <span>Budget usage</span>
                <span>{progress.toFixed(0)}%</span>
              </div>

              <div className="budget-progress-track">
                <div
                  className={`budget-progress-fill ${isExceeded ? "budget-progress-fill-danger" : ""}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className={`budget-alert ${isExceeded ? "budget-alert-danger" : "budget-alert-safe"}`}>
              {loading
                ? "Loading budget summary..."
                : budgetData
                  ? alertMessage
                  : "No budget saved for this month yet. Set one above to start tracking."}
            </div>

          </div>

        </div>

      </div>

    </Layout>

  );
}

export default Budget;
