const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

// Parse JSON
app.use(bodyParser.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Health check
app.get('/', (req, res) => {
  res.send('XP Relay Online');
});

// XP Logging endpoint
app.post('/xp', async (req, res) => {
  const { discord_id, username, xp } = req.body;

  if (!discord_id || !username || typeof xp !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  try {
    const { data, error } = await supabase.from('xp_log').insert([
      {
        discord_id,
        username,
        xp,
      },
    ]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database insert failed' });
    }

    res.json({ message: 'XP logged', data });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Farpy XP Relay running on port ${port}`);
});
