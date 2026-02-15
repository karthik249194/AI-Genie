export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  uploadedAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface InsightResponse {
  content: string;
  sources: string[];
}

export type Theme = 'light' | 'dark';

export interface PluginMessage {
  type: 'process-file' | 'query' | 'export-slides' | 'create-frame' | 'theme-changed';
  data?: any;
}

export interface ExportFormat {
  type: 'copy' | 'docx' | 'pdf' | 'slides' | 'prompt';
}
