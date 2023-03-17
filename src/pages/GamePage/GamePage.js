import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function GamePage({ socketRef }) {
  const { roomId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socketRef.current.emit('joinRoom', roomId); // Join the room with roomId
    socketRef.current.on('newMessage', (message) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socketRef.current.off('newMessage');
    };
  }, [socketRef, roomId]); // Include roomId as a dependency

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      socketRef.current.emit('sendMessage', roomId, message);
      setMessage('');
    }
  };

  const handleLeaveRoom = () => {
    //redirect to home directory
    window.location.href = '/';
    socketRef.current.emit('leaveRoom', roomId);
  }

  return (
    <div>
      <h1>Game Page</h1>
      <p>Welcome to Room {roomId}!</p>
        <div>
          <h2>Room: {roomId}</h2>
          <ul>
            {messages.map((m, index) => (
              <li key={index}>
                <strong>{m.username}:</strong> {m.text}
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
          <button onClick={handleLeaveRoom}>Leave Room</button>
        </div>
    </div>
  );
}

export default GamePage;