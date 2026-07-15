# BaymaxCare - Medical AI Platform

## 🏥 Overview

BaymaxCare is a medical AI platform that combines artificial intelligence with traditional Ayurvedic medicine to provide comprehensive healthcare solutions. Built with Next.js 14 and powered by Google Gemini, it offers real-time medical consultation, visual diagnosis, and emergency response capabilities.

## 🚀 Key Features

- **AI-Powered Chat**: Conversational AI for medical consultations
- **Visual Diagnosis**: Image-based diagnosis using AI
- **Emergency Response**: Critical symptom detection
- **Health Analytics**: Health data analysis and tracking
- **Telemedicine**: Consultations with healthcare professionals
- **Health Goals Tracker**: Set and track personalized health goals
- **Prescription Management**: Medication tracking and reminders
- **Ayurvedic Integration**: Traditional medicine recommendations

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **AI Integration**: Google Gemini API
- **Authentication**: In-memory user store (no database required)

## ⚡ Quick Start

### Prerequisites

- **Node.js 18 or higher** ([Download here](https://nodejs.org/))
- **Google Gemini API Key** ([Get free key here](https://aistudio.google.com/app/apikey))

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd Baymax-health-assistant-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   
   Create a file named `.env.local` in the root directory and add:
   ```env
   GEMINI_API_KEY=your-gemini-api-key-here
   ```
   
   **To get your Gemini API Key:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Get API Key"
   - Create a new API key
   - Copy the key and paste it in `.env.local`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Register a new account
   - Start using the app!

## 📝 Important Notes

- **No Database Required**: The app uses in-memory storage for user accounts
- **User Data**: Data is stored in memory during the session (lost when server restarts)
- **API Key**: Google Gemini API key is required for AI features to work

## 🔧 Troubleshooting

**Port already in use?**
- The app runs on port 3000 by default
- Make sure no other application is using port 3000
- Or change the port: `npm run dev -- -p 3001`

**Module not found errors?**
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again

**API errors?**
- Make sure your `.env.local` file exists in the root directory
- Verify your Gemini API key is correct
- Check that the API key is properly set in `.env.local`

## 📚 Project Structure

```
├── app/                 # Next.js app router pages and API routes
├── components/          # React components
├── lib/                 # Utility functions and stores
├── public/              # Static assets (if any)
├── .env.local          # Environment variables (create this)
├── package.json        # Dependencies
└── README.md           # This file
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

---

**Made with ❤️ for better healthcare**
