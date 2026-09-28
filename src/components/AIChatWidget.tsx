'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col mt-3 overflow-hidden">
          <div className="bg-black text-white p-4 font-bold flex justify-between items-center">
            <span>AI Store Assistant</span>
            <span className="text-[10px] bg-green-500 text-black px-2 py-0.5 rounded-full uppercase tracking-widest font-extrabold">Free AI</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
            {messages.length === 0 && (
              <p className="text-gray-400 text-center text-xs mt-12">
                Ask me: "Do you have any chairs?" or "Show tables under $300"
              </p>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-xl max-w-[85%] ${
                  m.role === 'user'
                    ? 'bg-black text-white ml-auto text-right'
                    : 'bg-gray-100 text-gray-800 mr-auto text-left'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
              </div>
            ))}

            {isLoading && (
              <div className="text-gray-400 text-xs italic">AI is searching db.json...</div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 flex gap-2 bg-gray-50">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about store products..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
