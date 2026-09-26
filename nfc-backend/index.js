const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');
const workshopRouter = require('./Routes/WorkshopRoutes');
const checkinRouter = require("./Routes/CheckinRoutes");

const app = express();
const allowedOrigins = ['http://localhost:8081', 'http://10.136.170.105:8081'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/workshops', workshopRouter);
app.use('/api/checkin', checkinRouter);

app.post('/api/tag-redeemable', async (req, res) => {
  try {
    const { nfc_id, event } = req.body;

    const find = await pool.query(
      `SELECT * FROM nfc_tags_redeemables WHERE tag_id = $1 AND redeemable_name = $2`,
      [nfc_id, event]
    );

    if (find.rows.length > 0) {
      return res.status(409).json({
        msg: 'Hacker already registered for this',
        evidence: find.rows,
      });
    } else {
      const result = await pool.query(
        `INSERT INTO nfc_tags_redeemables VALUES
            ($1, $2)`,
        [nfc_id, event]
      );

      if (result.rowCount == 1) {
        res.status(201).json({ msg: 'Hacker successfully registered' });
      } else {
        throw Error(
          'Hacker is unique but failed to insert into nfc_tags_redeemables'
        );
      }
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ Error: err });
  }
});

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`API running on port ${process.env.PORT}`);
});
