const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('XP Relay Online');
});

router.post('/relay-xp', (req, res) => {
  console.log('XP Relay Triggered:', req.body);
  res.status(200).json({ success: true, message: 'XP received' });
});

module.exports = router;
