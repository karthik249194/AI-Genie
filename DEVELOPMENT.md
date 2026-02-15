# Development Guide

## Development Workflow

### Setting Up Development Environment

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd research-insights-plugin
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Add your GROQ_API_KEY
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **In Figma Desktop:**
   - Plugins → Development → Import plugin from manifest
   - Select `manifest.json`
   - Plugin appears with hot reload enabled

## Project Architecture

### Component Hierarchy

```
App (Main container)
├── Header (Theme toggle)
├── FileUpload (Upload section)
│   ├── DropZone
│   └── FileList
└── ChatInterface (Chat section)
    ├── MessagesContainer
    │   └── Message + MessageActions
    └── InputForm
```

### Data Flow

```
User uploads file
    ↓
FileUpload validates & processes
    ↓
File content stored in state
    ↓
User clicks "Continue"
    ↓
Content sent to GroqService
    ↓
User sends query
    ↓
Groq API processes with context
    ↓
Response displayed with actions
```

### State Management

Currently uses React useState. For scaling:

```typescript
// Future: Consider using Context API or Zustand
interface AppState {
  files: UploadedFile[];
  messages: ChatMessage[];
  theme: Theme;
  isProcessing: boolean;
}
```

## File Processing Pipeline

### Adding New File Types

1. **Update validation:**
   ```typescript
   // src/lib/fileProcessing.ts
   const validExtensions = ['docx', 'pdf', 'ppt', 'pptx', 'mp4', 'xlsx']; // Add new
   ```

2. **Add processor:**
   ```typescript
   async function processXlsx(file: File): Promise<string> {
     // Implementation
   }
   ```

3. **Update switch case:**
   ```typescript
   case 'xlsx':
     return await processXlsx(file);
   ```

### Document Processing Libraries

**DOCX**: `mammoth`
```typescript
import mammoth from 'mammoth';
const result = await mammoth.extractRawText({ arrayBuffer });
```

**PDF**: Browser-based extraction or pdf.js
```typescript
// For production, use pdf.js:
import * as pdfjsLib from 'pdfjs-dist';
```

**PPTX**: Requires custom parser or library like `pptx2json`

## AI Integration

### Groq Service Architecture

```typescript
class GroqService {
  private client: Groq;
  private documentContext: string;

  setDocumentContext(docs: string[]) {
    // Combine all documents
  }

  async queryDocuments(query: string) {
    // Process with AI
  }

  async generatePrompt(conversation: Message[]) {
    // Generate reusable prompt
  }
}
```

### Prompt Engineering

**System Prompt Structure:**
```
1. Role definition
2. Available documents context
3. Response constraints
4. Output format guidelines
```

**Best Practices:**
- Keep temperature low (0.3) for factual responses
- Use clear delimiters for document sections
- Implement fallback responses
- Handle token limits gracefully

### Extending AI Capabilities

**Add sentiment analysis:**
```typescript
async analyzeSentiment(text: string): Promise<SentimentResult> {
  const prompt = `Analyze sentiment: ${text}`;
  // Groq API call
}
```

**Add summarization:**
```typescript
async summarizeDocument(content: string): Promise<string> {
  const prompt = `Summarize in 3-5 sentences: ${content}`;
  // Groq API call
}
```

## Styling System

### CSS Architecture

```
App.css
├── CSS Variables (theme tokens)
├── Base styles
├── Component styles
├── Utility classes
└── Animations
```

### Adding New Themes

1. **Define variables:**
   ```css
   [data-theme="high-contrast"] {
     --color-bg-primary: #000000;
     --color-text-primary: #FFFFFF;
     /* ... */
   }
   ```

2. **Update theme type:**
   ```typescript
   type Theme = 'light' | 'dark' | 'high-contrast';
   ```

### Animation Guidelines

**Performance:**
- Use `transform` and `opacity` only
- Avoid animating width/height
- Use `will-change` sparingly

**Timing:**
- Fast: 150ms (hover effects)
- Base: 250ms (transitions)
- Slow: 350ms+ (page transitions)

## Testing

### Unit Tests (Future)

```typescript
// __tests__/fileProcessing.test.ts
describe('File Processing', () => {
  test('validates file types correctly', () => {
    expect(validateFileType(mockDocx)).toBe(true);
    expect(validateFileType(mockInvalid)).toBe(false);
  });
});
```

### Integration Tests

```typescript
// __tests__/groqService.test.ts
describe('Groq Service', () => {
  test('returns out of context message', async () => {
    const response = await groqService.queryDocuments('unrelated query');
    expect(response).toContain('not part of document uploaded');
  });
});
```

### Manual Testing Checklist

- [ ] Upload each supported file type
- [ ] Verify validation works for invalid files
- [ ] Test drag & drop functionality
- [ ] Verify file removal
- [ ] Test chat with various queries
- [ ] Verify all export options work
- [ ] Test theme switching
- [ ] Check responsive behavior
- [ ] Test error handling
- [ ] Verify animations are smooth

## Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components
const ChatInterface = lazy(() => import('./ChatInterface'));
```

### Memoization

```typescript
const FileList = memo(({ files }) => {
  // Component logic
});
```

### Virtual Scrolling (For large message lists)

```typescript
import { FixedSizeList } from 'react-window';
```

### Bundle Analysis

```bash
npm run build
npx vite-bundle-visualizer
```

## Debugging

### Common Issues

**Files not processing:**
```typescript
console.log('File type:', file.type);
console.log('File extension:', file.name.split('.').pop());
console.log('Validation result:', validateFileType(file));
```

**API errors:**
```typescript
try {
  const response = await groqService.queryDocuments(query);
} catch (error) {
  console.error('Groq error:', error);
  // Check API key, rate limits, token limits
}
```

**Theme not persisting:**
```typescript
// Add localStorage persistence
useEffect(() => {
  localStorage.setItem('theme', theme);
}, [theme]);
```

### Figma Plugin Debugging

**Console logs:**
```typescript
// Plugin code (sandbox)
console.log('Plugin:', data);

// UI code
console.log('UI:', data);
```

**Check plugin console:**
- Right-click plugin → Inspect
- Console tab shows UI logs
- DevTools console shows plugin logs

## Version Management

### Semantic Versioning

- **MAJOR**: Breaking changes (2.0.0)
- **MINOR**: New features (1.1.0)
- **PATCH**: Bug fixes (1.0.1)

### Release Process

1. **Update version:**
   ```bash
   npm version patch  # or minor, major
   ```

2. **Update manifest:**
   ```json
   {
     "build": "1.0.1"
   }
   ```

3. **Build and test:**
   ```bash
   npm run build
   # Test in Figma
   ```

4. **Commit and tag:**
   ```bash
   git add .
   git commit -m "Release v1.0.1"
   git tag v1.0.1
   git push --tags
   ```

## Security Considerations

### API Key Protection

**Current (Development):**
```typescript
dangerouslyAllowBrowser: true // ⚠️ Not for production!
```

**Production Solution:**

1. **Create backend API:**
   ```typescript
   // api/groq.ts (Vercel serverless)
   export default async function handler(req, res) {
     const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
     // Handle request
   }
   ```

2. **Update frontend:**
   ```typescript
   const response = await fetch('/api/groq', {
     method: 'POST',
     body: JSON.stringify({ query })
   });
   ```

### Input Sanitization

```typescript
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .slice(0, 1000); // Limit length
}
```

### File Validation

```typescript
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

if (file.size > MAX_FILE_SIZE) {
  throw new Error('File too large');
}
```

## Best Practices

### Code Style

```typescript
// Use descriptive names
const handleFileUpload = async (files: File[]) => { };

// Extract complex logic
const isValidDocument = (file: File): boolean => {
  return validateFileType(file) && file.size < MAX_SIZE;
};

// Use TypeScript strictly
interface Props {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}
```

### Error Handling

```typescript
try {
  await processFile(file);
} catch (error) {
  if (error instanceof ValidationError) {
    showError('Invalid file format');
  } else if (error instanceof ProcessingError) {
    showError('Unable to process file');
  } else {
    showError('Unexpected error occurred');
    console.error(error);
  }
}
```

### Accessibility

```typescript
<button
  aria-label="Remove file"
  aria-describedby="remove-file-description"
>
  ×
</button>
```

## Contributing Guidelines

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/`: New features
- `bugfix/`: Bug fixes
- `hotfix/`: Critical fixes

### Commit Messages

```
feat: Add Excel file support
fix: Resolve theme persistence issue
docs: Update API documentation
refactor: Simplify file processing logic
test: Add unit tests for validation
chore: Update dependencies
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] No console errors

## Screenshots
(if applicable)
```

## Resources

### Documentation
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Figma Plugin API](https://www.figma.com/plugin-docs/)
- [Groq API Docs](https://console.groq.com/docs)

### Tools
- [Vite](https://vitejs.dev)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TypeScript Playground](https://www.typescriptlang.org/play)

---

Happy coding! 🚀
