import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import MessageActions from './MessageActions';
import MarkdownMessage from './MarkdownMessage';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (query: string) => void;
  isProcessing: boolean;
  onClearHistory?: () => void;
  conversationCount?: number;
}

const SUGGESTION_CHIPS = [
  "Summarize challenges, needs and thoughts",
  "List 3 key challenges expressed",
  "What are the main themes?",
  "Identify actionable insights"
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  isProcessing,
  onClearHistory,
  conversationCount = 0
}) => {
  const [input, setInput] = useState('');
  const [availableSuggestions, setAvailableSuggestions] = useState<string[]>(SUGGESTION_CHIPS);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Reset suggestions when messages are cleared
    if (messages.length === 0) {
      setAvailableSuggestions(SUGGESTION_CHIPS);
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Remove the clicked suggestion from available suggestions
    setAvailableSuggestions(prev => prev.filter(s => s !== suggestion));
    // Send the message
    onSendMessage(suggestion);
  };

  const handleClearHistoryClick = () => {
    if (onClearHistory) {
      onClearHistory();
      // Reset suggestions
      setAvailableSuggestions(SUGGESTION_CHIPS);
    }
  };

  return (
    <div className="chat-interface">
      {messages.length > 0 && (
        <div className="chat-header">
          <div className="conversation-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" 
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{conversationCount} of 5 conversations remembered</span>
          </div>
          <button 
            className="clear-history-btn"
            onClick={handleClearHistoryClick}
            title="Clear conversation history"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" 
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Clear History
          </button>
        </div>
      )}
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="empty-title">Start Your Research Inquiry</p>
            <p className="empty-description">
              Ask questions about your uploaded documents and get insights
            </p>
            <p className="empty-hint">
              💡 I'll remember your last 5 conversations for follow-up questions
            </p>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.role}`}
              >
                <div className="message-content">
                  {message.role === 'assistant' ? (
                    <MarkdownMessage content={message.content} />
                  ) : (
                    message.content
                  )}
                </div>
                {message.role === 'assistant' && (
                  <MessageActions content={message.content} />
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="message assistant">
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="input-container">
        {availableSuggestions.length > 0 && !isProcessing && (
          <div className="suggestion-chips">
            {availableSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                className="suggestion-chip"
                onClick={() => handleSuggestionClick(suggestion)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" 
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <form className="input-form" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            className="message-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your research documents..."
            disabled={isProcessing}
            rows={1}
          />
          <button 
            type="submit" 
            className="send-btn"
            disabled={!input.trim() || isProcessing}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" 
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
