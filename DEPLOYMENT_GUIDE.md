# Deployment Guide for THE PASS

This document outlines the steps needed to deploy the application to production.

## Pre-Deployment Checklist

### 1. **Environment Variables**
Before deploying, ensure all environment variables are properly configured:

- Copy `.env.example` to your deployment platform
- Replace placeholder values with actual credentials:
  - Firebase credentials (API key, auth domain, project ID, etc.)
  - Gemini API key
  - Firebase Admin SDK credentials (for server-side functions)
  - Email service credentials

**⚠️ IMPORTANT**: Never commit `.env` files containing sensitive credentials to version control. The `.env` file should be in `.gitignore`.

### 2. **Firebase Configuration**
Ensure Firebase is properly configured:
- [ ] Firebase project created at https://console.firebase.google.com/
- [ ] Firestore enabled
- [ ] Authentication enabled (Email/Password)
- [ ] Firebase credentials added to deployment environment

### 3. **API Keys**
- [ ] Gemini API key obtained from Google Cloud Console
- [ ] Email service credentials (Gmail App Password or similar)

## Deployment Options

### Option 1: Netlify (Recommended)

1. **Connect your repository:**
   ```bash
   # Push your code to GitHub/GitLab/Bitbucket
   git push origin main
   ```

2. **Link to Netlify:**
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Select your Git provider and repository
   - Netlify will auto-detect Vite build settings (uses `netlify.toml`)

3. **Add environment variables:**
   - Go to Site settings → Build & deploy → Environment
   - Add all variables from `.env.example`:
     - `VITE_FIREBASE_apiKey`
     - `VITE_FIREBASE_authDomain`
     - `VITE_FIREBASE_projectId`
     - `VITE_FIREBASE_storageBucket`
     - `VITE_FIREBASE_messagingSenderId`
     - `VITE_FIREBASE_appId`
     - `VITE_FIREBASE_measurementId`
     - `VITE_GEMINI_API_KEY`
     - `FIREBASE_PROJECT_ID` (if using server functions)
     - `FIREBASE_CLIENT_EMAIL` (if using server functions)
     - `FIREBASE_PRIVATE_KEY` (if using server functions)
     - `EMAIL_USER`
     - `EMAIL_PASS`

4. **Deploy:**
   - Netlify will automatically build and deploy on every push to main

### Option 2: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow prompts:**
   - Link project to Vercel
   - Add environment variables when prompted
   - Vercel will use `vercel.json` for configuration

### Option 3: Other Platforms (Firebase Hosting, AWS Amplify, etc.)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder:**
   - Upload contents of `dist/` directory to your hosting provider
   - Configure redirects to `index.html` for SPA routing

3. **Add environment variables:**
   - Use your platform's environment variable settings to add all required variables

## Post-Deployment

### Verify Deployment:
- [ ] Website loads without errors
- [ ] Authentication works (login/signup)
- [ ] Firebase connection is active
- [ ] 3D scenes render properly
- [ ] Emails send correctly (if configured)

### Monitor:
- Check Netlify/Vercel analytics dashboard
- Review error logs regularly
- Monitor Firebase usage and costs

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Ensure all environment variables are set
- Run `npm install` locally to verify dependencies

### Authentication Issues
- Verify Firebase credentials are correct
- Check Firebase Console for security rules
- Ensure email/password auth is enabled in Firebase

### API Failures
- Verify API keys are correct and have appropriate permissions
- Check API usage quotas
- Review server-side logs

## Security Best Practices

1. **Never commit sensitive data** - Use `.env.example` as a template
2. **Use environment variables** for all credentials
3. **Rotate API keys periodically**
4. **Monitor Firebase usage** for unusual activity
5. **Enable Firebase security rules** appropriately
6. **Use HTTPS** (automatic with Netlify/Vercel)

## Custom Domain

### For Netlify:
1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS records as instructed

### For Vercel:
1. Go to Project settings → Domains
2. Add custom domain
3. Update DNS records as instructed

## Questions?

Refer to the documentation:
- Vite: https://vitejs.dev/guide/
- Firebase: https://firebase.google.com/docs
- Netlify: https://docs.netlify.com/
- Vercel: https://vercel.com/docs
