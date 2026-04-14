import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function AddExpense(){

const { id } = useParams();
const navigate = useNavigate();

const [category,setCategory] = useState("");
const [amount,setAmount] = useState("");
const [description,setDescription] = useState("");
const [date,setDate] = useState("");

const user = JSON.parse(localStorage.getItem("user") || "{}");
const userId = user.userId;

// LOAD EXPENSE FOR EDIT
useEffect(()=>{

if(!id) return;

const loadExpense = async ()=>{

const res = await fetch(
`http://personal-finance-ai-advisor-1.onrender.com/expenses/single/${id}`
);

const data = await res.json();

setCategory(data.category);
setAmount(data.amount);
setDescription(data.description);
setDate(data.date.slice(0,10));

};

loadExpense();

},[id]);

const handleSubmit = async (e)=>{

e.preventDefault();

const url = id
? `http://personal-finance-ai-advisor-1.onrender.com/api/expenses/${id}`
: `http://personal-finance-ai-advisor-1.onrender.com/api/expenses`;

const method = id ? "PUT" : "POST";

const body = id
? {category,amount,description,date}
: {userId,category,amount,description,date};

const res = await fetch(url,{
method,
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(body)
});

if(res.ok){

alert(id ? "Expense updated" : "Expense added");

navigate("/transactions");

}

};

return(

<Layout>

<div className="page-card form-page-card">

<div className="dashboard-form-shell">

<div className="dashboard-form-card">

<button
type="button"
className="dashboard-back-button"
onClick={()=>navigate("/transactions")}
>
Back
</button>

<p className="dashboard-form-eyebrow">Expense Management</p>

<h2 className="dashboard-form-title">{id ? "Edit Expense" : "Add Expense"}</h2>

<p className="dashboard-form-subtitle">
Track spending with clean details and accurate dates.
</p>

<form onSubmit={handleSubmit} className="dashboard-form">

<div className="dashboard-field">
<label className="dashboard-label">Category</label>
<input
className="dashboard-input"
value={category}
onChange={(e)=>setCategory(e.target.value)}
required
/>
</div>

<div className="dashboard-field">
<label className="dashboard-label">Amount</label>
<input
className="dashboard-input"
type="number"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
required
/>
</div>

<div className="dashboard-field">
<label className="dashboard-label">Description</label>
<input
className="dashboard-input"
value={description}
onChange={(e)=>setDescription(e.target.value)}
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

<button type="submit" className="dashboard-submit">
{id ? "Update Expense" : "Add Expense"}
</button>

</form>

</div>

</div>

</div>

</Layout>

);

}

export default AddExpense;
