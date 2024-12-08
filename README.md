# AI Content Generator

A web application that generates AI-powered images and videos from text prompts using Pollinations AI.

## Features

- User authentication
- AI image generation using Pollinations AI
- AI video generation
- Content management
- Notification system
- Gallery view for generated content

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
JWT_SECRET=your-secret-key-change-in-production
PORT=3000
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
- http://localhost:3000

## Project Structure

```
.
├── public/                 # Static files
│   ├── index.html         # Main HTML file
│   └── js/                # Client-side JavaScript
├── src/
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/           # Database models
│   ├── routes/           # Express routes
│   ├── services/         # Business logic
│   └── server.js         # Express app entry point
└── package.json          # Project dependencies
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login and get JWT token

### Content
- POST `/api/content/generate` - Generate new content
- GET `/api/content/user` - Get user's content

## Generated Content

All generated content is stored in the `generated_content` directory, organized by user ID:

```
generated_content/
└── user_id/
    ├── images/
    │   └── image_*.png
    └── videos/
        └── video_*.mp4
```