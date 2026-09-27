const pool = require('../db');

async function checkinUser(req, res) {


  try {
      let { nfc_id, event_id } = req.body;
      const user_id = event_id //just to better understand

      event_id = 'fe742efe-dd5d-4f2b-8ef9-6c536e762964';
      if (!nfc_id || !event_id) {
        return res.status(400).json({ error: 'nfc_id and event_id are required' });
      }
    const result = await pool.query(
      `INSERT INTO nfc_tags_user (tag_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (tag_id) DO NOTHING
       RETURNING *`,
      [nfc_id, event_id]
    );
    if(result.rows.length > 0){
        res.status(201).json({res: true, msg: "Checked in hacker"});

    } else {
    res.status(409).json({res: false, msg: "failed to check in hacker. Tag likely used or hacker already checked in"})}
  } catch (err) {
    console.error(err);
    res.status(500).json({ res: false, msg: "Likely db error. \n More descript: " + err?.message });
  }
}

module.exports = {checkinUser}
