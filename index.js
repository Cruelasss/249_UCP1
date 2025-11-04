const express = require('express');
let mysql = require('mysql2');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mnbvcxz123.',
  database: 'hollywood',
  port:`3306`
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the MySQL:', err.stack);
    return;
  }
  console.log('Connection Succesfully!');
});

app.get('/film', (req, res) => {
  db.query('SELECT * FROM film', (err, results) => {
    if (err) {
        console.error('Error fetching data:', err.stack);
        res.status(500).send('Error fetching data');
        return;
    }
    res.json(results);
  });
});

app.post('/api/film', (req, res) => {
  const { Nama_Film, Deskripsi, Sutradara,tahun_terbit, genre } = req.body; 

    if (!Nama_Film || !Deskripsi || !Sutradara || !tahun_terbit || !genre) {    
        return res.status(400).json({massage:'Nama_Film, Deskripsi, Sutradara,tahun_terbit, genre wajib diisi'});   
    }

    db.query('INSERT INTO film (Nama_Film, Deskripsi, Sutradara,tahun_terbit, genre) VALUES (?, ?, ?, ?, ?)', 
        [Nama_Film, Deskripsi, Sutradara, tahun_terbit, genre], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err.stack);
            return res.status(500).json({massage:'Error inserting data'});
        }   
        res.status(201).json({massage:'Data film berhasil ditambahkan', id: result.insertId});
    });

});

app.put('/api/film/:id', (req, res) => {
    const filmId = req.params.id;
    const { Nama_Film, Deskripsi, Sutradara,tahun_terbit, genre } = req.body;
    db.query('UPDATE film SET Nama_Film = ?, Deskripsi = ?, Sutradara = ?, tahun_terbit = ?, genre = ? WHERE id = ?', 
    [Nama_Film, Deskripsi, Sutradara, tahun_terbit, genre, filmId], (err, result) => {
        if (err) {  
                console.error(err);
                return res.status(500).json({massage:'Database error'});
        }   
        res.json({massage:'Data film berhasil diupdate'});
    }
    );
});

app.delete('/api/film/:id', (req, res) => {
    const filmId = req.params.id;   
    db.query('DELETE FROM film WHERE id = ?', [filmId], (err, result) => {
        if (err) {  
                console.error(err);
                return res.status(500).json({massage:'Database error'});
        }   

        res.json({massage:'Data film berhasil dihapus'});
    }   
    );      
}); 


