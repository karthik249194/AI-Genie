import React from 'react';

interface MarkdownMessageProps {
  content: string;
}

const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => {
  // Parse the markdown-style content
  const parseContent = (text: string) => {
    const elements: JSX.Element[] = [];
    const lines = text.split('\n');
    let currentSection: any = null;
    let inExcerpt = false;
    let excerptLines: string[] = [];
    let key = 0;

    const flushExcerpt = () => {
      if (excerptLines.length > 0) {
        elements.push(
          <div key={`excerpt-${key++}`} className="excerpt-block">
            {excerptLines.map((line, idx) => (
              <p key={idx} className="excerpt-text">
                {line.replace(/^>\s*/, '')}
              </p>
            ))}
          </div>
        );
        excerptLines = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Category title (## Title)
      if (line.startsWith('## ')) {
        flushExcerpt();
        const title = line.replace('## ', '');
        elements.push(
          <h3 key={`title-${key++}`} className="insight-category">
            {title}
          </h3>
        );
      }
      // Insight label
      else if (line.startsWith('**Insight:**')) {
        flushExcerpt();
        const insight = line.replace('**Insight:**', '').trim();
        elements.push(
          <div key={`insight-${key++}`} className="insight-content">
            <span className="insight-label">Insight:</span>
            <span className="insight-text">{insight}</span>
          </div>
        );
      }
      // Excerpt label
      else if (line.startsWith('**Excerpt:**')) {
        flushExcerpt();
        inExcerpt = true;
        elements.push(
          <div key={`excerpt-label-${key++}`} className="excerpt-label">
            Excerpt:
          </div>
        );
      }
      // Excerpt content (blockquote)
      else if (line.startsWith('>')) {
        excerptLines.push(line);
      }
      // Regular text
      else if (line.length > 0) {
        flushExcerpt();
        inExcerpt = false;
        
        // Check if it's bold text
        if (line.startsWith('**') && line.endsWith('**')) {
          elements.push(
            <p key={`bold-${key++}`} className="message-bold">
              {line.replace(/\*\*/g, '')}
            </p>
          );
        } else {
          elements.push(
            <p key={`text-${key++}`} className="message-text">
              {line}
            </p>
          );
        }
      }
    }

    flushExcerpt();
    return elements;
  };

  return (
    <div className="markdown-message">
      {parseContent(content)}
    </div>
  );
};

export default MarkdownMessage;
