# 🌐 Lerri – Your Intelligent Personal Assistant

You can try Lerri at [https://leonardocofone.github.io/LerriAI/](https://leonardocofone.github.io/LerriAI/)  
Lerri is a **website and PWA** that combines artificial intelligence and productivity tools.  
Its goal is to provide a **complete personal assistant** capable of managing daily tasks, emails, calendars, documents, reminders, and notifications — all in one unified platform.

---

## ✨ Vision

Lerri is designed to be a **smart digital assistant** that:

- Organizes your day and appointments  
- Manages calendars, tasks, documents, and emails  
- Communicates naturally in multiple languages  
- Provides a personalized daily briefing with agenda, news, weather, and tasks  

The focus is on helping users **stay organized, productive, and informed**.

---

## 🧩 Project Structure

LerriAI/  
├── backend/                      # Node.js backend + agents and API management  
│   ├── server.js                 # Main Node.js server (API + agent orchestration)  
│   ├── refreshTokens.js          # Script to regenerate access tokens  
│   ├── users.csv                 # Users database + tokens  
│   ├── .env                      # Environment variables and credentials  
│   ├── package.json              # Backend dependencies  
│   ├── ecosystem.config.cjs      # PM2 config to start backend and refreshTokens  
│  
│   ├── data/                     # Users personal data (JSON)  
│   │   └── user@gmail.com.json   # Example user data (tasks, events, settings)  
│  
│   ├── agents/                   # AI agents that handle actions  
│   │   ├── routing-agent.js      # Selects which tool/AI to use  
│   │   ├── jarvis-agent.js       # Executes requested actions (main agent)  
│   │   └── daily-briefing-agent.js # Generates daily briefing  
│  
│   ├── tools/                    # Modules to interface with external services  
│   │   ├── calendar-tool.js  
│   │   ├── tasks-tool.js  
│   │   ├── gmail-tool.js  
│   │   ├── google-calendar-import.js  
│   │   ├── documents-tool.js  
│   │   ├── finance-tool.js  
│   │   ├── sheets-tool.js  
│   │   ├── drive-tool.js  
│   │   ├── news-tool.js  
│   │   ├── weather-tool.js  
│   │   └── index.js  
│ 
│   ├── scheduler/  
│   │   ├── bible.js  
│   │   ├── briefing-scheduler.js  
│   │   └── notification-scheduler.js  
│  
│   ├── prompts/  
│   │   ├── routing-prompt.js  
│   │   ├── jarvis-prompt.js  
│   │   └── briefing-prompt.js  
│  
│   ├── memory/  
│   │   └── conversation-memory.js  
│  
│   ├── tts/  
│   │   └── speech-service.js  
│  
│   └── utils/  
│       ├── model-selector.js  
│       ├── toon-converter.js  
│       ├── userDataService.js  
│       └── user-utils.js  
│  
├── SITO/                         # Frontend / PWA  
│   ├── pwa/  
│   │   ├── index.html  
│   │   ├── app.js  
│   │   ├── schedule-manager.js  
│   │   ├── schedule-manager.css  
│   │   ├── app.css  
│   │   ├── manifest.json  
│   │   ├── sw.js  
│   │   └── icons/  
│   │       ├── icon-192.png  
│   │       └── icon-512.png  
│  
│   ├── login.html  
│   ├── existing.html  
│   ├── onboarding.html  
│   ├── onboarding.css  
│   ├── onboarding.js  
│   ├── gia_registrato.html  
│   ├── PrivacyPolicy.html  
│   ├── Terms_&_Conditions.html  
│   ├── auth.js  
│   ├── style.css  
│   ├── script.js  
│   ├── index.html  
│   └── README.md

---

## 🧠 Features

### 🗓️ Personal organization
Syncs calendars, tasks, and reminders automatically.  
Commands like: “What’s on my schedule today?” or “Add meeting tomorrow at 3 PM.”

### 💌 Smart email
Manages Gmail inbox, prioritizes emails, drafts, and replies automatically.

### 📄 Documents and files
Access and manage Google Drive files or create new ones (docs, sheets, notes).

### 💬 Natural conversation
Responds in multiple languages (Italian, English, Spanish, French, German, Portuguese, Russian, Japanese, Chinese, Arabic).  
Automatically detects the user’s input language.

### ☀️ Daily briefing
Generates a daily summary with agenda, tasks, weather, and news.

### 💰 Finance & productivity
Tracks projects, completed tasks, and expenses. Generates summary reports.

---

## 🧩 Workflow

1. **Login or register** via Google OAuth  
2. Backend creates a personal file in `data/` with user info  
3. Access the **main PWA dashboard**  
4. Chat with Lerri, check schedule, and receive notifications

---

## 🛠️ Technologies

- **Frontend:** HTML, CSS, JavaScript (PWA)  
- **Backend:** Node.js + Express  
- **Database:** Local JSON files  
- **Authentication:** Google OAuth 2.0  
- **Voice:** ElevenLabs + Groq API (TTS/STT)  
- **AI Models:** LLaMA / GPT / Gemini / Cohere (dynamic selection)  
- **Deployment:** PM2  

---

## 🔒 Security & Privacy

All user data is **stored locally** in `backend/data`.  
Each user has a **separate, encrypted file**.  
No data is shared with third parties.

---

## 👤 Author

**Leonardo Cofone**  
AI developer and student, passionate about building **practical, high-quality AI solutions**.

> “AI, not magic.”  
> — *Leonardo Cofone*
