import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function Transactions() {

  const [expenses,setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.userId;

  const navigate = useNavigate();

  // LOAD EXPENSES
  const loadExpenses = async () => {

    setLoading(true);

    const res = await fetch(`http://personal-finance-ai-advisor-1.onrender.com/api/expenses/user/${userId}`);
    const data = await res.json();

    setExpenses(data);
    setLoading(false);
  };

  // DELETE
  const deleteExpense = async (id) => {

    await fetch(`http://personal-finance-ai-advisor-1.onrender.com/api/expenses/${id}`, {
      method: "DELETE"
    });

    loadExpenses();
  };

  useEffect(()=>{
    loadExpenses();
  },[]);

  // LOADING UI
  if (loading) {
    return <Layout><p>Loading transactions...</p></Layout>;
  }

  return(

    <Layout>

      <div className="page-card">

        <h2>Transactions</h2>
        <p style={{opacity:0.7}}>
          Manage and track your income and expenses.
        </p>

        <div style={{marginTop:"20px",marginBottom:"20px"}}>
          
          <button
            className="btn-green"
            onClick={() => navigate("/add-income")}
          >
            + Add Income
          </button>

          <button
            className="btn-green"
            onClick={() => navigate("/add-expense")}
            style={{ marginLeft: "10px" }}
          >
            + Add Expense
          </button>

        </div>

        <table className="table">

          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {expenses.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", opacity: 0.7, padding: "20px" }}>
                  No expenses added yet.
                </td>
              </tr>
            )}

            {expenses.map((e,i)=>(

              <tr key={i}>

                <td>
                  <span className={`badge badge-${e.category}`}>
                    {e.category}
                  </span>
                </td>

                <td>₹{e.amount}</td>

                <td>{e.description}</td>

                <td>
                  {new Date(e.date).toLocaleDateString()}
                </td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/edit-expense/${e._id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteExpense(e._id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </Layout>

  );

}

export default Transactions;