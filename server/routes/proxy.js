const express = require('express');
const fetch = require('node-fetch');
const { getToken } = require('./token');

const router = express.Router();

async function blizzardGet(url, res) {
  try {
    const token = await getToken();
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: `Blizzard API error: ${text}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}

router.get('/events', (req, res) => {
  // The Blizzard API does not have a general active events endpoint.
  // Returning an empty array so the frontend gracefully shows "No active in-game events found."
  res.json({ events: [] });
});

router.get('/mythic-keystone/affix/index', async (req, res) => {
  try {
    const response = await fetch('https://raider.io/api/v1/mythic-plus/affixes?region=us&locale=en');
    if (!response.ok) {
      throw new Error(`Raider.IO error: ${response.status}`);
    }
    const data = await response.json();
    res.json({
      season: { name: data.title },
      affixes: data.affix_details.map(a => ({
        name: a.name,
        description: a.description
      }))
    });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
