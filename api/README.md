# CodeLens API Server

Next.js 16 API server for CodeLens AI features.

## Setup

1. Install dependencies:
```bash
cd api
npm install
```

2. Copy environment variables:
```bash
cp .env.local.example .env.local
```

3. Fill in your environment variables in `.env.local`:
   - `GOOGLE_GEMINI_API_KEY` - Your Google Gemini API key
   - `CLERK_SECRET_KEY` - Clerk secret key for backend auth
   - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` - Supabase credentials

4. Run the development server:
```bash
npm run dev
```

The API server will run on `http://localhost:3000`

## API Routes

- `POST /api/v1/summary` - Generate AI code summary
- `POST /api/v1/generate` - Generate code from prompt
- `POST /api/v1/analyze` - Analyze code for issues
- `GET /api/v1/reviews/history` - Get review history

