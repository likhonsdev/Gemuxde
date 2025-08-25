"use client";

import { useState, useEffect, useRef, FormEvent } from 'react';

interface Message {
  author: 'You' | 'AI' | 'System';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const ws = useRef<WebSocket | null>(null);
  const expectingAIResponse = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // Initialize WebSocket connection
    ws.current = new WebSocket('ws://localhost:8000/ws');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setMessages((prev) => [...prev, { author: 'System', content: 'Connected to Gemuxde AI.' }]);
    };

    ws.current.onmessage = (event) => {
      if (expectingAIResponse.current) {
        // This is the first token of a new AI response
        setMessages((prev) => [...prev, { author: 'AI', content: event.data }]);
        expectingAIResponse.current = false;
      } else {
        // This is a subsequent token, append it to the last AI message
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.author === 'AI') {
            lastMessage.content += event.data;
          }
          return newMessages;
        });
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setMessages((prev) => [...prev, { author: 'System', content: 'Disconnected. Please refresh to reconnect.' }]);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setMessages((prev) => [...prev, { author: 'System', content: 'Connection error.' }]);
    };

    // Cleanup on component unmount
    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && ws.current?.readyState === WebSocket.OPEN) {
      setMessages((prev) => [...prev, { author: 'You', content: input }]);
      ws.current.send(input);
      expectingAIResponse.current = true; // Flag that we're waiting for the AI's response
      setInput('');
    }
  };

  const getAuthorStyle = (author: Message['author']): React.CSSProperties => {
    switch (author) {
      case 'You':
        return { fontWeight: 'bold', color: '#0070f3' };
      case 'AI':
        return { fontWeight: 'bold', color: '#f5a623' };
      default:
        return { fontStyle: 'italic', color: '#888' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '700px', margin: '0 auto', padding: '16px', boxSizing: 'border-box' }}>
      <h1 style={{ textAlign: 'center' }}>💎 Gemuxde AI</h1>
      <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '12px' }}>
            <strong style={getAuthorStyle(msg.author)}>{msg.author}:</strong>
            <span style={{ whiteSpace: 'pre-wrap' }}> {msg.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Gemuxde anything..."
          style={{ flex: 1, padding: '12px', borderRadius: '8px 0 0 8px', border: '1px solid #ccc', borderRight: 'none' }}
        />
        <button type="submit" style={{ padding: '12px 20px', borderRadius: '0 8px 8px 0', border: '1px solid #0070f3', backgroundColor: '#0070f3', color: 'white', cursor: 'pointer' }}>
          Send
        </button>
      </form>
    </div>
  );
}
