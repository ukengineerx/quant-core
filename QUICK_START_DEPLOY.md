# Quick Start: Deploy to path.ukdiaries.com in 5 Minutes

Follow these steps to deploy the Quantum Founder Roadmap to your custom domain.

## Step 1: GitHub (2 minutes)

```bash
cd /Users/uksingh/Workspace/lab/path/quantum-app

# Initialize Git if not already done
git init
git add .
git commit -m "Quantum app: Initial commit"

# Create repository at github.com and run:
git remote add origin https://github.com/YOUR_USERNAME/quantum-app.git
git branch -M main
git push -u origin main
```

## Step 2: Vercel (2 minutes)

1. Visit [vercel.com/new](https://vercel.com/new)
2. Click "Import GitHub Repository"
3. Select `quantum-app` repo
4. Framework: Select "Vite" (auto-detected)
5. Click "Deploy"

## Step 3: Environment Variables (1 minute)

In Vercel Dashboard, go to **Settings → Environment Variables**:

| Name | Value |
|------|-------|
| `VITE_AUTH_USERNAME` | `uk.singh` |
| `VITE_AUTH_PASSWORD` | `2001@Prince` |

Click "Add" for each, then "Save".

**Then:** Go to **Deployments** → Click latest → **Redeploy** (forces rebuild with env vars)

## Step 4: Domain Configuration (immediate, but DNS takes 24-48 hours)

### In Vercel

1. **Settings → Domains**
2. Click "Add Domain"
3. Enter: `path.ukdiaries.com`
4. Copy the CNAME value Vercel shows

### At your domain registrar

1. Log into where ukdiaries.com is registered
2. Go to DNS settings
3. Add a CNAME record:
   - **Name:** `path`
   - **Value:** `cname.vercel.com` (or what Vercel provided)
   - **TTL:** 3600 (or auto)
4. Save

## Step 5: Verify Deployment

After DNS propagates (24-48 hours):

- Visit `https://path.ukdiaries.com`
- Login with: `uk.singh` / `2001@Prince`
- Browse quantum roadmap
- Test logout → login again

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Login doesn't work | Check env vars are saved in Vercel + redeploy |
| Domain not working | DNS takes 24-48h. Check CNAME in registrar is correct |
| Build fails | Check Vercel "Deployments" logs. Verify env vars exist |
| Old page loading | Clear cache: Ctrl+Shift+Delete (Chrome) or Cmd+Shift+Delete (Safari) |

## What You're Deploying

- **React** frontend with auth
- **Quantum guide** dashboard (interactive)
- **Auto HTTPS** (Vercel handles SSL)
- **Fast CDN** (global distribution)

## Next Steps (Optional)

- Set up GitHub Actions for auto-testing
- Add analytics in Vercel
- Monitor performance in Vercel Analytics tab

## Support

- Full guide: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Questions: ukengineerx@gmail.com
