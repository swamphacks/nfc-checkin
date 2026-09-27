const pool = require('../db');

async function getMeals(req, res) {
  try {
    let result = await pool.query(
      `SELECT name, id, max_user_amount FROM redeemables WHERE type = 'meal'`
    );

    const redeemables = result.rows;

    res.status(200).json({ events: redeemables });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function getTshirts(req, res) {
  try {
    let result = await pool.query(
      `SELECT name, id, max_user_amount FROM redeemables WHERE type = 'tshirt'`
    );

    const redeemables = result.rows;

    res.status(200).json({ events: redeemables });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function tagRedeemable(req, res) {
  try {
    const { nfc_id, event_id } = req.body;

      const result = await pool.query(
        `INSERT INTO nfc_tags_redeemables (tag_id, redeemable_id) VALUES
            ($1, $2)`,
        [nfc_id, event_id]
      );

      if (result.rowCount == 1) {
        res.status(201).json({ msg: 'Hacker successfully registered', res: true});
      } else {
        throw Error(
          'Hacker is unique but failed to insert into nfc_tags_redeemables'
        );
      }

  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Hacker likely not checked in. \n More descript: " + err?.message ?? String(err), res: false});
  }
}

module.exports = {getMeals, getTshirts, tagRedeemable}
