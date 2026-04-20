import { useState } from "react";
import Layout from "../components/Layout";

function MLInsights(){

const user = JSON.parse(localStorage.getItem("user") || "{}");
const userId = user?.userId;

const [insights,setInsights] = useState(null);

const generateInsights = async () => {

try{

const res = await fetch(
`https://personal-finance-ai-advisor-production-eac3.up.railway.app/api/ml/${userId}`
);

const data = await res.json();

setInsights(data);

}catch(error){

console.error(error);
alert("Error generating insights");

}

};

return(

<Layout>

<div className="page-card">

<h2>AI Financial Insights</h2>

<button onClick={generateInsights}>
Generate Insights
</button>

{insights && (

<div style={{marginTop:"25px"}}>

<h3>Predicted Next Month Expense</h3>
<p>
  {insights.predictedExpense < 0
    ? `⚠️ Overspending by ₹${Math.abs(insights.predictedExpense)}`
    : `₹${insights.predictedExpense}`
  }
</p>

<h3>Overspending Analysis</h3>
<p>{insights.analysis}</p>

<h3>Savings Suggestion</h3>
<p>{insights.suggestion}</p>

</div>

)}

</div>

</Layout>

);

}

export default MLInsights;