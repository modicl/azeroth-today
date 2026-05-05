const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const tokenRouter = require('./routes/token');
const proxyRouter = require('./routes/proxy');
const characterRouter = require('./routes/character');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', tokenRouter);
app.use('/api', proxyRouter);
app.use('/api', characterRouter);

// Serve React build in production
const distPath = path.join(__dirname, 'public');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Azeroth Today server running on port ${PORT}`);
});
