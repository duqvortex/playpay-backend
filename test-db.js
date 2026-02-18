const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar:', err);
  } else {
    console.log('Conectado com sucesso:', res.rows);
  }
  process.exit();
});
