# Research Insights Synthesizer - Figma Plugin

A powerful Figma plugin that synthesizes research insights from multiple document formats (.docx, .pdf, .pptx, .mp4) using AI-powered analysis via Groq API.

## Features

✨ **Document Processing**
- Support for .DOCX, .PDF, .PPT, .PPTX, and .MP4 formats
- Drag & drop interface with file validation
- Multi-file upload and management

🤖 **AI-Powered Chat Interface**
- Query documents using natural language
- Context-aware responses using Groq's Llama models
- **Conversation memory**: Remembers last 5 conversations for follow-ups
- "Out of context" detection for irrelevant queries
- Intelligent handling of follow-up questions

📤 **Export Options**
- Copy to clipboard
- Download as DOCX
- Download as PDF (HTML)
- Export directly to Figma slides
- Generate AI prompts for other tools (Gemini, Cursor, Lovable, etc.)

🎨 **Beautiful UI**
- Light and dark theme support
- Smooth animations and transitions
- Responsive 30:70 split layout in chat mode
- Elegant, modern design system

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Custom CSS with CSS variables
- **AI**: Groq API (Llama 3.1 70B)
- **Hosting**: Vercel
- **Document Processing**: Mammoth.js (DOCX), PDF.js (PDF)
- **Figma**: Plugin API v1.0

## Project Structure

```
research-insights-plugin/
├── src/
│   ├── plugin/
│   │   └── code.ts              # Figma plugin sandbox code
│   ├── ui/
│   │   ├── App.tsx              # Main app component
│   │   ├── App.css              # Styles with theme support
│   │   ├── FileUpload.tsx       # Drag & drop file upload
│   │   ├── ChatInterface.tsx    # Chat UI component
│   │   ├── MessageActions.tsx   # Export action buttons
│   │   └── index.tsx            # React entry point
│   ├── lib/
│   │   ├── fileProcessing.ts    # Document parsing utilities
│   │   ├── groqService.ts       # AI API integration
│   │   └── exportUtils.ts       # Export functionality
│   └── types/
│       └── index.ts             # TypeScript definitions
├── dist/                        # Build output
├── manifest.json                # Figma plugin manifest
├── package.json                 # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- Figma Desktop App
- Groq API key ([Get one here](https://console.groq.com))

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your VITE_GROQ_API_KEY
   ```

3. **Development mode:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

### Adding to Figma

1. Open Figma Desktop App
2. Go to **Plugins** → **Development** → **Import plugin from manifest**
3. Select the `manifest.json` file from your project directory
4. The plugin will appear in your Plugins menu

### Deploying to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel:**
   - Go to your project settings
   - Add `VITE_GROQ_API_KEY` in Environment Variables

4. **Update manifest.json:**
   - Add your Vercel domain to `networkAccess.allowedDomains`

## Usage Guide

### 1. Upload Documents

- Drag and drop files or click to browse
- Supported formats clearly labeled with descriptions:
  - **DOCX** - Word Documents
  - **PDF** - PDF Files
  - **PPT** - Presentations
  - **MP4** - Video Files
- Upload multiple files for comprehensive analysis
- Remove files by clicking the × icon with proper icons

### 2. Start Querying

- Click "Continue" when files are uploaded
- Interface switches to 30:70 split view
- Files remain visible on the left (30%)
- Chat interface appears on the right (70%)

### 3. Ask Questions

- Type your research query in the input field
- Press Enter or click Send
- AI analyzes all uploaded documents
- **Remembers last 5 conversations** for intelligent follow-ups
- Ask follow-up questions like "tell me more", "what else?", "can you elaborate?"
- Receives structured responses with:
  - **Categorized insights** with clear titles
  - **Key findings** presented as distinct insights
  - **Exact excerpts** from documents in highlighted blocks
  - **Source attribution** for every claim

**Conversation Memory:**
The AI remembers your last 5 conversation turns, enabling:
- Follow-up questions without repeating context
- "Tell me more about that"
- "What else did you find?"
- "Can you elaborate on the second point?"
- Contextual clarifications

View conversation count in the header: "3 of 5 conversations remembered"
Clear history anytime with the "Clear History" button.

**Response Format:**
Each AI response is structured for maximum clarity:
```
## Category Title
Insight: Brief explanation of the finding
Excerpt:
> "Exact quote from your document that supports this insight"

## Another Finding
Insight: Another key takeaway
Excerpt:
> "Supporting quote from document"
```

### 4. Export Insights

Each response includes 5 export options:

- **Copy** (📋): Copy text to clipboard
- **DOCX** (📄): Download as Word document
- **PDF** (📥): Download as HTML (print to PDF)
- **Slides** (🎨): Export directly to Figma slide
- **Prompt** (⚡): Generate AI tool prompt

### 5. Generate AI Prompts

The "Generate Prompt" feature creates ready-to-use prompts for:
- Google Gemini
- Cursor AI
- Lovable.ai
- Figma Make
- Other AI development tools

## Versioning & Updates

### Current Version: 1.0.0

To update the plugin version:

1. Update version in `package.json`
2. Update build number in `manifest.json`
3. Rebuild: `npm run build`
4. In Figma: **Plugins** → **Development** → **Watch plugin** → **Reload**

### Version History

- **1.0.0** (2024-02): Initial release
  - Document processing for DOCX, PDF, PPT, MP4
  - AI-powered chat interface
  - Export to multiple formats
  - Light/dark theme support

## API Configuration

### Groq API

The plugin uses Groq's Llama 3.1 70B model for document analysis:

```typescript
model: 'llama-3.1-70b-versatile'
temperature: 0.3  // For factual responses
max_tokens: 2000
```

**Important**: For production, move API calls to a backend service to protect your API key.

## Design System

### Typography
- **CTAs**: 16px, semibold
- **Titles**: 18px, bold
- **Descriptions**: 16px, regular

### Colors (Light Theme)
- **Primary**: #4F46E5 (Indigo)
- **Background**: #FAFBFC
- **Text**: #1A1D23

### Colors (Dark Theme)
- **Primary**: #6366F1 (Lighter Indigo)
- **Background**: #0F1117
- **Text**: #F5F7FA

### Animations
- Fade in: 400ms
- Slide transitions: 250-500ms
- Hover effects: 150ms
- Float effect on icons

## Troubleshooting

### Common Issues

**Plugin doesn't load:**
- Ensure Figma Desktop App is up to date
- Check that `dist/` folder contains built files
- Verify `manifest.json` paths are correct

**API errors:**
- Verify GROQ_API_KEY is set correctly
- Check network access in manifest.json
- Ensure API key has sufficient credits

**File processing fails:**
- Check file format is supported
- Verify file isn't corrupted
- Try converting to a different format

**Theme not switching:**
- Clear browser cache
- Check localStorage for theme preference
- Reload plugin

## Security Notes

⚠️ **Important Security Considerations:**

1. Never commit `.env` file with real API keys
2. For production, implement backend API proxy
3. Use environment-specific API keys
4. Implement rate limiting for API calls
5. Validate all file uploads server-side

## Performance Optimization

- Files are processed client-side for privacy
- Chat history limited to prevent memory issues
- Lazy loading of file processing libraries
- Optimized animations using CSS transforms
- Debounced search queries

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this plugin for personal or commercial projects.

## Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact: [Your contact information]
- Documentation: [Your docs URL]

## Roadmap

### Upcoming Features

- [ ] Real-time collaboration
- [ ] Voice recording transcription
- [ ] Advanced PDF parsing with OCR
- [ ] Batch export options
- [ ] Custom prompt templates
- [ ] Integration with more AI models
- [ ] Team workspace support
- [ ] Analytics dashboard

## Acknowledgments

- Groq for the powerful AI API
- Figma for the excellent plugin platform
- React team for the amazing framework
- The open-source community

---

Built with ❤️ for researchers and designers
#   A I - G e n i e  
 