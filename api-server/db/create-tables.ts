import pg from 'pg';
import config from '../config.json';

const { Client } = pg;

const client = new Client({
  user: config.db.connect.user,
  host: config.db.connect.host,
  database: config.db.connect.database,
  password: config.db.connect.password,
  port: config.db.connect.port.psql
});

async function createScheme() {
  await client.connect();
  await client.query('DROP TABLE IF EXISTS users');
  await client.query(`CREATE TABLE users(
    id VARCHAR(40) PRIMARY KEY,
    "createdAt" bigint NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(30))`);
}

createScheme().then(() => {
  client.end();
  console.log('finished');
});
