import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ExpensePieChart from "../components/ExpensePieChart";
import HealthGauge from "../components/HealthGauge";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function Dashboard() {

  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [ml, setMl] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.userId;

  // ✅ LOAD SUMMARY (unchanged)
  const loadSummary = async () => {
    try {
      const res = await fetch(
        `http://personal-finance-ai-advisor-1.onrender.com/api/summary/${userId}`
      );

      const data = await res.json();

      setSummary(data);
      setChartData(data.monthlyExpenses || []);
      setCategoryData(data.categoryBreakdown || []);

    } catch (error) {
      console.error("Summary error:", error);
    }
  };

  // ✅ FIXED ML FUNCTION
  const loadML = async () => {
    try {
      const res = await fetch(
        `http://personal-finance-ai-advisor-1.onrender.com/api/ml/${userId}`
      );

      const data = await res.json();

      setMl(data);

    } catch (error) {
      console.error("ML fetch error:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      loadSummary();
      loadML();
    }
  }, [userId]);

  return (

    <Layout>

      <div className="page-card">

        <h2 style={{ marginBottom: "10px" }}>Dashboard</h2>

        <p style={{ opacity: 0.7, marginBottom: "20px" }}>
          Track your financial health and spending insights
        </p>

        {summary && (

          <>

            {/* STAT CARDS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "20px",
                marginBottom: "10px"
              }}
            >

              <div className="stat-card">
                <h3>Income</h3>
                <p>₹{summary.totalIncome}</p>
              </div>

              <div className="stat-card">
                <h3>Expense</h3>
                <p>₹{summary.totalExpense}</p>
              </div>

              <div className="stat-card">
                <h3>Balance</h3>
                <p>₹{summary.balance}</p>
              </div>

              <div className="stat-card">
                <h3>Savings Rate</h3>
                <p>{summary.savingsRate}%</p>
              </div>

              <div className="stat-card">
                <h3>Health Score</h3>

                <HealthGauge
                  score={summary.financialHealthScore}
                />

              </div>

            </div>

            {/* CHART + AI INSIGHTS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px"
              }}
            >

              {/* LEFT SIDE */}

              <div>

                {/* MONTHLY CHART */}

                <div className="stat-card">

                  <h3 style={{ marginBottom: "20px" }}>
                    Monthly Expense Trend
                  </h3>

                  <ResponsiveContainer
                    width="100%"
                    height={150}
                  >

                    <BarChart data={chartData}>

                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="month" />

                      <YAxis />

                      <Tooltip />

                      <Bar
                        dataKey="amount"
                        fill="#4ade80"
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

                {/* PIE CHART */}

                <div
                  className="stat-card"
                  style={{ marginTop: "20px" }}
                >

                  <h3 style={{ marginBottom: "20px" }}>
                    Expense Categories
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      alignItems: "center"
                    }}
                  >

                    <ExpensePieChart data={categoryData} />

                    <div>

                      {categoryData.map((c, i) => (

                        <p key={i}>
                          ● {c.category} ₹{c.amount}
                        </p>

                      ))}

                    </div>

                  </div>

                </div>

              </div>

              {/* RIGHT SIDE */}

              <div className="stat-card ai-insights-card">

                <div className="ai-insights-header">
                  <div>
                    <p className="ai-insights-eyebrow">AI Assistant</p>
                    <h3 className="ai-insights-title">AI Financial Insights</h3>
                  </div>

                  <div className="ai-insights-badge">Live</div>
                </div>

                {ml ? (

                  <div className="ai-insights-content">

                    <div className="ai-prediction-card">
                      <span className="ai-prediction-label">Predicted Expense</span>
                      <strong className="ai-prediction-value">₹{ml.predictedExpense}</strong>
                    </div>

                    <div className="ai-insight-section">
                      <h4 className="ai-insight-heading">Analysis</h4>
                      <p className="ai-insight-text">{ml.analysis}</p>
                    </div>

                    <div className="ai-insight-section">
                      <h4 className="ai-insight-heading">Suggestion</h4>
                      <p className="ai-insight-text">{ml.suggestion}</p>
                    </div>

                  </div>

                ) : (

                  <div className="ai-empty-state">
                    Generating AI insights...
                  </div>

                )}

              </div>

            </div>

          </>

        )}

      </div>

    </Layout>

  );

}

export default Dashboard;