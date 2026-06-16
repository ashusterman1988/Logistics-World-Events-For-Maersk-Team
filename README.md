# Logistics Pulse, live deployment

This folder runs the live version of Logistics Pulse, where the agent does real web search and real Maersk impact analysis. It contains:

```
index.html        the app
api/messages.js   a tiny server that holds your API key and relays requests
README.md         this file
```

## Why a server is needed

The app talks to Anthropic's API. Your API key must never sit in the browser, because anyone could open the page source and steal it. The small function in `api/messages.js` keeps the key on the server. The app calls `/api/messages`, the server adds your key, forwards the request to Anthropic, and returns the result. You do not need to edit any code.

## What you need first

1. An Anthropic API key. Create one at the Anthropic Console (console.anthropic.com) under API Keys. Keep it private.
2. Web search turned on for your account. In the Anthropic Console, open Settings and enable the web search tool. If this is off, the live search will not work and the app will quietly fall back to its built in sample data, showing a small "demo" tag.

## Option A, deploy on Vercel from GitHub (recommended, no terminal)

1. Put this folder in a new GitHub repository. Keep the structure exactly as is, with `index.html` at the top level and `messages.js` inside an `api` folder.
2. Go to vercel.com and sign in with GitHub. Click Add New, then Project, and import your repository.
3. Leave the build settings at their defaults and click Deploy. Vercel serves `index.html` and runs `api/messages.js` automatically. No build step is required.
4. After the first deploy, open the project, go to Settings, then Environment Variables, and add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key
5. Redeploy once so the new variable takes effect (Deployments tab, open the latest, Redeploy).
6. Open the live URL. It should load real current logistics news. Press Enter in the search bar to run a live topic search.

## Option B, deploy on Vercel from your computer (terminal)

1. Install the Vercel CLI: `npm install -g vercel`
2. From inside this folder, run `vercel` and follow the prompts to link a project.
3. Add your key: `vercel env add ANTHROPIC_API_KEY` and paste the value when asked.
4. Deploy to production: `vercel --prod`

## Checking it worked

If the app shows a small orange "demo" tag near the top after deploying, the live calls are not reaching Anthropic. The two usual causes are:

- `ANTHROPIC_API_KEY` is missing or misspelled in the host's environment variables. Re-add it and redeploy.
- Web search is not enabled for your account in the Anthropic Console.

When both are set, the tag disappears and the feed, the impact analysis, and the live topic search all run for real.

## A note on cost

Live runs use Anthropic API credits. The feed load, each article's impact analysis, and each web topic search are separate API calls, and web search has its own per search cost. For a team demo this is small. If you want to cap it, you can lower the number of searches by adding `"max_uses": 3` inside the `web_search` tool object in the app, or limit who has the link.

## Netlify instead of Vercel

Netlify works too. Put the function at `netlify/functions/messages.js` using Netlify's handler format, and set a redirect from `/api/messages` to that function, then add the same `ANTHROPIC_API_KEY` environment variable. Vercel is the simpler path for this exact folder layout.
