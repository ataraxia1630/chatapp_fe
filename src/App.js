import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function App() {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Hiển thị prompt để lấy tên người dùng
    const name = prompt('Tên bạn là gì?');
    setUsername(name);

    // Lắng nghe sự kiện broadMess từ server
    const handleMessage = (message) => {
      setMessages((prev) => [
        ...prev,
        { username: message.username, content: message.content },
      ]);
    };
    socket.on('broadMess', handleMessage);

    // Cleanup listener khi component unmount
    return () => {
      socket.off('broadMess', handleMessage);
    };
  }, []); // Dependency rỗng để chỉ chạy khi component mount lần đầu

  const sendMess = () => {
    if (input.trim()) {
      // Gửi tin nhắn với username và content
      socket.emit('sendMess', { username, content: input });
      setInput(''); // Xóa nội dung input sau khi gửi
    }
  };

  return (
    <div>
      <h1>Ghé chat vui nào</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.username}:</strong> {msg.content}
          </li>
        ))}
      </ul>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMess}>Send</button>
    </div>
  );
}
