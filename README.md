# 💰 Peso - AI-Powered Financial Intelligence Platform

> Your personal finance companion powered by AI, helping you achieve financial stability through intelligent insights and gamification.

[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

---

## 🌟 Features

### 📊 **Financial Intelligence**
- **AI Risk Engine** - Real-time financial risk assessment using ML models
- **Stability Scoring** - Dynamic calculation of your financial health (0-100)
- **Smart Leak Detection** - Automatically identifies spending patterns and money leaks
- **Predictive Analytics** - Forecast your financial runway and stability trends

### 🤖 **AI Coach (BJÖRK)**
- **Interactive Mascot** - Emotional AI companion that responds to your financial state
- **RAG-Powered Insights** - Context-aware financial advice using advanced AI
- **Personalized Guidance** - Tailored recommendations based on your spending habits
- **Mood States** - Visual feedback through mascot emotions (normal, sad, happy)

### 🎮 **Gamification System**
- **Streak Tracking** - Build consistency with daily financial check-ins
- **Achievement Badges** - Unlock rewards for good financial behavior
  - First Win 🏆
  - Stability Starter 💰
  - Leak Hunter 🔍
  - Consistency Hero 🔥
  - Saver Spark ⚡
- **Micro-Savings** - Automated round-up savings with instant gratification
- **Rewards Store** - Unlock premium features through engagement

### 🚨 **Emergency Management**
- **Unexpected Events Tracker** - Log and manage financial shocks
  - Salary delays, medical emergencies, unexpected expenses
- **Recovery Plans** - AI-generated step-by-step recovery strategies
- **30-Day Survival Mode** - Actionable daily and weekly tasks
- **Impact Prediction** - Estimate when stability will return

### 📈 **Expense Management**
- **Smart Categorization** - Automatic expense classification
- **Circular Progress Tracking** - Visual spending vs. budget indicators
- **Fixed vs. Variable Expenses** - Separate tracking for better insights
- **EMI & Subscription Monitoring** - Track recurring payments and debt

### 👤 **User Experience**
- **Seamless Onboarding** - Quick profile setup with financial goal selection
- **Dark Mode Ready** - Modern, clean UI with pastel aesthetics
- **Real-time Sync** - Backend integration with Supabase PostgreSQL
- **Offline Support** - Local data persistence with AsyncStorage

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **State Management:** Zustand
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **Data Fetching:** TanStack Query (React Query)
- **HTTP Client:** Axios
- **Icons:** Lucide React Native
- **Storage:** AsyncStorage

### **Backend**
- **Runtime:** Node.js with Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** JWT with bcrypt
- **Validation:** Zod

### **AI/ML Services**
- **Risk Prediction API:** Custom ML model for financial risk assessment
- **RAG Coach API:** Context-aware AI chatbot for financial guidance

---


## 📱 App Structure

```
Datanyx/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BjorkMascot.tsx  # AI mascot component
│   │   ├── CircularProgress.tsx
│   │   ├── StreakBadge.tsx
│   │   └── ...
│   ├── screens/             # App screens
│   │   ├── Auth/            # Login & Registration
│   │   ├── Home/            # Dashboard
│   │   ├── Coach/           # AI Coach chat
│   │   ├── Leaks/           # Spending leaks
│   │   ├── Emergency/       # Emergency mode
│   │   ├── Achievements/    # Gamification
│   │   └── ...
│   ├── contexts/            # React contexts
│   │   ├── BjorkContext.tsx # Mascot state management
│   │   └── GamificationContext.tsx
│   ├── store/               # Zustand stores
│   ├── services/            # API services
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   └── types/               # TypeScript types
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & validation
│   │   └── config/          # Configuration
│   └── prisma/
│       └── schema.prisma    # Database schema
└── assets/                  # Images, fonts, icons
```

---

## 🔐 Security

- ✅ Environment variables for sensitive data
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma ORM)

---

## 📊 Database Schema

Key models:
- **User** - Authentication and profile
- **Profile** - Onboarding data, gamification stats
- **Transaction** - Income, expenses, EMI, subscriptions
- **Leak** - Detected spending leaks
- **StabilityLog** - Financial health tracking
- **Budget** - Category-wise budgets
- **SavingsGoal** - Financial goals

---

## 🎯 Key Features in Detail

### AI Risk Engine
The app uses a custom ML model to predict financial risk based on:
- Monthly salary and expenses
- EMI count and debt stress
- Savings ratio and financial runway
- Employment type and credit score

### BJÖRK Mascot
An emotional AI companion that:
- Changes mood based on your financial state
- Provides contextual encouragement
- Celebrates achievements
- Warns about overspending

### Gamification
Engagement system featuring:
- Daily streak tracking
- 5 achievement badges
- Micro-savings with round-up
- Rewards store (coming soon)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## � No Contributions Accepted

This is a **closed-source project**. We do **NOT** accept:
- Pull requests
- Feature suggestions
- Bug reports from external parties
- Code contributions of any kind

**Any unsolicited contributions will be rejected and may be considered an attempt to claim ownership of intellectual property.**

---

## 👥 Team

Built with ❤️ by the KisanX team

---

## 🙏 Acknowledgments

- Supabase for database infrastructure
- Expo for React Native tooling
- OpenAI for AI capabilities
- The open-source community

---

**⭐ Star this repo if you find it helpful!**
