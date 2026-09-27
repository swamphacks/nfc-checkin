const express = require('express');
const cors = require('cors');
require('dotenv').config();
const workshopRouter = require('./Routes/WorkshopRoutes');
const checkinRouter = require('./Routes/CheckinRoutes');
const redeemableRouter = require('./Routes/RedeemableRoutes');

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
app.use('/api/redeemables', redeemableRouter);

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`API running on port ${process.env.PORT}`);
});
