// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  // 1. Use the Cloud URL if it exists (Render), otherwise ignore this line
  connectionString: process.env.DATABASE_URL,

  // 2. Fallbacks for Local Development (ignored if connectionString is set)
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'jot_down_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,

  // 3. SSL Logic: ON for Render, OFF for Local
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

module.exports = pool;