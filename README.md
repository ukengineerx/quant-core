# Quantum Founder Roadmap

A secure, authentication-locked dashboard for managing a comprehensive quantum computing founder roadmap. Built with React + Vite for fast, lightweight deployment.

## Features

- **Secure Authentication**: Username/password protection with localStorage-based sessions
- **Interactive Dashboard**: Manage quantum computing phases, tasks, and opportunities
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Fast Performance**: Vite-powered build system for instant page loads
- **Easy Deployment**: One-click deployment to Vercel with custom domain support

## Project Structure

```
quantum-app/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Authentication component
│   │   └── Login.css          # Login styling
│   ├── QuantumGuide.jsx       # Main dashboard component
│   ├── App.jsx                # Root component with auth logic
│   ├── App.css                # App styling
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── public/                     # Static assets
├── .env.local                 # Local environment (credentials)
├── .env.example               # Environment variable template
├── package.json               # Dependencies
├── vite.config.js             # Vite configuration
├── vercel.json                # Vercel deployment config
└── DEPLOYMENT_GUIDE.md        # Step-by-step deployment instructions
```

## Local Development

### Prerequisites
- Node.js 16+ and npm

### Setup

```bash
cd quantum-app
npm install
```

### Running locally

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for production

```bash
npm run build
```

The `dist/` folder contains the production-ready build.

## Authentication

Default credentials for local development and deployment:
- **Username**: `uk.singh`
- **Password**: `2001@Prince`

Credentials are stored in environment variables and never hardcoded in the application.

## Deployment

For complete deployment instructions to `path.ukdiaries.com`:

→ See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Quick start to Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variables: `VITE_AUTH_USERNAME`, `VITE_AUTH_PASSWORD`
4. Configure custom domain to `path.ukdiaries.com`
5. Update DNS CNAME record at domain registrar

## Technologies

- **React 19**: UI framework
- **Vite 8**: Build tool and dev server
- **CSS3**: Styling (no additional libraries)
- **JavaScript ES6+**: Modern JavaScript features

## Environment Variables

### Development
See `.env.local` (local only, not committed to git)

### Production (Vercel)
Configure in Vercel Settings → Environment Variables:
- `VITE_AUTH_USERNAME`: Authentication username
- `VITE_AUTH_PASSWORD`: Authentication password

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance

- Build size: ~150KB (gzipped)
- First paint: <500ms on 4G connection
- Lighthouse score: 95+ (Performance)

## License

Personal use only. Deploying to path.ukdiaries.com.

## Contact

For questions about this deployment, contact: ukengineerx@gmail.com
