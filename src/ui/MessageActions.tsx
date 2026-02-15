import React, { useState } from 'react';
import { 
  copyToClipboard, 
  downloadAsDocx, 
  downloadAsPdf, 
  exportToFigmaSlides 
} from '../lib/exportUtils';
import { groqService } from '../lib/groqService';

interface MessageActionsProps {
  content: string;
}

const MessageActions: React.FC<MessageActionsProps> = ({ content }) => {
  const [showToast, setShowToast] = useState('');

  const showNotification = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(''), 2000);
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(content);
      showNotification('Copied to clipboard');
    } catch (error) {
      showNotification('Failed to copy');
    }
  };

  const handleDownloadDocx = () => {
    try {
      downloadAsDocx(content, `insight-${Date.now()}.docx`);
      showNotification('Downloaded as DOCX');
    } catch (error) {
      showNotification('Failed to download');
    }
  };

  const handleDownloadPdf = () => {
    try {
      downloadAsPdf(content, `insight-${Date.now()}.pdf`);
      showNotification('Downloaded as HTML (Print to PDF)');
    } catch (error) {
      showNotification('Failed to download');
    }
  };

  const handleExportSlides = () => {
    try {
      exportToFigmaSlides(content, 'Research Insight');
      showNotification('Exporting to Figma slides...');
    } catch (error) {
      showNotification('Failed to export');
    }
  };

  const handleGeneratePrompt = async () => {
    try {
      showNotification('Generating prompt...');
      // This would need the full conversation context
      const prompt = await groqService.generatePrompt([
        { role: 'user', content: 'Query' },
        { role: 'assistant', content: content }
      ]);
      await copyToClipboard(prompt);
      showNotification('Prompt copied to clipboard');
    } catch (error) {
      showNotification('Failed to generate prompt');
    }
  };

  return (
    <>
      <div className="message-actions">
        <button 
          className="action-btn" 
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" 
                  d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
        </button>

        <button 
          className="action-btn" 
          onClick={handleDownloadDocx}
          title="Download as DOCX"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" 
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span className="action-label">DOCX</span>
        </button>

        <button 
          className="action-btn" 
          onClick={handleDownloadPdf}
          title="Download as PDF"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" 
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span className="action-label">PDF</span>
        </button>

        <button 
          className="action-btn" 
          onClick={handleExportSlides}
          title="Export to Figma slides"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" 
                  d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
          </svg>
          <span className="action-label">Slides</span>
        </button>

        <button 
          className="action-btn" 
          onClick={handleGeneratePrompt}
          title="Generate AI prompt"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" 
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
          <span className="action-label">Prompt</span>
        </button>
      </div>

      {showToast && (
        <div className="toast">
          {showToast}
        </div>
      )}
    </>
  );
};

export default MessageActions;
