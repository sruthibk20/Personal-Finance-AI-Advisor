import { useState } from "react";
import Layout from "../components/Layout";
import ExpensePieChart from "../components/ExpensePieChart";

function Summary() {

const user = JSON.parse(localStorage.getItem("user") || "{}");
const userId = user?.userId;

const [summary,setSummary] = useState(null);
const [chartData,setChartData] = useState([]);

const getSummary = async () => {

try{

const res = await fetch(
`http://localhost:5000/api/summary/${userId}`
);

const data = await res.json();

setSummary(data);

if(data.categoryBreakdown){
setChartData(data.categoryBreakdown);
}else{
setChartData([]);
}

}catch(error){

console.error(error);
alert("Error loading summary");

}

};

return(

<Layout>

<div className="page-card">

<h2>Financial Summary</h2>

<button onClick={getSummary}>
Load Summary
</button>

{summary && (

<div style={{marginTop:"20px"}}>

<p><strong>Total Income:</strong> ₹{summary.totalIncome}</p>
<p><strong>Total Expense:</strong> ₹{summary.totalExpense}</p>
<p><strong>Balance:</strong> ₹{summary.balance}</p>

</div>

)}

{chartData.length > 0 && (

<div style={{
marginTop:"30px",
display:"flex",
justifyContent:"center"
}}>

<ExpensePieChart data={chartData}/>

</div>

)}

</div>

</Layout>

);

}

export default Summary;