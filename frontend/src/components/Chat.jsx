import React, { useState, useEffect } from "react";
import styles from "../styles/chat.module.scss";
import io from "socket.io-client";

import { RiMessage3Fill } from "react-icons/ri";

const socket = io("http://localhost:3000"); // URL del servidor de socket

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Manejar mensajes recibidos del servidor
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, { content: message, sender: "bot" }]);
    });

    return () => {
      socket.off("message");
    };
  }, [messages]);

  // Enviar mensaje al servidor
  const sendMessage = async () => {
    if (input.trim() === "") return;

    setMessages([...messages, { content: input, sender: "user" }]);
    setInput("");

    // Enviar mensaje al servidor Express
    socket.emit("message", input);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <img src="/logo.svg" alt="" />
        <h1>Assistant</h1>
      </div>
      <div className={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div
            className={`${styles.message} ${
              msg.sender === "user" ? styles.userMessage : styles.botMessage
            }`}
            key={index}
          >
            <p className={styles.sender}>
              {msg.sender === "user" ? "You" : "BudgetBrain Assistant"}
            </p>
            <p className={styles.content}>{msg.content}</p>
            <span></span>
          </div>
        ))}
      </div>
      <div className={styles.input}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>
          <RiMessage3Fill size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
