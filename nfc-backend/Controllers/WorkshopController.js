const pool = require('../db');

async function getWorkshops(req, res) {
  try {
    let result = await pool.query(
      `SELECT title as name, id FROM workshops WHERE type = 'workshop'`
    );

    const workshops = result.rows;

    res.status(200).json({ events: workshops });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function getSocials(req, res) {
  try {
    let result = await pool.query(
      `SELECT title as name, id FROM workshops WHERE type = 'social'`
    );

    const workshops = result.rows;

    res.status(200).json({ events: workshops });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function tagToWorkshop(req, res) {
  try {
    const { nfc_id, event_id } = req.body;
    const exists = await pool.query(
      `SELECT * FROM nfc_tags_user WHERE tag_id = $1`,
      [nfc_id]
    );

    if (exists.rows.length == 0) {
      return res.status(401).json({ res: false, msg: 'Tag not registered to a hacker' });
    }

    const find = await pool.query(
      `SELECT * FROM nfc_tags_workshops WHERE tag_id = $1 AND workshop_id = $2`,
      [nfc_id, event_id]
    );

    if (find.rows.length > 0) {
      return res.status(409).json({
        msg: 'Hacker already registered for this',
        evidence: find.rows,
      });
    } else {
      const result = await pool.query(
        `INSERT INTO nfc_tags_workshops (tag_id, workshop_id) VALUES
            ($1, $2)`,
        [nfc_id, event_id]
      );
      //TODO: handle issue where tag isnt registered to user yet but it just crashes rather than return an error
      if (result.rowCount == 1) {
        res
          .status(201)
          .json({ res: true, msg: 'Hacker successfully registered' });
      } else {
        throw Error(
          'Hacker is unique but failed to insert into nfc_tags_workshops'
        );
      }
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ res: false, Error: err?.message });
  }
}

module.exports = {tagToWorkshop, getWorkshops, getSocials}
