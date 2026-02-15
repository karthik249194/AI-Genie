# Quick Start Guide

Get your Research Insights Plugin up and running in 5 minutes!

## ⚡ Fast Setup (Development)

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env

# 3. Add your Groq API key to .env
echo "VITE_GROQ_API_KEY=your_key_here" > .env

# 4. Start development
npm run dev

# 5. In Figma Desktop: Plugins → Development → Import plugin from manifest
# Select the manifest.json file from this directory
```

🎉 **Done!** Your plugin is now running in Figma.

## 🚀 Fast Deployment (Production)

```bash
# 1. Build the project
npm run build

# 2. Deploy to Vercel
npx vercel

# 3. Add environment variables in Vercel dashboard
# VITE_GROQ_API_KEY = your_groq_api_key

# 4. Update manifest.json with your Vercel URL
# Add to networkAccess.allowedDomains: "https://your-project.vercel.app"
```

🌐 **Live!** Your plugin is now hosted on Vercel.

## 📋 Prerequisites Checklist

- [ ] Node.js 18+ installed ([Download](https://nodejs.org))
- [ ] Figma Desktop App installed ([Download](https://www.figma.com/downloads/))
- [ ] Groq API key ([Get free key](https://console.groq.com))
- [ ] Git installed (optional, for version control)
- [ ] Vercel account (optional, for deployment)

## 🎯 First Steps After Setup

### 1. Test File Upload
- Open the plugin in Figma
- Drag and drop a .docx or .pdf file
- Verify it appears in the uploaded files list

### 2. Test Chat
- Click "Continue" button
- Ask: "What are the main topics in this document?"
- Verify you get a response

### 3. Test Export
- Click the copy icon on any response
- Verify it copied to clipboard
- Try other export options (DOCX, PDF, Slides)

### 4. Test Theme
- Click the theme toggle (🌙/☀️) in the header
- Verify colors change smoothly

## 🔑 Getting Your Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Click "Create API Key"
5. Copy the key
6. Paste it in your `.env` file

**Free tier includes:**
- 30 requests per minute
- 14,400 requests per day
- Perfect for development and testing!

## 🎨 Customization Quick Tips

### Change Primary Color

Edit `src/ui/App.css`:
```css
:root {
  --color-accent: #4F46E5; /* Change this! */
}
```

### Change Font

Edit `src/ui/App.css`:
```css
:root {
  --font-family: 'Your Font', sans-serif;
}
```

### Add Your Logo

Edit `src/ui/App.tsx`:
```typescript
<header className="app-header">
  <img src="/logo.png" alt="Logo" />
  <h1 className="app-title">Your Brand</h1>
</header>
```

## 🐛 Common Issues & Quick Fixes

### "Module not found" error
```bash
rm -rf node_modules package-lock.json
npm install
```

### Plugin not showing in Figma
- Ensure Figma Desktop App is running
- Verify `manifest.json` exists
- Try: Plugins → Development → Reload

### API key error
- Check `.env` file exists
- Verify key starts with `gsk_`
- Restart dev server after adding key

### Build fails
```bash
# Clear Vite cache
rm -rf dist/ .vite/
npm run build
```

## 📚 Next Steps

Once everything works:

1. **Read the full docs:**
   - [README.md](./README.md) - Complete documentation
   - [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guide
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

2. **Customize the UI:**
   - Update colors and fonts
   - Add your branding
   - Modify layouts

3. **Add features:**
   - Support more file types
   - Add custom export formats
   - Integrate more AI models

4. **Deploy to production:**
   - Set up Vercel
   - Configure custom domain
   - Enable analytics

## 💡 Pro Tips

**Speed up development:**
```bash
# Watch mode for plugin code
npm run dev:plugin

# In another terminal, watch UI
npm run dev:ui
```

**Test without Figma:**
```bash
npm run dev
# Open http://localhost:3000 in browser
```

**Lint your code:**
```bash
npx eslint src/ --fix
```

**Check bundle size:**
```bash
npm run build
npx vite-bundle-visualizer
```

## 🆘 Need Help?

- **Documentation:** See [README.md](./README.md)
- **Issues:** Check GitHub issues
- **Community:** Join discussions
- **Email:** your-email@example.com

## ✅ Success Checklist

- [ ] Plugin loads in Figma
- [ ] Can upload files
- [ ] Chat interface works
- [ ] AI responds to queries
- [ ] Export functions work
- [ ] Theme switching works
- [ ] No console errors
- [ ] Smooth animations

## 🎉 You're Ready!

Start building amazing research insights! Share your work and contribute back to the project.

Happy building! 🚀

---

**Time from zero to working plugin: ~5 minutes**
