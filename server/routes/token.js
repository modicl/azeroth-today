const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

let cachedToken = null;
let tokenExpiry = 0;

async function getToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.BLIZZARD_CLIENT_ID;
  const clientSecret = process.env.BLIZZARD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('BLIZZARD_CLIENT_ID and BLIZZARD_CLIENT_SECRET must be set');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://oauth.battle.net/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Blizzard OAuth failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  // Expire 60s before actual expiry to avoid edge cases
  tokenExpiry = now + (data.expires_in - 60) * 1000;
  return cachedToken;
}

router.post('/token', async (req, res) => {
  try {
    const token = await getToken();
    res.json({ access_token: token });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
module.exports.getToken = getToken;
