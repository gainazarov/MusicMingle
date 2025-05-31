import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

// Логирование строки подключения
console.log('DATABASE_URL:', process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL must be set. Did you forget to provision a database?',
  );
}

// Проверка подключения к базе
(async () => {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const client = await pool.connect();
    const result = await client.query('SELECT current_user, session_user, current_database(), inet_server_addr(), inet_server_port(), version()');
    console.log('DB connection info:', result.rows[0]);
    client.release();
  } catch (err) {
    console.error('Ошибка подключения к базе:', err);
    throw err;
  }
})();

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });