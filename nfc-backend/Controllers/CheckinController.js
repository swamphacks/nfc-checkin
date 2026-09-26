const pool = require('./db');

export async function checkinUser(req, res) {
  let { nfcUuid, userId } = req.body;
  userId = 'fe742efe-dd5d-4f2b-8ef9-6c536e762964';
  if (!nfcUuid || !userId) {
    return res.status(400).json({ error: 'nfcUuid and userId are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO nfc_tags_user (tag_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (tag_id) DO UPDATE SET user_id = EXCLUDED.user_id
       RETURNING *`,
      [nfcUuid, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}
