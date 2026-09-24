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
  let { nfcUuid, userId } = req.body;
  userId = "fe742efe-dd5d-4f2b-8ef9-6c536e762964";
  if (!nfcUuid || !userId) {
    return res.status(400).json({ error: "nfcUuid and userId are required" });
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
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/event-names", async (req, res) => {

    try{
        let result = await pool.query(
        `SELECT title FROM workshops
        UNION ALL
        SELECT name || ' redeemable' as Names FROM redeemables`)

        const workshops = result.rows

        result = await pool.query(`SELECT name FROM redeemables`)

        const redeemables = result.rows
        res.status(200).json({workshops: workshops, redeemables: redeemables})
    } catch(err){
        console.error(err)
        res.status(500).json({error: "Database error"})
    }
})

app.post("/api/tag-workshop", async (req, res) => {
    try{
        const { nfc_id, event } = req.body;

        const find = await pool.query(
        `SELECT * FROM nfc_tags_workshops WHERE tag_id = $1 AND workshop_name = $2`,
        [nfc_id, event])

        if(find.rows.length > 0){
            res.status(409).json({msg: "Hacker already registered for this", evidence: find.rows})
        } else {
            const findId = await pool.query(
            `SELECT id FROM workshops where title = $1`,
            [event])
            if (findId.rows.length === 0) {
                return res.status(404).json({ msg: "Workshop not found" });
            }
            const result  = await pool.query(
            `INSERT INTO nfc_tags_workshops (tag_id, workshop_id, workshop_name) VALUES
            ($1, $2, $3)`,
            [nfc_id, findId.rows[0].id, event])
//TODO: handle issue where tag isnt registered to user yet but it just crashes rather than return an error
            if(result.rowCount == 1){
                res.status(201).json({msg: "Hacker successfully registered"})
            } else {
                throw Error("Hacker is unique but failed to insert into nfc_tags_workshops")
            }
        }

    } catch(err){
        console.error(err)
        res.status(400).json({Error: err})
    }
})

app.post("/api/tag-redeemable", async (req, res) => {
    try{
        const { nfc_id, event } = req.body;

        const find = await pool.query(
        `SELECT * FROM nfc_tags_redeemables WHERE tag_id = $1 AND redeemable_name = $2`,
        [nfc_id, event])

        if(find.rows.length > 0){
            res.status(409).json({msg: "Hacker already registered for this", evidence: find.rows})
        } else {
            const result  = await pool.query(
            `INSERT INTO nfc_tags_redeemables VALUES
            ($1, $2)`,
            [nfc_id, event])

            if(result.rowCount == 1){
                res.status(201).json({msg: "Hacker successfully registered"})
            } else {
                throw Error("Hacker is unique but failed to insert into nfc_tags_redeemables")
            }
        }

    } catch(err){
        console.error(err)
        res.status(400).json({Error: err})
    }
})

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`API running on port ${process.env.PORT}`);
});