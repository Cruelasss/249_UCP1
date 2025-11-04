const express = require('express');
const mysql = require('mysql2/promise'); // <-- Menggunakan 'mysql2/promise' untuk async/await
const app = express();
const PORT = 3000; // Gunakan PORT 3000

// KONFIGURASI DATABASE
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Mnbvcxz123.',
  database: 'hollywood',
  port: 3306
});

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.get('/film', async (req, res) => {
  try {
 
    const [results] = await db.query('SELECT * FROM film');
    res.send(results);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send({ message: "Gagal mengambil data film", error: err.message });
  }
});


app.post('/film', async (req, res) => {
  const { Nama_Film, Deskripsi, Sutradara, tahun_terbit, genre } = req.body;

 
  if (!Nama_Film || !Deskripsi || !Sutradara || !tahun_terbit || !genre) {
    return res.status(400).send({ message: 'Nama_Film, Deskripsi, Sutradara, tahun_terbit, genre wajib diisi' });
  }

  try {
    const sql = 'INSERT INTO film (Nama_Film, Deskripsi, Sutradara, tahun_terbit, genre) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, [Nama_Film, Deskripsi, Sutradara, tahun_terbit, genre]);
    

    res.status(201).send({
      message: 'Data film berhasil ditambahkan',
      id: result.insertId,
      ...req.body 
    });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).send({ message: "Gagal menambahkan data film", error: err.message });
  }
});


app.put('/film/:id', async (req, res) => {
  const { id } = req.params;
  const { Nama_Film, Deskripsi, Sutradara, tahun_terbit, genre } = req.body;

  try {
  
    const [rows] = await db.query('SELECT * FROM film WHERE ID = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).send({ message: 'Film tidak ditemukan' });
    }
    
   
    const sql = 'UPDATE film SET Nama_Film = ?, Deskripsi = ?, Sutradara = ?, tahun_terbit = ?, genre = ? WHERE ID = ?';
    await db.query(sql, [Nama_Film, Deskripsi, Sutradara, tahun_terbit, genre, id]);

    res.send({ message: 'Data film berhasil diupdate' });
  } catch (err) {
    console.error('Error updating data:', err);
    res.status(500).send({ message: "Gagal mengupdate data film", error: err.message });
  }
});


app.delete('/film/:id', async (req, res) => {
  const { id } = req.params;

  try {
  
    const [rows] = await db.query('SELECT * FROM film WHERE ID = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).send({ message: 'Film tidak ditemukan' });
    }


    await db.query('DELETE FROM film WHERE ID = ?', [id]);
    
    res.send({ message: 'Data film berhasil dihapus' });
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).send({ message: "Gagal menghapus data film", error: err.message });
  }
});



const startServer = async () => {
  try {
  
    await db.query('SELECT 1');
    console.log('Connection Succesfully!');
    
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });

  } catch (err) {
    console.error('Error connecting to the MySQL:', err.stack);
  }
};

startServer();