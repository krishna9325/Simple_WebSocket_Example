import { useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "./css/chat.css";

let stompClient = null;

function ChatRoom() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("public");
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const isButtonEnabled = username !== "" && room !== "";

  const connect = () => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        stompClient.subscribe(`/topic/public`, (msg) => {
          console.log("Raw message from server:", msg.body);
          try {
            const message = JSON.parse(msg.body);
            console.log("Parsed message:", message);
            setMessages((prev) => [...prev, message]);
          } catch (e) {
            console.error("Invalid JSON:", msg.body);
          }
        });

        stompClient.publish({
          destination: "/app/chat.addUser",
          body: JSON.stringify({ sender: username, type: "JOIN", room }),
        });

        setConnected(true);
      },
    });
    stompClient.activate();
  };

  const sendMessage = () => {
    if (stompClient && input.trim()) {
      stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify({
          sender: username,
          content: input,
          type: "CHAT",
          room,
        }),
      });
      setInput("");
    }
  };

  const leaveRoom = () => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify({ sender: username, type: "LEAVE", room }),
      });
      stompClient.deactivate();
    }
    setConnected(false);
    setMessages([]);
    setUsername("");
    setRoom("public");
  };

  return (
    <div className="chat-container">
      {!connected ? (
        <div className="join-box">
          <h2>Join a Chat Room</h2>
          <input
            type="text"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={connect} disabled={!isButtonEnabled}>
            Join Room
          </button>
        </div>
      ) : (
        <div className="chat-box">
          <div className="chat-header">
            <h3>Room: {room}</h3>
            <button onClick={leaveRoom}>Leave</button>
          </div>

          <div className="messages">
            {messages.map((msg, i) => (
              <div key={i} className="message">
                {msg.type === "JOIN" && (
                  <p className="system">{msg.sender} joined the chat</p>
                )}
                {msg.type === "LEAVE" && (
                  <p className="system">{msg.sender} left the chat</p>
                )}
                {msg.type === "CHAT" && (
                  <div
                    className={
                      msg.sender === username ? "msg you" : "msg other"
                    }
                  >
                    {msg.sender !== username && <strong>{msg.sender}</strong>}
                    <p>{msg.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatRoom;
