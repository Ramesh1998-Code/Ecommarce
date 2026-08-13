import { GoogleGenAI } from "@google/genai";
import { useState } from "react";
 const keys = process.env.REACT_APP_GEMINI_API_KEY


const ai = new GoogleGenAI({
  apiKey: keys
});


export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: input,
      });
      const botReply = { role: "bot", text: response.text };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", text: "Error: " + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
   
     <div className="chat-bot-wrap">
        {
            !isOpen &&   <button className="chat-fab" onClick={() => setIsOpen((prev) => !prev)}>
          <svg  viewBox="0 0 24 24" width="26" height="26" fill="none">
            <path
              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

      </button>
        }
       
      {isOpen && (
        <div  className={`chat-container ${isOpen ? "open" : ""}`} >
          <div className="chat-header">
           <div className="d-flex align-items-center gap-2">
             <div className="status-dot"></div>
            <h3>Tmarket Assistant</h3>
           </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="messages-box">
            {messages.map((m, i) => (
              <div key={i} className={`message-bubble ${m.role === "user" ? "user" : "bot"}`}>
                <span className="sender">{m.role === "user" ? "You" : "Tmarket"}</span>
                <p className="message-text">{m.text}</p>
              </div>
            ))}
            {loading && (
              <div className="typing-indicator">
                <span>Tmarket is typing</span>
                <div className="dots">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}
          </div>

          <div className="input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}

     </div>
    </>
  );
}