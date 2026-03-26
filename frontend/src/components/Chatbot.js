import { useEffect, useRef, useState } from "react";

function Chatbot() {

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I can help explain your spending, savings, balance, and budget position."
    }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput || sending) return;

    const userMessage = { sender: "user", text: trimmedInput };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.userId,
          message: trimmedInput
        })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "I could not generate a response right now."
        }
      ]);

    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I ran into an issue while checking your financial data. Please try again."
        }
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div>
              <p className="chatbot-eyebrow">Finance Assistant</p>
              <h4 className="chatbot-title">AI Chat Support</h4>
            </div>

            <button
              className="chatbot-close"
              type="button"
              onClick={() => setOpen(false)}
            >
              x
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chatbot-bubble chatbot-bubble-${message.sender}`}
              >
                {message.text}
              </div>
            ))}

            {sending && (
              <div className="chatbot-bubble chatbot-bubble-bot">
                Thinking...
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          <div className="chatbot-input-row">
            <textarea
              className="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your spending, savings, income, or balance..."
              rows={2}
            />

            <button
              className="chatbot-send"
              type="button"
              onClick={sendMessage}
              disabled={sending}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {!open && (
        <div className="chatbot-help-text">
          Ask FinanceAI
        </div>
      )}

      <button
        type="button"
        className="chatbot-toggle"
        onClick={() => setOpen((prev) => !prev)}
      >
        Chat
      </button>
    </>
  );
}

export default Chatbot;
