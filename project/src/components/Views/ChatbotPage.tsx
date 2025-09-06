import React from "react";

const ChatbotPage = () => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        src="https://resqfood-chatbot-yourid.vercel.app" // <-- replace with your chatbot URL
        style={{ width: "100%", height: "100%", border: "none" }}
        title="ResQFood Chatbot"
      />
    </div>
  );
};

export default ChatbotPage;
