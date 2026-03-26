import sys
import json
import pandas as pd
from pymongo import MongoClient
from sklearn.linear_model import LinearRegression
from bson import ObjectId
import numpy as np

# get userId from node
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

# ---------- MACHINE LEARNING ----------

if not expenses_df.empty:

    expenses_df["date"] = pd.to_datetime(expenses_df["date"])

    # group by month
    expenses_df["month"] = expenses_df["date"].dt.to_period("M")

    monthly = expenses_df.groupby("month")["amount"].sum().reset_index()

    monthly["month_index"] = range(len(monthly))

    X = monthly[["month_index"]]
    y = monthly["amount"]

    model = LinearRegression()
    model.fit(X, y)

    next_month = [[len(monthly)]]

    predicted_expense = model.predict(next_month)[0]

# ---------- CATEGORY ANALYSIS ----------

overspending_message = "Spending looks balanced."

if not expenses_df.empty:

    category_spend = expenses_df.groupby("category")["amount"].sum()

    max_category = category_spend.idxmax()

    overspending_message = f"You spend the most on {max_category}."

# ---------- SAVING SUGGESTION ----------

saving_suggestion = "Good financial balance."

if total_income > 0:

    ratio = total_expense / total_income

    if ratio > 0.8:
        saving_suggestion = "Your expenses are very high compared to income."
    elif ratio > 0.6:
        saving_suggestion = "Try to increase savings if possible."
    else:
        saving_suggestion = "Great! You are maintaining healthy savings."

# ---------- RESULT ----------

result = {
    "predictedExpense": round(float(predicted_expense), 2),
    "overspendingMessage": overspending_message,
    "savingSuggestion": saving_suggestion
}

print(json.dumps(result))