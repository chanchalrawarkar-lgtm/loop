# LOOP — Customer Feedback Intelligence Platform

LOOP is a customer feedback intelligence platform that helps teams collect,
organize, analyze, and understand customer feedback.

## Features

- User authentication
- Workspace-based feedback management
- Admin / Analyst / Viewer roles
- Manual feedback entry
- CSV feedback upload
- Simulated feedback ingestion
- Feedback inbox
- Search and feedback workflow
- Sentiment analytics
- Feedback channel analytics
- Trends dashboard
- Ask LOOP
- Voice-of-Customer reports
- Workspace-level data isolation
- Responsive modern dashboard

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL
- Neon
- Prisma
- Recharts
- Zod
- Anthropic Claude
- Vercel

## Project Structure

```text
app/
├── api/
├── dashboard/
├── inbox/
├── trends/
├── ask/
├── reports/
├── feedback/
├── settings/
├── login/
├── signup/
└── page.tsx

lib/
├── auth.ts
├── prisma.ts
└── permissions.ts

prisma/
└── schema.prisma