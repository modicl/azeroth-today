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
  blizzardGet(
    'https://us.api.blizzard.com/data/wow/event/index?namespace=dynamic-us&locale=en_US',
    res
  );
});

router.get('/mythic-keystone/affix/index', (req, res) => {
  blizzardGet(
    'https://us.api.blizzard.com/data/wow/keystone-affix/index?namespace=static-us&locale=en_US',
    res
  );
});

module.exports = router;
