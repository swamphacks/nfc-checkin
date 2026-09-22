const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();


const app = express();

app.use(cors(""))
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.post("/api/nfc-links", async (req, res) => {
  const { nfcUuid, userId } = req.body;
  if (!nfcUuid || !userId) {
    return res.status(400).json({ error: "nfcUuid and userId are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO nfc_tags_user (tag_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (nfc_uuid) DO UPDATE SET user_id = EXCLUDED.user_id
       RETURNING *`,
      [nfcUuid, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`API running on port ${process.env.PORT}`);
});