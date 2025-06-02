# Gracelink Chat 🚀

A modern, interactive, and dark-themed AI chatbot application powered by Google's Gemini API. Built with React 19, TypeScript, and Tailwind CSS, this application runs directly in the browser using ESM modules, providing a seamless user experience for real-time conversations with an advanced AI model.
## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [How to Use](#how-to-use)
- [API Key Configuration](#api-key-configuration)
- [Deployment](#deployment)
- [Customization (For Developers)](#customization-for-developers)
- [Acknowledgements](#acknowledgements)

## Overview

This Gemini Chatbot offers a user-friendly interface for interacting with Google's cutting-edge Gemini large language models. Users can provide their own Gemini API key to initiate conversations. The application features a responsive, multi-column layout with a focus on aesthetics and usability, including a dark theme, dynamic UI elements, and easy message management.

The project is designed to be lightweight and easy to run, leveraging modern web technologies like ESM modules (via `esm.sh`) and Tailwind CSS (via CDN) to minimize setup complexity.

## Features

✨ **Real-time AI Interaction:** Engage in dynamic conversations with the Gemini API.
🔑 **User-Provided API Key:** Securely use your own Gemini API key, prompted at the start.
🎨 **Modern Dark Theme UI:** Sleek, multi-column interface with a sophisticated dark aesthetic.
    -   Thin (5px) left branding strip.
    -   20px tall top accent bar.
    -   Central chat interaction area.
    -   Toggleable right sidebar for chat details.
📱 **Responsive Design:** Adapts to various screen sizes (inherent from Tailwind CSS usage).
💬 **Interactive Chat Elements:**
    -   AI responses styled like code blocks (monospace font).
    -   Copy button for AI messages with visual feedback.
    -   "More options" placeholder on AI messages.
    -   Timestamp on each message.
    -   Dynamic send button that changes to an 'X' (clear) icon when the input is empty.
🔄 **Loading & Error States:** Visual feedback for loading responses and clear error messages.
🧹 **Clear Chat Functionality:** Easily clear the current conversation.
📊 **Chat Details Sidebar:** View message count and API key status.
📜 **Scrollable Chat History:** Smooth scrolling for longer conversations.
🚀 **Lightweight & Fast:** Runs directly in the browser with minimal overhead.

## Tech Stack

*   **Frontend Library:** [React 19](https://react.dev/) (via `esm.sh`)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (via CDN)
*   **AI Integration:** [Google Gemini API (`@google/genai`)](https://ai.google.dev/docs) (via `esm.sh`, using model `gemini-2.5-flash-preview-04-17`)
*   **Module System:** ES Modules (ESM) directly in the browser

## Project Structure

```
.
├── components/
│   ├── ChatInput.tsx         # Component for user text input and send button
│   ├── ChatMessageItem.tsx   # Component to display a single chat message
│   └── LoadingSpinner.tsx    # SVG loading spinner component
├── services/
│   └── geminiService.ts      # Logic for initializing and interacting with Gemini API
├── App.tsx                   # Main application component (layout, state, logic)
├── index.html                # HTML entry point, loads CSS, JS, and sets up import map
├── index.tsx                 # React application root, mounts App component
├── metadata.json             # Application metadata (name, description)
└── types.ts                  # Global TypeScript types and enums (Message, Sender)
```

## Getting Started

### Prerequisites

*   A modern web browser that supports ES Modules (e.g., Chrome, Firefox, Edge, Safari).
*   A Google Gemini API Key. You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).
*   (Optional, for development) [Node.js](https://nodejs.org/) and npm/yarn if you plan to modify the code extensively or set up a local development server with more features.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/gemini-chatbot.git
    cd gemini-chatbot
    ```
    (Replace `your-username/gemini-chatbot` with the actual repository URL)

### Running the Application

This application is designed to run directly from the `index.html` file in your browser, thanks to the use of a CDN for Tailwind CSS and `esm.sh` for React and `@google/genai`.

1.  **Open `index.html`:**
    *   Navigate to the project directory in your file explorer.
    *   Double-click the `index.html` file to open it in your default web browser.

2.  **Using a Local Server (Recommended for Development):**
    For a better development experience (e.g., to avoid potential CORS issues with some browser configurations or for features like hot reloading if you integrate a build system later), you can use a simple HTTP server.
    *   If you have Node.js installed, you can use `npx serve`:
        ```bash
        npx serve .
        ```
        This will typically start a server on `http://localhost:3000`.
    *   Alternatively, many code editors like VS Code have extensions (e.g., "Live Server") that can serve the `index.html` file.

## How to Use

1.  **Launch the App:** Open `index.html` in your browser or navigate to the deployed URL.
2.  **Enter API Key:** Upon launching, the chatbot will prompt you to "Enter your Gemini API Key here...".
    *   Paste your Google Gemini API key into the input field.
    *   Press Enter or click the Send button.
3.  **Confirmation:**
    *   If the API key is valid and the client initializes successfully, you'll receive a confirmation message: "Thank you! Your API Key has been set. How can I help you today?"
    *   If there's an issue, an error message will be displayed.
4.  **Chat with Gemini:** Once the API key is set, you can type your messages into the input field and press Enter or click Send to get responses from the AI.
5.  **Features:**
    *   **Copy AI Messages:** Hover over an AI's message bubble to reveal a copy icon. Click it to copy the message text to your clipboard.
    *   **Clear Chat:** Use the "Clear Chat" button in the right sidebar to remove all messages from the current session.
    *   **Toggle Sidebar:** Click the chevron icon in the top-right of the central chat area to show or hide the "Chat Details" sidebar.

## API Key Configuration

The Google Gemini API key is essential for the application to function.

*   **Client-Side Handling:** The API key is entered by the user directly into the application.
*   **Initialization:** The `initializeGeminiClient` function in `services/geminiService.ts` is responsible for taking this key and setting up the `@google/genai` client.
*   **Storage:** The API key is stored in the React component's state (`App.tsx`) for the duration of the session. It is **not** persisted in local storage or cookies by default in this version. Reloading the page will require re-entering the API key.
*   **Security Note:** Since the API key is handled client-side, ensure you are comfortable with this approach for your use case. For applications requiring higher security for a shared API key, a backend proxy would be recommended.

## Deployment

This application, being a static site (HTML, CSS, JS running client-side), can be easily deployed for free on various platforms:

1.  **GitHub Pages:**
    *   Build your React app (if you were using a build system like Create React App or Vite, you'd run `npm run build`). For this current setup, your existing files are already the "build."
    *   Push the project files to a GitHub repository.
    *   In your repository settings, go to "Pages" and configure it to deploy from your `main` branch (usually from the `/` (root) or `/docs` folder).
2.  **Vercel:** Connect your GitHub repository to Vercel. It will typically auto-detect the framework (or you can configure it as a static site) and deploy it.
3.  **Netlify:** Similar to Vercel, connect your Git repository, and Netlify will build and deploy your site.
4.  **Cloudflare Pages:** Offers robust static site hosting with direct Git integration.

For this project in its current state (no build step, direct ESM imports), you can usually just upload the existing files directly to these static hosting providers.

## Customization (For Developers)

*   **Changing AI Model:** The Gemini model is specified in `services/geminiService.ts` (currently `'gemini-2.5-flash-preview-04-17'`). You can change this to other compatible Gemini models as needed.
*   **Styling:** All styling is done using Tailwind CSS classes directly in the `.tsx` components and `index.html`. You can modify these classes to change the appearance. Consult the [Tailwind CSS Documentation](https://tailwindcss.com/docs).
*   **Adding Features:** Extend components in the `components/` directory or add new ones. Modify state management and API interactions in `App.tsx` and `services/geminiService.ts`.

## Acknowledgements

*   [Google Gemini API](https://ai.google.dev/): For the powerful AI capabilities.
*   [React](https://react.dev/): For the robust frontend library.
*   [Tailwind CSS](https://tailwindcss.com/): For the utility-first CSS framework.
*   [TypeScript](https://www.typescriptlang.org/): For static typing and improved developer experience.
*   [esm.sh](https://esm.sh/): For providing ES Module CDN access to npm packages.
