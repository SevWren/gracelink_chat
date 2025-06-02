
import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender } from './types';
import ChatMessageItem from './components/ChatMessageItem';
import ChatInput from './components/ChatInput';
import { getGeminiResponse, initializeGeminiClient } from './services/geminiService';

const App: React.FC = () => {
  const initialAiMessageText = "Welcome! To get started, please enter your Gemini API Key and press send.";
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [_apiKey, setApiKey] = useState<string | null>(null);
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState<boolean>(true); // State for sidebar visibility

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    setMessages([
      {
        id: 'initial-ai-prompt-key',
        text: initialAiMessageText,
        sender: Sender.AI,
        timestamp: new Date(),
      }
    ]);
  }, []);

  const handleClearChat = () => {
    setError(null);
    if (isApiKeySet) {
      setMessages([
        {
          id: `ai-cleared-${Date.now()}`,
          text: "Chat cleared. How can I help you now?",
          sender: Sender.AI,
          timestamp: new Date(),
        }
      ]);
    } else {
      // If API key is not set, reset to the initial prompt
      setMessages([
        {
          id: 'initial-ai-prompt-key-cleared',
          text: initialAiMessageText,
          sender: Sender.AI,
          timestamp: new Date(),
        }
      ]);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: Sender.User,
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    if (!isApiKeySet) {
      const apiKeyToSet = text;
      const initialized = initializeGeminiClient(apiKeyToSet);
      let aiResponseMessage: Message;

      if (initialized) {
        setApiKey(apiKeyToSet);
        setIsApiKeySet(true);
        aiResponseMessage = {
          id: `ai-key-confirm-${Date.now()}`,
          text: "Thank you! Your API Key has been set. How can I help you today?",
          sender: Sender.AI,
          timestamp: new Date(),
        };
      } else {
        aiResponseMessage = {
          id: `ai-key-error-${Date.now()}`,
          text: "Invalid API Key or failed to initialize. Please check your key (it should not be empty) and try again.",
          sender: Sender.AI,
          timestamp: new Date(),
        };
      }
      setMessages(prevMessages => [...prevMessages, aiResponseMessage]);
      setIsLoading(false);
    } else {
      try {
        const aiResponseText = await getGeminiResponse(text);
        const newAiMessage: Message = {
          id: `ai-response-${Date.now()}`,
          text: aiResponseText,
          sender: Sender.AI,
          timestamp: new Date(),
        };
        setMessages(prevMessages => [...prevMessages, newAiMessage]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed to get response from AI: ${errorMessage}`);
        const errorAiMessage: Message = {
          id: `error-ai-response-${Date.now()}`,
          text: `Sorry, I encountered an error: ${errorMessage}`,
          sender: Sender.AI,
          timestamp: new Date(),
        };
        setMessages(prevMessages => [...prevMessages, errorAiMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen"> {/* Outermost container for top bar + main content */}
      {/* Top Bar */}
      <div style={{ backgroundColor: '#1C2333', height: '20px' }} className="w-full shrink-0"></div>
      
      {/* Main Content Area */}
      <div className="flex flex-grow overflow-hidden bg-slate-900 text-slate-100">
        {/* Left Column: Empty Branding Strip */}
        <div className="w-[5px] bg-[#1C2333] p-0 shadow-lg shrink-0">
          {/* Empty */}
        </div>

        {/* Center Column: Chat Interaction */}
        <div className="flex-grow flex flex-col overflow-hidden relative"> {/* Added relative positioning for the toggle button */}
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setIsRightSidebarVisible(!isRightSidebarVisible)}
            className="absolute top-3 right-3 z-20 p-2 bg-slate-700 hover:bg-slate-600 rounded-full text-slate-300 hover:text-slate-100 transition-colors"
            aria-label={isRightSidebarVisible ? "Hide chat details" : "Show chat details"}
            title={isRightSidebarVisible ? "Hide chat details" : "Show chat details"}
          >
            {isRightSidebarVisible ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
              </svg>
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-700 text-red-100 border-b border-red-600 text-sm" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}

          <main className="flex-grow p-6 overflow-y-auto space-y-6 bg-slate-900">
            {messages.map(msg => (
              <ChatMessageItem key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </main>

          <div className="bg-slate-800 px-2 pt-2 pb-1 border-t border-slate-700">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder={
                isApiKeySet
                  ? "Type your message to Gemini..."
                  : "Enter your Gemini API Key here..."
              }
            />
          </div>
        </div>

        {/* Right Column: History Sidebar */}
        <div 
          className={`bg-slate-800 flex flex-col shadow-lg border-l border-slate-700 transition-all duration-300 ease-in-out overflow-hidden shrink-0 ${
            isRightSidebarVisible ? 'w-72 p-6' : 'w-0 p-0'
          }`}
        >
          {isRightSidebarVisible && ( // Conditionally render content
            <>
              <h2 className="text-xl font-semibold text-blue-400 mb-4 whitespace-nowrap">Chat Details</h2>
              <div className="space-y-3 text-sm text-slate-300 mb-6 whitespace-nowrap">
                <p>Messages: <span className="font-medium text-slate-100">{messages.length}</span></p>
                <p>API Key Status: {isApiKeySet ? 
                  <span className="text-green-400 font-medium">Set</span> : 
                  <span className="text-yellow-400 font-medium">Not Set</span>}
                </p>
              </div>
              
              <button
                onClick={handleClearChat}
                aria-label="Clear current chat messages"
                className="w-full mt-auto px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out flex items-center justify-center text-sm font-medium whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0L12 14.25m2.25-2.25L14.25 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Clear Chat
              </button>
              <div className="mt-4 text-xs text-slate-500 text-center whitespace-nowrap">
                History functionality coming soon.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
