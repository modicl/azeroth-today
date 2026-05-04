# Azeroth Today

A World of Warcraft live event tracker showing active in-game holidays, Mythic+ affixes, and the current season — served from a single Docker container.

## Getting Blizzard API Credentials

1. Go to [https://develop.battle.net](https://develop.battle.net) and log in with your Battle.net account.
2. Click **Create Client** and fill in the form (any redirect URI, e.g. `http://localhost`).
3. Copy the **Client ID** and **Client Secret** from your new client.

## Local Setup (Docker Compose)

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd azeroth-today

# 2. Create your .env file
cp .env.example .env
# Edit .env and fill in BLIZZARD_CLIENT_ID and BLIZZARD_CLIENT_SECRET

# 3. Start both services
docker compose up
```

- React dev server: http://localhost:5173
- Express API: http://localhost:3001

## Local Setup (without Docker)

```bash
# Terminal 1 — server
cd server && npm install
cp ../.env.example ../.env   # fill in credentials
node index.js

# Terminal 2 — client
cd client && npm install
npm run dev
```

Visit http://localhost:5173.

## Production Docker Build

```bash
docker build -t azeroth-today .
docker run -d \
  --name azeroth-today \
  -e BLIZZARD_CLIENT_ID=<your_id> \
  -e BLIZZARD_CLIENT_SECRET=<your_secret> \
  -p 80:3001 \
  --restart unless-stopped \
  azeroth-today
```

## Required GitHub Secrets

Set these in **Settings → Secrets and variables → Actions** in your GitHub repository:

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token (not your password) |
| `EC2_HOST` | Public IP or hostname of your EC2 instance |
| `EC2_USER` | SSH user (e.g. `ec2-user`) |
| `EC2_SSH_KEY` | Private SSH key content for EC2 access |

On your EC2 instance, place a `.env` file at `/home/<EC2_USER>/.env` with your Blizzard credentials.

## Architecture

- **Client** (`client/`): React 18 + Vite. Fetches from `/api/*` relative URLs.
- **Server** (`server/`): Express proxy. Handles Blizzard OAuth2 (client_credentials) server-side; caches the token in memory until near-expiry. In production, also serves the React static build.
- **Docker**: Multi-stage build — stage 1 builds the Vite app, stage 2 runs Express serving both the API and static files.
- **CI/CD**: GitHub Actions builds and pushes to Docker Hub on every push to `main`, then SSH-deploys to EC2.
