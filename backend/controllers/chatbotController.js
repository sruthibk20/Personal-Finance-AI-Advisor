const Expense = require("../models/Expense");
const Income = require("../models/Income");
const Groq = require("groq-sdk");

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const formatCurrency = (value) => `₹${Number(value || 0).toFixed(0)}`;

const buildBudgetStyleReply = ({
  totalIncome,
  totalExpense,
  balance,
  savingsRate,
  highestCategory,
  highestAmount
}) => {
  let reply = `Here is your current financial snapshot:\n`;
  reply += `Income: ${formatCurrency(totalIncome)}\n`;
  reply += `Expense: ${formatCurrency(totalExpense)}\n`;
  reply += `Balance: ${formatCurrency(balance)}\n`;
  reply += `Savings Rate: ${savingsRate}%`;

  if (highestCategory !== "none") {
    reply += `\nYour highest spending category is ${highestCategory} (${formatCurrency(highestAmount)}).`;
  }

  return reply;
};

const chat = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!message) {
      return res.json({ reply: "Please ask a question about your finances." });
    }

    if (!userId) {
      return res.json({ reply: "I could not find your account details. Please log in again." });
    }

    const msg = message.toLowerCase().trim();

    const expenses = await Expense.find({ userId });
    const incomes = await Income.find({ userId });

    const totalExpense = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    const totalIncome = incomes.reduce((sum, income) => sum + Number(income.amount || 0), 0);
    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0
      ? Math.round((balance / totalIncome) * 100)
      : 0;

    const categoryMap = {};

    expenses.forEach((expense) => {
      const category = (expense.category || "Other").trim();
      categoryMap[category] = (categoryMap[category] || 0) + Number(expense.amount || 0);
    });

    let highestCategory = "none";
    let highestAmount = 0;

    Object.keys(categoryMap).forEach((category) => {
      if (categoryMap[category] > highestAmount) {
        highestAmount = categoryMap[category];
        highestCategory = category;
      }
    });

    if (/^hi$|^hello$|^hey$/.test(msg)) {
      return res.json({
        reply: "Hello! I can help you understand your income, expenses, savings, balance, and spending patterns."
      });
    }

    if (/summary|overview|snapshot|financial status/.test(msg)) {
      return res.json({
        reply: buildBudgetStyleReply({
          totalIncome,
          totalExpense,
          balance,
          savingsRate,
          highestCategory,
          highestAmount
        })
      });
    }

    if (/most|highest|where.*spend|spend.*most|top category/.test(msg)) {
      return res.json({
        reply: highestCategory === "none"
          ? "I could not find enough expense data to identify a top spending category yet."
          : `You are spending the most on ${highestCategory}, with a total of ${formatCurrency(highestAmount)}.`
      });
    }

    if (/income|earn|salary/.test(msg)) {
      return res.json({
        reply: `Your total recorded income is ${formatCurrency(totalIncome)}.`
      });
    }

    if (/expense|spend|spent/.test(msg)) {
      return res.json({
        reply: `Your total recorded spending is ${formatCurrency(totalExpense)}.`
      });
    }

    if (/balance|left|remaining/.test(msg)) {
      return res.json({
        reply: `Your current balance after expenses is ${formatCurrency(balance)}.`
      });
    }

    if (/saving|savings/.test(msg)) {
      return res.json({
        reply: `Your current savings rate is ${savingsRate}%.`
      });
    }

    if (/financially healthy|financial health|how am i doing/.test(msg)) {
      if (savingsRate >= 50) {
        return res.json({
          reply: "Your financial position looks strong right now. Your savings rate is excellent and your balance is healthy."
        });
      }

      if (savingsRate >= 20) {
        return res.json({
          reply: "Your finances look fairly stable, but there is room to improve your savings rate further."
        });
      }

      return res.json({
        reply: "Your savings rate is currently low. Reducing discretionary spending and improving monthly savings would strengthen your financial health."
      });
    }

    if (/save more|improve finances|financial advice|reduce spending|how can i improve/.test(msg)) {
      let advice = `Your savings rate is ${savingsRate}%. `;

      if (savingsRate < 20) {
        advice += "You should focus on cutting non-essential expenses and increasing monthly savings.";
      } else if (savingsRate < 50) {
        advice += "You are doing reasonably well, but tightening a few spending categories could improve your savings.";
      } else {
        advice += "You already have a strong savings habit. Staying consistent will help maintain a healthy financial position.";
      }

      if (highestCategory !== "none") {
        advice += ` Your largest spending category is ${highestCategory} at ${formatCurrency(highestAmount)}, which is the best place to review first.`;
      }

      return res.json({ reply: advice });
    }

    try {
      const context = `
You are a professional personal finance assistant for a budgeting dashboard.
Use only the provided user financial data.
Do not invent numbers.
Keep the answer concise, practical, and easy to understand.

Financial data:
- Total income: ${totalIncome}
- Total expense: ${totalExpense}
- Balance: ${balance}
- Savings rate: ${savingsRate}%
- Highest spending category: ${highestCategory}
- Highest spending amount: ${highestAmount}
- Category breakdown: ${JSON.stringify(categoryMap)}

User question:
${message}
`;

      const aiResponse = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: "You are a professional and careful personal finance advisor."
          },
          {
            role: "user",
            content: context
          }
        ]
      });

      return res.json({
        reply: aiResponse.choices[0].message.content
      });

    } catch (err) {
      return res.json({
        reply: buildBudgetStyleReply({
          totalIncome,
          totalExpense,
          balance,
          savingsRate,
          highestCategory,
          highestAmount
        })
      });
    }

  } catch (error) {
    console.error("Chatbot error:", error);

    return res.json({
      reply: "Something went wrong while processing your request."
    });
  }
};

module.exports = { chat };
console.log("GROQ KEY:", process.env.GROQ_API_KEY);