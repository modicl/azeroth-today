const express = require('express');
const fetch = require('node-fetch');
const { getToken } = require('./token');

const router = express.Router();

router.get('/character', async (req, res) => {
  try {
    const token = await getToken();
    const response = await fetch(
      'https://us.api.blizzard.com/profile/wow/character/kelthuzad/jsonparser?namespace=profile-us&locale=en_US',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: `Blizzard API error: ${text}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
