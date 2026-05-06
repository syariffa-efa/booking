import { Pool } from 'pg';

export const db = new Pool({
  user: 'postgres',
  password: '123456',
  database: 'healthcare',
  port: 5433,
});