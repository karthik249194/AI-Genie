export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadAsDocx(content: string, filename: string = 'insight.docx') {
  // Create a simple Word document structure
  const docContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Research Insight</title>
      </head>
      <body>
        <div style='font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;'>
          ${content.replace(/\n/g, '<br>')}
        </div>
      </body>
    </html>
  `;
  
  const blob = new Blob([docContent], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  });
  downloadBlob(blob, filename);
}

export function downloadAsPdf(content: string, filename: string = 'insight.pdf') {
  // For PDF generation in browser, you'd typically use jsPDF or similar
  // For now, we'll create a simple HTML that can be printed to PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset='utf-8'>
        <title>Research Insight</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
        </style>
      </head>
      <body>
        ${content.replace(/\n/g, '<br>')}
      </body>
    </html>
  `;
  
  const blob = new Blob([htmlContent], { type: 'text/html' });
  downloadBlob(blob, filename.replace('.pdf', '.html'));
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToFigmaSlides(content: string, title: string) {
  parent.postMessage({
    pluginMessage: {
      type: 'export-slides',
      data: { content, title }
    }
  }, '*');
}
