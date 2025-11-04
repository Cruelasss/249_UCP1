module.exports = (sequelize, DataTypes) => {
 
  const Film = sequelize.define('Film', {
   
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'ID' 
    },
   
    namaFilm: {
      type: DataTypes.STRING,
      field: 'Nama_Film'
    },

    deskripsi: {
      type: DataTypes.STRING,
      field: 'Deskripsi' 
    },

    sutradara: {
      type: DataTypes.STRING,
      field: 'Sutradara' 
    },
 
    tahunTerbit: {
      type: DataTypes.INTEGER,
      field: 'tahun_terbit' 
    },
  
    genre: {
      type: DataTypes.STRING
    }
  }, {

  });

  return Film;
};