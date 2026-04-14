import sys
import json
import pandas as pd
from pymongo import MongoClient
from sklearn.linear_model import LinearRegression
from bson import ObjectId
import numpy as np

# get userId
user_id = sys.argv[1]

client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["financeDB"]

expenses_collection = db["expenses"]
income_collection = db["incomes"]

# fetch data
expenses = list(expenses_collection.find({
    "userId": ObjectId(user_id)
}))

income = list(income_collection.find({
    "userId": ObjectId(user_id)
}))

expenses_df = pd.DataFrame(expenses)
income_df = pd.DataFrame(income)

total_expense = expenses_df["amount"].sum() if not expenses_df.empty else 0
total_income = income_df["amount"].sum() if not income_df.empty else 0

predicted_expense = total_expense
trend = "stable"

# ---------- MACHINE LEARNING ----------

if not expenses_df.empty:

    expenses_df["date"] = pd.to_datetime(expenses_df["date"])

    # group by month and SORT (important fix)
    expenses_df["month"] = expenses_df["date"].dt.to_period("M")

    monthly = expenses_df.groupby("month")["amount"].sum().reset_index()
    monthly = monthly.sort_values("month")   # 🔥 IMPORTANT FIX

    monthly["month_index"] = range(len(monthly))

    X = monthly[["month_index"]]
    y = monthly["amount"]

    model = LinearRegression()
    model.fit(X, y)

    next_month = [[len(monthly)]]
    predicted_expense = model.predict(next_month)[0]

    # -------- TREND DETECTION --------
    if len(y) > 1:
        if y.iloc[-1] > y.iloc[0]:
            trend = "increasing"
        elif y.iloc[-1] < y.iloc[0]:
            trend = "decreasing"

# ---------- CATEGORY ANALYSIS ----------

top_categories = []

if not expenses_df.empty:

    category_spend = expenses_df.groupby("category")["amount"].sum()

    top_categories = category_spend.sort_values(ascending=False).head(2).index.tolist()

# ---------- SMART SUGGESTIONS ----------

suggestion = "Your financial habits look stable."

if total_income > 0:

    ratio = total_expense / total_income

    if ratio > 0.8:
        suggestion = "You are spending too much compared to your income. Try reducing unnecessary expenses."
    elif trend == "increasing":
        suggestion = "Your expenses are increasing over time. Monitor your spending closely."
    elif trend == "decreasing":
        suggestion = "Great! Your spending is reducing over time."
    else:
        suggestion = "Your finances are balanced. Keep it up!"

# ---------- FINAL RESULT ----------

result = {
    "predictedExpense": round(float(predicted_expense), 2),
    "trend": trend,
    "topCategories": top_categories,
    "suggestion": suggestion
}

print(json.dumps(result))