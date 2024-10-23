const express = require('express');
const bodyParser = require('body-parser');
const db = require('./dbConfig');  

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get('/kbbi/:kata', (req, res) => {
  const kata = req.params.kata;

  const query = 'SELECT arti FROM dictionary WHERE word = ?';
  db.query(query, [kata], (err, results) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.length > 0) {
      res.json({ kata, makna: results[0].arti });
    } else {
      res.status(404).json({ error: 'Kata tidak ditemukan' });
    }
  });
});


app.post('/kbbi', (req, res) => {
  const { kata, arti, type } = req.body;

  if (!kata || !arti || !type) {
    return res.status(400).json({ error: 'Kata, arti, dan tipe diperlukan' });
  }

  const insertQuery = 'INSERT INTO dictionary (word, arti, type) VALUES (?, ?, ?)';
  db.query(insertQuery, [kata, arti, type], (err, results) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Gagal menambah kata' });
    } else {
      res.status(201).json({ message: 'Kata berhasil ditambahkan', kataId: results.insertId });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
