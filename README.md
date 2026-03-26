💰 Personal Finance AI Advisor

A full-stack web application that helps users manage income and expenses, track monthly budgets, visualize spending patterns, and get AI-powered financial insights.

🚀 Features
👤 User Management

User Registration & Login

Secure authentication using JWT

Protected routes (dashboard accessible only after login)

💸 Income & Expense Management (CRUD)

Add, view, edit, and delete income records

Add, view, edit, and delete expense records

Expenses categorized (Food, Travel, Shopping, etc.)

Date-based expense tracking

📅 Monthly Expense Tracking

View expenses filtered by month

Organized tabular display

📊 Budget Management

Set monthly budget

Compare budget vs actual expenses

Shows remaining or overspent amount

📈 Visual Analytics

Expense distribution charts

Monthly spending overview

🤖 AI-Powered Financial Insights

Expense prediction for next month

Overspending detection by category

Smart savings suggestions

🧭 Clean UI & Navigation

Sidebar-based navigation

Center-aligned dashboard layout

Responsive web design

🛠 Tech Stack

~Frontend:
React.js
React Router DOM
CSS (custom styling)
Chart.js (for graphs)

~Backend:
Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication

~AI / ML
Python
Pandas
PyMongo
Rule-based ML logic

📁 Project Structure
Personal-Finance-AI-Advisor/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│
├── ml/
│   └── financial_insights.py
│
└── README.md

⚙️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/sruthibk20/Personal-Finance-AI-Advisor.git

2️⃣ Backend Setup
cd backend
npm install
node server.js

3️⃣ Frontend Setup
cd frontend
npm install
npm start

4️⃣ MongoDB

Install MongoDB locally
Ensure MongoDB is running on mongodb://127.0.0.1:27017

🧪 Testing the Application

Register a new user
Login with credentials
Add income and expenses
Set monthly budget
View expense summary and charts
Check AI financial insights

📌 Future Enhancements

Password reset functionality
Export reports as PDF
Mobile-responsive UI
Advanced ML models for predictions
Cloud deployment (AWS / Render)

👩‍💻 Author

Sruthi B
B.Tech – Artificial Intelligence and Machine Learning
Java | Python 
Personal Finance AI Advisor – Academic Project

⭐ Conclusion

This project demonstrates:
Full-stack development skills
REST API design
MongoDB data modeling
Real-world financial problem solving
⭐ Conclusion

This project demonstrates:
- Full-stack development skills
- REST API design
- MongoDB data modeling
- Real-world financial problem solving
- AI integration into web applications