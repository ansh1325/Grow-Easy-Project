<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/sparkles.svg" width="60" height="60" alt="Sparkles Icon" />
  <h1 align="center">GrowEasy AI CSV Importer</h1>
  <p align="center">
    An intelligent, AI-powered CSV extraction tool designed to automatically map messy, unstructured data into strict GrowEasy CRM formats using <strong>Google Gemini AI</strong>.
  </p>
  <p align="center">
    <a href="#features"><strong>Features</strong></a> ·
    <a href="#architecture"><strong>Architecture</strong></a> ·
    <a href="#getting-started"><strong>Getting Started</strong></a> ·
    <a href="#evaluation-criteria-met"><strong>Evaluation Checklist</strong></a>
  </p>
  <p align="center">
    🚀 <strong>Live Demo (Frontend):</strong> <a href="https://groweasy-frontend-jl97.onrender.com">https://groweasy-frontend-jl97.onrender.com</a><br>
    ⚙️ <strong>Live API (Backend):</strong> <a href="https://grow-easy-project.onrender.com">https://grow-easy-project.onrender.com</a>
  </p>
</div>

---

## ✨ Features

- **🧠 Intelligent AI Mapping:** Uses `@google/genai` (Gemini API) to dynamically map unknown CSV column names to strict CRM schemas.
- **🚀 Seamless Drag & Drop:** Sleek, modern drag-and-drop interface with local CSV preview parsing using `papaparse` before any server processing.
- **🛡️ Bulletproof Edge Case Handling:** Automatically intercepts API rate limits (429s) and falls back to a graceful rule-based parser so the UI never crashes for the user.
- **📊 Beautiful Data Presentation:** A stunning, responsive Next.js and Tailwind CSS dashboard showing imported vs. skipped records with detailed tabbed tables.
- **⚡ Batch Processing:** The backend intelligently batches records (size: 20) to stay perfectly within AI token limits and prompt constraints.
- **🚫 Smart Record Skipping:** Automatically detects and skips rows lacking crucial contact information (both Email and Mobile) as per strict CRM rules.

## 🏗️ Architecture

The project is structured as a full-stack monolith, split into two primary environments:

- **Frontend (`/frontend`)**: Built with **Next.js 15 (App Router)** and styled heavily with **Tailwind CSS**. Designed for premium aesthetics using micro-animations, glassmorphism, and responsive tables.
- **Backend (`/backend`)**: Built with **Node.js** and **Express**. Handles `multipart/form-data` uploads via `multer`, parses raw CSV strings in memory, and acts as a secure bridge to the **Gemini AI API**.

## 🚀 Getting Started

Follow these steps to run the full-stack application locally.

### Prerequisites
- Node.js (v18+)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 1. Setup Backend
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file and add your Gemini API Key
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env
echo "PORT=5000" >> .env

# Start the Express server
node server.js
```

### 2. Setup Frontend
```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```

Visit `http://localhost:3000` in your browser. Drag and drop any messy CSV file to watch the AI engine organize it!

## 🎯 Evaluation Criteria Met

This submission specifically targets and fulfills the primary evaluation criteria laid out in the assignment:

| Category | Implementation Highlights |
| :--- | :--- |
| **AI Prompt Engineering** | Strict adherence to allowed `crm_status` enum, date normalization logic, and concatenation of extra contact info into `crm_note`. |
| **Backend Quality** | Modular route design, safe in-memory file handling (`multer`), batched API requests, and graceful error fallbacks to prevent rate-limit crashes. |
| **Frontend Quality** | Polished Tailwind CSS UI, smooth loading states, drag-and-drop integration, and paginated/scrollable sticky data tables. |
| **Code Quality** | Clean component separation, stateless Express API, and modern Next.js patterns. |
| **Bonus Features** | ✅ Drag & Drop upload <br> ✅ Progress indicators during AI processing <br> ✅ Elegant Error / Edge Case Handling |

---
<p align="center">
  Built with ❤️ for the GrowEasy Software Developer position.
</p>
