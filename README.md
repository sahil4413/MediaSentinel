# MediaSentinel - Digital Asset Protection Platform

A production-ready web application for protecting digital sports media assets with AI-powered content fingerprinting and real-time monitoring.

## 🌟 Features

- **Content Fingerprinting**: Generate unique SHA-256 hashes for digital assets
- **Real-time Monitoring**: Track content propagation across social platforms
- **Misuse Detection**: Identify unauthorized usage with instant alerts
- **Analytics Dashboard**: Comprehensive insights with interactive charts
- **Authenticity Verification**: Verify asset ownership with blockchain-style badges
- **Modern UI**: Glassmorphism design with smooth animations

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Node.js + Express (Mock API)
- **File Processing**: Multer, Crypto

## 🏗️ Architecture

```
/frontend (Next.js App)
├── components/          # Reusable UI components
├── features/           # Feature-specific components
├── store/              # Redux store and slices
├── services/           # API services
└── styles/             # Custom styles

/backend (Express Server)
├── routes/             # API routes
├── controllers/        # Route handlers
├── utils/              # Utilities
└── src/server.ts       # Main server file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
Server runs on `http://localhost:3001`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:3000`

## 🎯 Usage

1. **Landing Page**: Introduction and feature overview
2. **Upload Media**: Upload images/videos to generate fingerprints
3. **Asset Tracker**: Monitor content across platforms (simulated)
4. **Misuse Detection**: View and report unauthorized usage
5. **Analytics**: Comprehensive dashboard with charts
6. **Verify Authenticity**: Check asset ownership by hash

## 🔧 API Endpoints

- `POST /upload` - Upload file and generate hash
- `GET /track/:hash` - Get tracking results
- `POST /verify` - Verify hash authenticity

## 🎨 Design System

- **Theme**: Dark with neon purple/cyan accents
- **Typography**: Geist Sans font family
- **Effects**: Glassmorphism, smooth animations
- **Responsive**: Mobile-first design

## 🚫 Constraints

- No database (in-memory state only)
- No external APIs (mock data)
- No authentication system
- Everything runs locally

## 📊 Mock Data

The application uses realistic mock data for:
- Social media platforms
- Detection results
- Analytics metrics
- Random timestamps and confidence scores


## 📝 License

MIT License - See LICENSE file for details.

---

**Built with ❤️ for the Google Solution Challenge**
