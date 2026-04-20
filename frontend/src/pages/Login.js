import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const navigate = useNavigate();

const handleLogin = async (e)=>{

e.preventDefault();

try{

const res = await fetch(
"https://personal-finance-ai-advisor-production-eac3.up.railway.app/api/users/login",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
password
})
}
);

const data = await res.json();

if(res.ok){

// store only user object
const userData = data.user || data;

localStorage.setItem("user",JSON.stringify(userData));

navigate("/dashboard");

}else{

alert(data.message || "Login failed");

}

}catch(error){

console.error(error);
alert("Server error");

}

};

return(

<div className="auth-container">

<div className="auth-card">

<h2 className="auth-title">Login</h2>

<form onSubmit={handleLogin} className="auth-form">

<input
type="email"
className="auth-input"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

<input
type="password"
className="auth-input"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button
type="submit"
className="auth-button"
>
Login
</button>

</form>

<p className="auth-footer">

New user?{" "}

<Link to="/register" className="auth-link">
Register
</Link>

</p>

</div>

</div>

);

}

export default Login;
