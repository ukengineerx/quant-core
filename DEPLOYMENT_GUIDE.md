# Deployment Guide: Quantum Founder Roadmap to path.ukdiaries.com

This guide walks you through deploying the Quantum Founder Roadmap application to your personal portfolio subdomain at **path.ukdiaries.com**.

## Prerequisites

- GitHub account (if not already created)
- Vercel account (free tier is sufficient)
- Access to your domain registrar (wherever ukdiaries.com is registered)
- Git installed locally

## Step 1: GitHub Repository Setup

### 1a. Initialize local Git repository

```bash
cd /Users/uksingh/Workspace/lab/path/quantum-app
git init
git add .
git commit -m "Initial commit: Quantum Founder Roadmap app"
```

### 1b. Create GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `quantum-app`
3. Keep it public or private as preferred
4. Don't initialize with README (we have our own)

### 1c. Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/quantum-app.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 2: Vercel Project Creation

### 2a. Create Vercel project

1. Visit [vercel.com/new](https://vercel.com/new)
2. Import the GitHub repository (`quantum-app`)
3. Vercel will auto-detect Vite as the framework
4. Click "Deploy" (deployment will happen, but we need to configure domain first)

### 2b. Configure environment variables in Vercel

1. After project creation, go to **Settings** → **Environment Variables**
2. Add the following variables:
   - Name: `VITE_AUTH_USERNAME`
   - Value: `uk.singh`
   - Click "Add"

3. Add the second variable:
   - Name: `VITE_AUTH_PASSWORD`
   - Value: `2001@Prince`
   - Click "Add"

4. Click "Save"

## Step 3: Configure Custom Domain

### 3a. In Vercel Dashboard

1. Go to **Settings** → **Domains**
2. Click "Add Domain"
3. Enter: `path.ukdiaries.com`
4. Vercel will provide DNS records to configure

### 3b. At your domain registrar

1. Log into your domain registrar where ukdiaries.com is registered
2. Find the DNS settings/records section
3. Add a **CNAME record**:
   - Name: `path`
   - Value: `cname.vercel.com` (or the value Vercel provides)
   - TTL: 3600 (or auto)
4. Save the DNS record

**Note:** DNS changes can take 24-48 hours to fully propagate. Check the status in Vercel's Domains settings.

### 3c. Verify SSL certificate

Once DNS propagates, Vercel will automatically provision an SSL certificate. You should see a checkmark next to the domain in Vercel settings.

## Step 4: Test the Deployment

### 4a. Visit your live application

Once DNS propagates and SSL is active:

```
https://path.ukdiaries.com
```

### 4b. Test login functionality

1. Use these credentials:
   - Username: `uk.singh`
   - Password: `2001@Prince`
2. Verify the quantum roadmap loads correctly
3. Test logout functionality
4. Verify auth state persists on page refresh

### 4c. Performance checks

- Check page load time
- Verify responsive design on mobile
- Test all tabs and features in the dashboard

## Step 5: Post-Deployment Maintenance

### Monitor Vercel deployment

- Vercel Dashboard shows deployment logs
- Check for build errors after each push to main
- Monitor performance metrics in Analytics tab

### Update environment variables (if needed)

If you need to change credentials:

1. Go to Vercel Settings → Environment Variables
2. Update the values
3. Redeploy: go to Deployments and click "Redeploy" on latest deployment
   - Or push any change to main branch to trigger automatic rebuild

### Backup and version control

- Push updates to GitHub main branch for backup
- Consider tagging releases: `git tag v1.0.0 && git push --tags`

## Troubleshooting

### Domain not resolving

- Wait 24-48 hours for DNS propagation
- Clear browser DNS cache: Open DevTools → Application → Clear Site Data
- Check CNAME record in your registrar is correct

### Build failures on Vercel

- Check build logs in Vercel Deployments section
- Verify environment variables are set
- Run `npm run build` locally to test build

### Login not working

- Verify environment variables match credentials in .env.local
- Check browser console for errors (F12 → Console)
- Clear localStorage: Open DevTools → Application → Local Storage → Clear All

### SSL certificate not provisioning

- Verify DNS CNAME is pointing to Vercel
- Wait additional 24 hours
- Contact Vercel support if still pending

## Quick Reference

| Item | Value |
|------|-------|
| Production URL | https://path.ukdiaries.com |
| GitHub Repo | github.com/YOUR_USERNAME/quantum-app |
| Vercel Project | quantum-app |
| Auth Username | uk.singh |
| Auth Password | 2001@Prince |
| Build Command | npm run build |
| Output Directory | dist |

## Next Steps

1. Set up GitHub Actions for automatic testing (optional)
2. Configure analytics in Vercel to monitor usage
3. Document any custom domain SSL configuration
4. Consider adding automated backups to GitHub

For additional help, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
