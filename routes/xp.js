const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

router.post('/', async (req, res) => {
  const { discord_id, username, xp } = req.body;

  if (!discord_id || !username || typeof xp !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid data.' });
  }

  try {
    const { data, error } = await supabase
      .from('xp_log')
      .insert([{ discord_id, username, xp }]);

    if (error) throw error;

    res.status(200).json({ message: 'XP logged successfully.', data });
  } catch (err) {
    console.error('Error inserting XP log:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;