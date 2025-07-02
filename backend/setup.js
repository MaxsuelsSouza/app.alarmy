// setup.js
const pool = require('./database');

async function createTable() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS alarmes (
      id SERIAL PRIMARY KEY,
      horario VARCHAR(10) NOT NULL,
      ativo BOOLEAN DEFAULT true,
      dificuldade INTEGER DEFAULT 1,
      dias TEXT[] DEFAULT ARRAY['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM']
    )
  `);

    // Garantir que a coluna exista em bancos já criados
    await pool.query(`
      ALTER TABLE alarmes
      ADD COLUMN IF NOT EXISTS dias TEXT[] DEFAULT ARRAY['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM']
    `);

    console.log('Tabela criada!');
    process.exit();
}

createTable();
