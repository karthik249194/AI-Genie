# Research Insights Plugin - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Figma Plugin                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐                    ┌──────────────┐      │
│  │   UI Layer   │◄──────────────────►│ Plugin Layer │      │
│  │  (React App) │                    │  (Sandbox)   │      │
│  └──────┬───────┘                    └──────┬───────┘      │
│         │                                   │              │
│         │ postMessage                       │ Figma API    │
│         │                                   │              │
└─────────┼───────────────────────────────────┼──────────────┘
          │                                   │
          │                                   ▼
          │                            ┌─────────────┐
          │                            │   Figma     │
          │                            │  Canvas     │
          │                            └─────────────┘
          │
          ▼
   ┌─────────────┐
   │   Groq API  │
   │  (Llama 3.1)│
   └─────────────┘
```

## Component Architecture

```
research-insights-plugin/
│
├── UI Components (React)
│   ├── App.tsx (Root)
│   │   ├── Header (Theme toggle)
│   │   ├── FileUpload (Drag & drop)
│   │   │   ├── DropZone
│   │   │   └── FileList
│   │   │       └── FileItem[]
│   │   └── ChatInterface
│   │       ├── MessagesContainer
│   │       │   └── Message + MessageActions
│   │       └── InputForm
│   │
│   └── Styles (CSS)
│       ├── Theme variables
│       ├── Component styles
│       └── Animations
│
├── Business Logic
│   ├── fileProcessing.ts
│   │   ├── processDocx()
│   │   ├── processPdf()
│   │   ├── processPptx()
│   │   └── validateFileType()
│   │
│   ├── groqService.ts
│   │   ├── setDocumentContext()
│   │   ├── queryDocuments()
│   │   └── generatePrompt()
│   │
│   └── exportUtils.ts
│       ├── copyToClipboard()
│       ├── downloadAsDocx()
│       ├── downloadAsPdf()
│       ├── exportToFigmaSlides()
│       └── generatePrompt()
│
├── Plugin Layer (Figma Sandbox)
│   └── code.ts
│       ├── exportToSlides()
│       ├── createFrameWithContent()
│       └── message handlers
│
└── Configuration
    ├── manifest.json
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

## Data Flow

### 1. File Upload Flow
```
User drops file
      ↓
FileUpload component
      ↓
validateFileType()
      ↓
processFile()
      ├─→ processDocx() if .docx
      ├─→ processPdf() if .pdf
      └─→ processPptx() if .pptx
      ↓
Extract text content
      ↓
Store in state
      ↓
Display in FileList
```

### 2. Query Flow
```
User enters query
      ↓
ChatInterface
      ↓
groqService.queryDocuments()
      ↓
Combine documents as context
      ↓
Send to Groq API
      ├─→ System prompt (role + documents)
      └─→ User query
      ↓
Process response
      ├─→ In context: Return answer
      └─→ Out of context: Return error message
      ↓
Display in chat
      ↓
Show export actions
```

### 3. Export Flow
```
User clicks export button
      ↓
MessageActions component
      ├─→ Copy: copyToClipboard()
      ├─→ DOCX: downloadAsDocx()
      ├─→ PDF: downloadAsPdf()
      ├─→ Slides: exportToFigmaSlides()
      │          ↓
      │     postMessage to plugin
      │          ↓
      │     Plugin creates frame
      │          ↓
      │     Add text content
      └─→ Prompt: generatePrompt()
              ↓
         Generate AI prompt
              ↓
         Copy to clipboard
```

## State Management

### Current State Structure
```typescript
App State:
  ├── theme: 'light' | 'dark'
  ├── files: UploadedFile[]
  ├── isChatMode: boolean
  ├── messages: ChatMessage[]
  └── isProcessing: boolean

UploadedFile:
  ├── id: string
  ├── name: string
  ├── type: string
  ├── size: number
  ├── content: string
  └── uploadedAt: Date

ChatMessage:
  ├── id: string
  ├── role: 'user' | 'assistant'
  ├── content: string
  └── timestamp: Date
```

## API Integration

### Groq API Configuration
```typescript
Model: llama-3.1-70b-versatile
Temperature: 0.3 (factual responses)
Max Tokens: 2000
Timeout: 30s
Retry: 3 attempts with exponential backoff
```

### System Prompt Structure
```
Role Definition
    ↓
Document Context (all uploaded files)
    ↓
Response Constraints
    ├─→ Only answer from documents
    ├─→ Return error for off-topic
    └─→ Cite sources when possible
    ↓
Output Format Guidelines
```

## Security Architecture

### Current (Development)
```
Browser → Groq API (Direct)
⚠️ API key exposed in browser
```

### Production (Recommended)
```
Browser → Vercel API Route → Groq API
           ↓
    API key on server
    Rate limiting
    Request validation
```

## Deployment Architecture

### Development
```
Local Machine
    ├── npm run dev
    ├── Vite dev server (localhost:3000)
    └── Figma Desktop App
         └── Import manifest.json
```

### Production
```
GitHub Repository
      ↓
Vercel Build
      ├── npm run build
      ├── Generate dist/
      └── Deploy static files
      ↓
CDN Distribution
      ↓
Figma Plugin
      ├── Load UI from Vercel
      └── Execute plugin code locally
```

## Performance Considerations

### Bundle Size
- **Target**: < 500KB total
- **Current**: ~300KB (estimated)
- **Optimization**: 
  - Code splitting
  - Tree shaking
  - Minification

### Loading Time
- **Target**: < 2s initial load
- **Optimization**:
  - Lazy load chat interface
  - Cache theme preference
  - Preload critical assets

### Memory Usage
- **File processing**: Stream large files
- **Chat history**: Limit to 100 messages
- **Document context**: Max 50MB combined

## Scalability

### Horizontal Scaling
- Vercel automatically scales
- Edge functions for API routes
- CDN caching for static assets

### Vertical Scaling
- Implement virtual scrolling for messages
- Paginate file uploads
- Compress document context

## Testing Strategy

### Unit Tests
- File validation
- Document processing
- Export utilities
- Theme switching

### Integration Tests
- API communication
- File upload flow
- Chat functionality
- Export actions

### E2E Tests
- Complete user journeys
- Error scenarios
- Performance benchmarks

## Monitoring & Analytics

### Key Metrics
- Plugin load time
- API response time
- Error rate
- File processing success rate
- Export action usage

### Tools
- Vercel Analytics
- Console error tracking
- Performance API
- Custom event logging

## Future Architecture Improvements

1. **Backend API Layer**
   - Secure API key storage
   - Rate limiting
   - Caching layer
   - Request queue

2. **Database Integration**
   - Store user preferences
   - Save chat history
   - Analytics data

3. **Real-time Features**
   - WebSocket for live updates
   - Collaborative editing
   - Team workspaces

4. **Advanced Processing**
   - OCR for scanned PDFs
   - Audio transcription
   - Image analysis
   - Video processing

5. **Plugin Ecosystem**
   - Extension API
   - Custom processors
   - Third-party integrations

---

This architecture is designed to be:
- **Maintainable**: Clear separation of concerns
- **Scalable**: Easy to add features
- **Performant**: Optimized for speed
- **Secure**: Following best practices
- **Testable**: Well-structured for testing
