# Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

## Manual Deployment Steps

### 1. Prepare Your Project

Ensure your project is ready:
```bash
# Install dependencies
npm install

# Test build locally
npm run build

# Verify dist/ folder is created
ls dist/
```

### 2. Install Vercel CLI

```bash
npm i -g vercel
```

### 3. Login to Vercel

```bash
vercel login
```

### 4. Deploy

```bash
# For preview deployment
vercel

# For production deployment
vercel --prod
```

### 5. Configure Environment Variables

In Vercel Dashboard:
1. Go to your project
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - `VITE_GROQ_API_KEY`: Your Groq API key
4. Redeploy to apply changes

### 6. Update Figma Plugin Manifest

After deployment, update `manifest.json`:

```json
{
  "networkAccess": {
    "allowedDomains": [
      "https://api.groq.com",
      "https://your-project.vercel.app"
    ]
  }
}
```

## Automatic Deployments

### Connect to Git

1. **Push to GitHub/GitLab:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import in Vercel:**
   - Go to vercel.com/new
   - Import your repository
   - Vercel will auto-detect Vite configuration
   - Add environment variables
   - Deploy!

3. **Auto-deploy on push:**
   - Every push to main branch triggers deployment
   - Pull requests get preview deployments

## Configuration Files

### vercel.json (Optional)

Create `vercel.json` for custom configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "env": {
    "VITE_GROQ_API_KEY": "@groq_api_key"
  }
}
```

## Environment-Specific Builds

### Development
```bash
vercel --env VITE_GROQ_API_KEY=dev_key
```

### Staging
```bash
vercel --target staging
```

### Production
```bash
vercel --prod --env VITE_GROQ_API_KEY=prod_key
```

## Monitoring & Analytics

### Enable Vercel Analytics

1. Go to project settings
2. Enable **Analytics**
3. Add to your app:
   ```bash
   npm install @vercel/analytics
   ```

4. Update `src/ui/index.tsx`:
   ```typescript
   import { Analytics } from '@vercel/analytics/react';
   
   root.render(
     <React.StrictMode>
       <App />
       <Analytics />
     </React.StrictMode>
   );
   ```

## Troubleshooting

### Build Fails

**Issue**: "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Issue**: "Environment variable not defined"
- Check Vercel dashboard → Settings → Environment Variables
- Ensure variable names match exactly (case-sensitive)
- Redeploy after adding variables

### Domain Configuration

**Custom domain:**
1. Go to project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for DNS propagation (up to 24 hours)

### CORS Issues

Add to `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
});
```

## Performance Optimization

### Enable Caching

Vercel automatically caches static assets. For API routes:

```typescript
// In your API route
export const config = {
  runtime: 'edge', // Use edge runtime for speed
};
```

### Optimize Build

```json
// package.json
{
  "scripts": {
    "build": "vite build --mode production",
    "build:analyze": "vite-bundle-visualizer"
  }
}
```

### Use Environment-Specific Configs

Create `.env.production`:
```
VITE_GROQ_API_KEY=prod_key_here
VITE_API_URL=https://api.yourapp.com
```

## Security Best Practices

1. **Never commit secrets:**
   ```bash
   # .gitignore
   .env
   .env.local
   .env.production
   ```

2. **Use Vercel Environment Variables:**
   - Sensitive data should be in Vercel dashboard
   - Reference via `process.env.VARIABLE_NAME`

3. **Enable HTTPS only:**
   - Vercel provides free SSL
   - Redirect HTTP to HTTPS automatically

4. **Set up authentication** (if needed):
   ```bash
   npm install next-auth
   ```

## Rollback Deployment

If something goes wrong:

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>
```

Or in dashboard:
1. Go to Deployments
2. Find previous working version
3. Click "Promote to Production"

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Monitoring

### Set up alerts

1. Go to project → Settings → Integrations
2. Connect Slack or email notifications
3. Get notified on:
   - Failed deployments
   - High error rates
   - Performance issues

### View Logs

```bash
# Real-time logs
vercel logs <deployment-url> --follow

# Error logs only
vercel logs <deployment-url> --follow --filter error
```

## Cost Management

- **Hobby plan**: Free for personal projects
- **Pro plan**: $20/mo for team features
- **Enterprise**: Custom pricing

**Tips to save costs:**
1. Use serverless functions sparingly
2. Optimize image sizes
3. Implement caching strategies
4. Monitor bandwidth usage

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Environment Variables](https://vercel.com/docs/environment-variables)
- [Custom Domains](https://vercel.com/docs/custom-domains)

---

🚀 **Your plugin is now live on Vercel!**

Access it at: `https://your-project.vercel.app`
