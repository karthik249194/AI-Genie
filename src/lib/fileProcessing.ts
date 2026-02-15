import mammoth from 'mammoth';

export async function processDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    throw new Error('Unable to process file, try uploading different format');
  }
}

export async function processPdf(file: File): Promise<string> {
  try {
    // For browser-based PDF processing, we'll use a simpler approach
    // In production, you'd want to use pdf.js or similar
    const text = await file.text();
    return text;
  } catch (error) {
    throw new Error('Unable to process file, try uploading different format');
  }
}

export async function processPptx(file: File): Promise<string> {
  try {
    // PPTX processing would require a library like pptx2json
    // For now, we'll return a placeholder
    const arrayBuffer = await file.arrayBuffer();
    // In production, implement proper PPTX parsing
    return 'PPTX content extraction requires additional processing';
  } catch (error) {
    throw new Error('Unable to process file, try uploading different format');
  }
}

export async function processFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'docx':
      return await processDocx(file);
    case 'pdf':
      return await processPdf(file);
    case 'ppt':
    case 'pptx':
      return await processPptx(file);
    default:
      throw new Error('Invalid file format');
  }
}

export function validateFileType(file: File): boolean {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'video/mp4'
  ];
  
  const validExtensions = ['docx', 'pdf', 'ppt', 'pptx', 'mp4'];
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  return validTypes.includes(file.type) || (extension ? validExtensions.includes(extension) : false);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
