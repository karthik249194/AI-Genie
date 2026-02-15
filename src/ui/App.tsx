import React, { useState, useEffect, useRef } from 'react';
import { UploadedFile, ChatMessage, Theme } from '../types';
import { processFile, validateFileType, formatFileSize } from '../lib/fileProcessing';
import { groqService } from '../lib/groqService';
import FileUpload from './FileUpload';
import ChatInterface from './ChatInterface';
import './App.css';

function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isChatMode, setIsChatMode] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Listen for theme changes from Figma
    window.onmessage = (event) => {
      if (event.data.pluginMessage?.type === 'theme-changed') {
        setTheme(event.data.pluginMessage.theme);
      }
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleFilesAdded = async (newFiles: File[]) => {
    const processedFiles: UploadedFile[] = [];
    
    for (const file of newFiles) {
      if (!validateFileType(file)) {
        alert(`Invalid file format: ${file.name}`);
        continue;
      }
      
      try {
        const content = await processFile(file);
        processedFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          content,
          uploadedAt: new Date()
        });
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Unable to process file');
      }
    }
    
    setFiles(prev => [...prev, ...processedFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleContinue = () => {
    if (files.length === 0) {
      alert('Please upload at least one document');
      return;
    }
    
    // Set document context for Groq
    groqService.setDocumentContext(files.map(f => `Document: ${f.name}\n\n${f.content}`));
    setIsChatMode(true);
  };

  const handleSendMessage = async (query: string) => {
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: query,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    try {
      const response = await groqService.queryDocuments(query);
      
      const assistantMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: 'An error occurred while processing your query. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearHistory = () => {
    groqService.clearHistory();
    setMessages([]);
    // Suggestions will automatically show when messages.length === 0
  };

  const conversationCount = groqService.getConversationCount();

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Research Insights</h1>
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>
      
      <div className={`app-content ${isChatMode ? 'chat-mode' : ''}`}>
        <div className="upload-section">
          <FileUpload 
            files={files}
            onFilesAdded={handleFilesAdded}
            onRemoveFile={handleRemoveFile}
            disabled={isChatMode}
          />
          
          {!isChatMode && files.length > 0 && (
            <button 
              className="continue-btn"
              onClick={handleContinue}
            >
              Continue
            </button>
          )}
        </div>
        
        {isChatMode && (
          <div className="chat-section">
            <ChatInterface 
              messages={messages}
              onSendMessage={handleSendMessage}
              isProcessing={isProcessing}
              onClearHistory={handleClearHistory}
              conversationCount={conversationCount}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
