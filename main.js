require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3');
const {open} = require('sqlite'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const dbPromise = open({
  filename: 'voters.db',
  driver: sqlite3.Database,
});

dbPromise.then(db => {
  db.run(`CREATE TABLE IF NOT EXISTS voters (id varchar(255) UNIQUE, registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
});

app.post('/register-vote', async (req, res) => {
  if (req.body.key != process.env.KEY) {
    res.status(401).send(JSON.stringify({message: 'Ustaw poprawny klucz'}));
    return;
  }

  const voterId = req.body.voterId;

  try {
    const db = await dbPromise;
    await db.run(`INSERT INTO voters (id) VALUES (?)`, voterId);

    res.send(JSON.stringify({message: `Identyfikator ${voterId} został zarejestrowany pomyślnie`}));
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      const db = await dbPromise;
      const {registered_at} = await db.get(`SELECT registered_at FROM voters WHERE id = ?`, voterId);
      res.status(409).send(JSON.stringify({message: `Identyfikator ${voterId} był już rejestrowany ${registered_at} (UTC)`}));
    } else {
      res.status(500).send(JSON.stringify({message: `Wystąpił błąd podczas rejestrowania identyfikatora ${voterId}`, error: error.message}));
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://0.0.0.0:${port}`);
});
