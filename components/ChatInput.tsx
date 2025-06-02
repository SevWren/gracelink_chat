import React, { useState, useRef, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, placeholder }) => {
  const [input, setInput] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'; // Reset height
      const scrollHeight = textAreaRef.current.scrollHeight;
      const maxHeight = 128; // approx 4 lines before scroll, adjust as needed (120 -> 128 for 32px line height)
      textAreaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      if (textAreaRef.current) {
         textAreaRef.current.style.height = 'auto'; // Reset height after send
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const showSendIcon = input.trim() !== '';

  return (
    <form onSubmit={handleSubmit} className="px-4 py-3 bg-slate-800 flex items-end space-x-3">
      {/* Placeholder Attachment Icon */}
      <button type="button" className="p-2 text-slate-400 hover:text-blue-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors" aria-label="Attach file (feature coming soon)" title="Attach file (feature coming soon)">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
        </svg>
      </button>
       {/* Placeholder Mic Icon */}
      <button type="button" className="p-2 text-slate-400 hover:text-blue-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors" aria-label="Use microphone (feature coming soon)" title="Use microphone (feature coming soon)">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5h0M6.375 12.375A6.375 6.375 0 1112.75 12.375m0-8.25V5.625M12 12.375v3.75m0-3.75A3.375 3.375 0 0115.375 9V5.625A6.375 6.375 0 006.375 9v3.375c0 .621.504 1.125 1.125 1.125H9.75" />
        </svg>
      </button>

      <textarea
        ref={textAreaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Type your message..."}
        aria-label={placeholder || "Chat input"}
        className="flex-grow p-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-150 ease-in-out min-h-[48px] max-h-32 overflow-y-auto placeholder-slate-400"
        rows={1}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        aria-label={isLoading ? "Sending message" : (showSendIcon ? "Send message" : "Input is empty")}
        className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out flex items-center justify-center h-[48px] w-[48px]"
      >
        {isLoading ? <LoadingSpinner /> : (
          showSendIcon ? (
            // Send Icon (Paper Plane)
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transform rotate-0">
              <path d="M3.105 3.105a1.5 1.5 0 012.122-.001l11.503 7.481a1.5 1.5 0 010 2.83L5.227 16.9a1.5 1.5 0 01-2.122-2.121L12.26 10 3.105 5.227a1.5 1.5 0 010-2.122z"></path>
            </svg>
          ) : (
            // X Icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )
        )}
      </button>
    </form>
  );
};

export default ChatInput;