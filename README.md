# Vidext Challenge - Tldraw Editor

A simple editor application built with Next.js, tldraw, and tRPC.

## Features

- Real-time drawing and editing using tldraw
- Type-safe API calls with tRPC
- Modern UI with TailwindCSS and Shadcn
- Persistent document storage
- Shape modification capabilities
- AI-powered shape generation using OpenAI

## Prerequisites

- Node.js 20.x or later
- OpenAI API Key (for AI shape generation features)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/kreudev/vidext-challenge.git
cd vidext-challenge
```

2. Install dependencies:
```bash
npm install --force
```

3. Set up your environment variables:
Create a `.env.local` file in the root directory and add your OpenAI API key:
```bash
OPENAI_API_KEY=your-api-key-here
```
You can obtain an API key from [OpenAI's Platform](https://platform.openai.com/settings/organization/api-keys)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

The application exposes the following tRPC endpoints:

- `document.getDocument`: Retrieves the current document state
- `document.updateDocument`: Updates the document state

## Features Usage

### AI Shape Generation
The application includes an AI-powered shape generation feature that allows you to create shapes using natural language descriptions. This feature requires a valid OpenAI API key to function.

Example prompts:
- "Create a red star"
- "Make a big blue circle"
- "Draw a small green triangle"

### Testing the API

You can test the API endpoints using the tRPC client in the application. The editor automatically saves changes to the document state.

## Technologies Used

- Next.js
- TailwindCSS
- Shadcn UI
- tRPC
- tldraw
- OpenAI API
