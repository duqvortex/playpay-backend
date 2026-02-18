const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:Pardallapada%4032@db.uzirzutnxyxmdxgitqix.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
