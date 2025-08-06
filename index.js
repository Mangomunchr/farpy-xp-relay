require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.post('/xp', async (req, res) => {
  try {
    const { discord_id, username, xp } = req.body;

    if (!discord_id || !username || typeof xp !== 'number') {
      return res.status(400).json({ error: 'Missing or invalid fields.' });
    }

    const { data, error } = await supabase
      .from('xp_log')
      .insert([{ discord_id, username, xp }]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Supabase insert failed.' });
    }

    res.status(200).json({ message: 'XP logged successfully.', data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`XP relay server running on port ${PORT}`);
});
