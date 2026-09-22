const express = require("express");
const { Pool } = require("pg");
const cors = require('cors');
require("dotenv").config();


const app = express();
const allowedOrigins = [
  'http://localhost:8081',
  'http://10.136.170.105:8081'
];

const corsOptions = {
   origin: function (origin, callback) {
     // Allow requests with no origin (like mobile apps or curl requests)
     if (!origin) return callback(null, true);

     if (allowedOrigins.indexOf(origin) !== -1) {
       callback(null, true);
     } else {
       callback(new Error('Not allowed by CORS'));
     }
   }
 };


app.use(cors(corsOptions))
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.post("/api/nfc-links", async (req, res) => {
    console.log("REACHED")
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

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`API running on port ${process.env.PORT}`);
});