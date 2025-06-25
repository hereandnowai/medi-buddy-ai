import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Copy, CheckCircle, AlertTriangle } from './icons';
import { ChatMessage } from '../types';
import { ChatRole, BRAND_CONFIG, GEMINI_API_KEY_INFO } from '../constants';
import { generateChatResponse, isGeminiAvailable, startChat, getHealthInformation } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);
  const [chatMode, setChatMode] = useState<'chat' | 'faq'>('chat');


  useEffect(() => {
    if (!GEMINI_API_KEY_INFO) {
      setIsApiKeyMissing(true);
      setError("Gemini API Key is not configured. Please set the API_KEY environment variable to use the chat features.");
    } else {
       setIsApiKeyMissing(false);
       if (isGeminiAvailable()) {
        startChat(); // Initialize chat session
         setMessages([{
          id: 'initial-system-message',
          role: ChatRole.MODEL,
          text: "Hello! I'm MediBuddy, your virtual health assistant from HERE AND NOW AI. How can I help you today? Remember, I'm here for general information and support, not medical advice. For medical concerns, please consult a doctor.",
          timestamp: Date.now()
        }]);
       } else {
         setError("AI assistant failed to initialize.");
       }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (e.target.value) {
        // Auto-resize textarea
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    } else {
        e.target.style.height = 'auto'; // Reset to default if empty
    }
  };

  const handleSubmit = useCallback(async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || isApiKeyMissing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      role: ChatRole.USER,
      text: input.trim(),
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    // Reset textarea height after send
    const textarea = document.getElementById('chat-input-textarea') as HTMLTextAreaElement;
    if (textarea) textarea.style.height = 'auto';

    try {
      let responseText: string;
      if (chatMode === 'chat') {
        responseText = await generateChatResponse(userMessage.text, [...messages, userMessage]);
      } else { // faq mode
        responseText = await getHealthInformation(userMessage.text);
      }
      
      const modelMessage: ChatMessage = {
        id: Date.now().toString() + '-model',
        role: ChatRole.MODEL,
        text: responseText,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (apiError: any) {
      console.error("API Error:", apiError);
      setError(apiError.message || "Failed to get response from AI assistant.");
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        role: ChatRole.SYSTEM,
        text: apiError.message || "Sorry, I couldn't process that. Please try again.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, isLoading, messages, isApiKeyMissing, chatMode]); // Removed 'history' which was not defined

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-lg shadow-xl overflow-hidden border-2" style={{borderColor: BRAND_CONFIG.brand.colors.secondary}}>
      <div 
        className="p-3 border-b flex justify-between items-center"
        style={{backgroundColor: BRAND_CONFIG.brand.colors.secondary, borderColor: BRAND_CONFIG.brand.colors.primary}}
      >
        <h2 className="text-lg font-semibold" style={{color: BRAND_CONFIG.brand.colors.primary}}>
          {chatMode === 'chat' ? 'Virtual Chat Assistant' : 'Health Information Q&A'}
        </h2>
        <div className="flex space-x-2">
            <button
                onClick={() => setChatMode('chat')}
                className={`px-3 py-1 text-sm rounded ${chatMode === 'chat' ? `bg-[${BRAND_CONFIG.brand.colors.primary}] text-[${BRAND_CONFIG.brand.colors.secondary}]` : `bg-white text-[${BRAND_CONFIG.brand.colors.secondary}] hover:bg-gray-200`}`}
            >
                Chat
            </button>
            <button
                onClick={() => setChatMode('faq')}
                className={`px-3 py-1 text-sm rounded ${chatMode === 'faq' ? `bg-[${BRAND_CONFIG.brand.colors.primary}] text-[${BRAND_CONFIG.brand.colors.secondary}]` : `bg-white text-[${BRAND_CONFIG.brand.colors.secondary}] hover:bg-gray-200`}`}
            >
                Health Q&A
            </button>
        </div>
      </div>

      {isApiKeyMissing && (
        <div className="p-4 bg-red-100 text-red-700 border-b border-red-300 flex items-center">
          <AlertTriangle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === ChatRole.USER ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl p-0.5 rounded-lg shadow ${msg.role === ChatRole.USER ? `bg-[${BRAND_CONFIG.brand.colors.primary}]` : 'bg-gray-200'}`}>
              <div className={`flex items-start p-3 rounded-md ${msg.role === ChatRole.USER ? `text-[${BRAND_CONFIG.brand.colors.secondary}]` : `text-[${BRAND_CONFIG.brand.colors.secondary}]`} ${msg.role === ChatRole.MODEL ? 'bg-white': ''} ${msg.role === ChatRole.SYSTEM ? 'bg-red-100 text-red-700':''}`}>
                {msg.role === ChatRole.MODEL && (
                  <img src={BRAND_CONFIG.brand.chatbot.avatar} alt="Chatbot Avatar" className="w-8 h-8 rounded-full mr-2 self-start"/>
                )}
                 {msg.role === ChatRole.SYSTEM && (
                  <AlertTriangle size={20} className="mr-2 self-start text-red-700" />
                )}
                <div className="flex-1 whitespace-pre-wrap break-words">{msg.text}</div>
                {msg.role !== ChatRole.USER && msg.role !== ChatRole.SYSTEM && (
                  <button onClick={() => handleCopy(msg.text, msg.id)} className="ml-2 p-1 text-gray-500 hover:text-gray-700 self-start">
                    {copiedId === msg.id ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="max-w-xl p-3 rounded-lg shadow bg-gray-200 flex items-center">
                <img src={BRAND_CONFIG.brand.chatbot.avatar} alt="Chatbot Avatar" className="w-8 h-8 rounded-full mr-2"/>
                <LoadingSpinner size="sm" />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="p-3 border-t flex items-end space-x-2"
        style={{borderColor: BRAND_CONFIG.brand.colors.primary}}
      >
        <textarea
          id="chat-input-textarea"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={isApiKeyMissing ? "API Key not configured" : (chatMode === 'chat' ? "Type your message..." : "Ask a health question...")}
          className={`flex-1 p-2 border rounded-lg resize-none overflow-y-hidden focus:ring-2 focus:outline-none max-h-32 focus:ring-[${BRAND_CONFIG.brand.colors.primary}]`}
          style={{borderColor: BRAND_CONFIG.brand.colors.secondary}}
          rows={1}
          disabled={isLoading || isApiKeyMissing}
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim() || isApiKeyMissing} 
          className="p-2 rounded-lg disabled:opacity-50"
          style={{backgroundColor: BRAND_CONFIG.brand.colors.secondary, color: BRAND_CONFIG.brand.colors.primary}}
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};

export default ChatAssistant;