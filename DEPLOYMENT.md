# StarGrad Deployment Guide

## 🚀 Deploy to Vercel

### Prerequisites
- Vercel account (free at [vercel.com](https://vercel.com))
- Supabase project with your database tables set up
- GitHub repository pushed with latest changes

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository: `SalihEfehanDemir/StarGrad`

2. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**
   In the Vercel dashboard, go to Project Settings → Environment Variables and add:
   
   ```
   VITE_SUPABASE_URL = your_supabase_project_url
   VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
   ```
   
   Set these for all environments: Production, Preview, and Development.

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - You'll get a live URL like: `https://stargrad-xyz.vercel.app`

### Option 2: Deploy via CLI

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N`
   - Project name: `stargrad`
   - Directory: `./`

3. **Set Environment Variables**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

4. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

### 🔧 Post-Deployment Configuration

1. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **Performance Monitoring**
   - Vercel automatically provides analytics
   - Check the "Analytics" tab in your project dashboard

3. **Automatic Deployments**
   - Every push to `main` branch will auto-deploy
   - Pull requests create preview deployments

### 🛡️ Security Features Included

- **Headers**: Security headers configured in `vercel.json`
- **SPA Routing**: Proper redirects for React Router
- **Asset Caching**: Optimized caching for static assets
- **Environment Variables**: Secure handling of sensitive data

### 📊 Performance Optimizations

Your deployment includes:
- ✅ Code splitting (vendor, supabase, animation chunks)
- ✅ Minification and compression
- ✅ Optimal caching headers
- ✅ Security headers
- ✅ Tree shaking

### 🔍 Troubleshooting

**Build Fails?**
- Check that all environment variables are set
- Ensure Supabase URLs are correct
- Verify build works locally: `npm run build`

**App Loads but Database Errors?**
- Verify Supabase environment variables
- Check Supabase RLS policies are enabled
- Confirm database tables exist

**Routing Issues?**
- The `vercel.json` handles SPA routing
- All routes should redirect to `index.html`

### 🎉 Success!

Once deployed, your StarGrad app will be live at your Vercel URL with:
- ⚡ Lightning-fast loading
- 🔒 Secure authentication via Supabase
- 📱 Responsive design
- 🚀 Automatic deployments

Share your live app URL and enjoy your optimized, production-ready StarGrad application! 