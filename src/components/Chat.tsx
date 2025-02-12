import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import { useMessageStore } from '../store/messageStore';
import toast from 'react-hot-toast';

export default function Chat() {
  const { user } = useAuthStore();
  const { messages, fetchMessages, addMessage } = useMessageStore();
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages().catch(() => {
      toast.error('Failed to load messages');
    });
    const interval = setInterval(fetchMessages, 3000); // Poll for new messages
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      await addMessage(newMessage.trim(), user.id);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] bg-white rounded-lg shadow-sm">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.sender_id === user?.id ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                {message.username[0].toUpperCase()}
              </div>
            </div>
            <div
              className={`flex flex-col ${
                message.sender_id === user?.id ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  {message.username}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                </span>
              </div>
              <div
                className={`mt-1 px-4 py-2 rounded-lg ${
                  message.sender_id === user?.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t p-4">
        <form onSubmit={sendMessage} className="flex space-x-4">
          <button
            type="button"
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-500"
          >
            <Plus className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300"
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}