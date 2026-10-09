# AI Nexus

Welcome to AI Nexus, a premium mobile-first SaaS platform for AI tools.

## Phase 2: Real AI Integration

This project now features a real Node.js backend integrating the Google Gemini API for the Chat Assistant.

### Setup Instructions for Android (Termux)

If you are developing or testing this on an Android phone, you can use **Termux**.

1. **Install Prerequisites in Termux:**
   Open Termux and run:
   ```bash
   pkg update && pkg upgrade
   pkg install nodejs git
   ```

2. **Clone and Install:**
   ```bash
   git clone <your-repo-url>
   cd Ai-Software-
   npm install
   ```

3. **Configure Environment Variables:**
   You need a Google Gemini API key to make the chat work.
   ```bash
   cp .env.example .env
   nano .env
   ```
   *Replace `your_api_key_here` with your actual Gemini API key, save, and exit.*

4. **Start the Server:**
   ```bash
   node server.js
   ```

5. **Test the Application:**
   Open your Android web browser (like Chrome) and navigate to:
   `http://localhost:3000`

   Navigate to the AI Chat view, and you should now be able to talk with the real AI! If you haven't set up your API key, the UI will safely show an error message instructing you to do so.
