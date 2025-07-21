# CrankSmith

**The ultimate free bike gear calculator and compatibility checker.**

CrankSmith is a comprehensive bike optimization tool that helps cyclists calculate gear ratios, check component compatibility, and optimize their bike setup. No email signup required - just start using it immediately!

## Features

- **Gear Ratio Calculator**: Calculate and compare gear ratios for different drivetrain setups
- **Component Compatibility**: Check if your components work together before you buy
- **Performance Analysis**: Visualize speed ranges, gear progression, and optimal cadence
- **Bike Fit Calculator**: Get personalized bike fit recommendations based on your measurements
- **Tire Pressure Calculator**: Find the perfect tire pressure for your weight and terrain
- **Riley AI Assistant**: Get personalized advice from your AI bike expert
- **Mobile Optimized**: Full PWA support with offline capabilities
- **Free Access**: No email required, no subscriptions, just the best bike tools

## How to Use

1. Visit [cranksmith.com](https://cranksmith.com)
2. Start using the gear calculator immediately
3. Compare your current setup with potential upgrades
4. Get instant compatibility feedback
5. Use the bike fit calculator for personalized recommendations
6. Optimize your bike setup with confidence

## Technology

Built with Next.js, React, TypeScript, and modern web technologies for the best user experience across all devices. Features include:

- **Progressive Web App (PWA)**: Install on mobile devices for app-like experience
- **Offline Support**: Core features work without internet connection
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Real-time Calculations**: Instant gear ratio and compatibility feedback
- **AI Integration**: Riley AI assistant for personalized advice

## Development

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Key Technologies

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts for data visualization
- **AI**: Custom Riley AI integration
- **PWA**: Service worker for offline functionality

## About

CrankSmith was created by cyclists, for cyclists. We believe the best bike tools should be free and accessible to everyone, whether you're a weekend warrior or a bike shop professional.

## Support

Have questions or feedback? 
- Email: mike@cranksmith.com
- Follow us: [@cranksmithapp](https://instagram.com/cranksmithapp)

---

*Made with ❤️ by cyclists who got tired of bad calculators.*

# App Store / Production Release

This branch is dedicated to preparing the CrankSmith mobile app for app store submission. Follow these steps to ensure a clean, production-ready build:

## 1. Environment Variables
- Ensure all secrets and API keys are set in a `.env.production` file (never commit secrets to the repo).
- Required variables (see codebase for usage):
  - `ZOHO_EMAIL`, `ZOHO_PASSWORD`, `ADMIN_EMAIL`
  - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
  - `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_ANTHROPIC_API_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Build for Production
```bash
npm install
npm run build
```
- Use `npm run start` to test the production build locally.

## 3. PWA & Mobile Checks
- Confirm `public/manifest.json` is up to date (name, icons, screenshots, etc.).
- Confirm service worker (`public/sw.js` or `public/sw-enhanced.js`) is registered and working for offline support.
- Test installability on Android/iOS (PWA) and ensure all icons/screenshots are correct.

## 4. Clean Up
- Remove any debug/test code or dev-only dependencies.
- Ensure `.gitignore` excludes all sensitive and dev files.

## 5. Tag the Release
```bash
git tag v1.0.0-appstore
```

## 6. Submit to App Store
- Follow platform-specific instructions for PWA or wrapper submission (see app store docs).

---
