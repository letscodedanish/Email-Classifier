This is a [Next.js](https://nextjs.org/)

## What it does
a web application that allows users to log in using Google OAuth, fetch their last X emails from Gmail, and classify them into different categories using OpenAI GPT-4o.
-User Authentication: Allow users to log in using Google OAuth.

-Fetch Emails: Fetch the user's emails from Gmail using the Gmail API.

-Classify Emails: Use OpenAI GPT to classify emails into important, Promotional, social, marketing, and spam categories.

Note: For classifying the emails we are using OpenAI api but the twist is its not working for classification, some function of it are not being supported So I directly made the axios request to 3.5gpt-turbp endpoint.
While deploying this app it is facing some build issues, I'll be fixing it in some time, I tends to use CloudFlare Workers(hono.js) for it.
If some want to fix some issues while Classifying the emails feel free to Contrinute.

## Tech Stack
Frontend: Used Next.js with TypeScript and Tailwind, or any CSS framework of your choice
Backend: Framework’s API routes or separate backend using Express.js, Koa, or Feather.js. and Langchain.js
Authentication: Use Google OAuth for user authentication.
API Integration: Integrate with the Gmail API to fetch emails and OpenAI GPT for email classification.


## What I aim to use in future(Tech Integration)
- Turborepo
- Cloudflare Workers(hono.js)
- Rate Limiting
- Docker
- Postgess as database(with connection pooling)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building and Running the Docker Container

Build the Docker Image:
```bash
docker build -t email-classifier.
```

Run the Docker Container:
```bash
docker run -p 3000:3000 email-classifier
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
