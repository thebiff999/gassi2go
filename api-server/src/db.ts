/* Autor: Dennis Heuermann */

import { Express } from 'express';
import { MongoClient } from 'mongodb';
import { Client } from 'pg';
import { MongoGenericDAO } from './models/mongo-generic.dao';
import { PsqlGenericDAO } from './models/psql-generic.dao';
import { InMemoryGenericDAO } from './models/in-memory-generic.dao';
import { Entry } from './models/entry';
import { Hund } from './models/hunde';
import { User } from './models/user';

export default async function startDB(app: Express, dbms = 'in-memory-db') {
  switch (dbms) {
    case 'mongodb':
      return await startMongoDB(app);
    case 'psql':
      return await startPsql(app);
    default:
      return await startInMemoryDB(app);
  }
}

async function startMongoDB(app: Express) {
  const client = await connectToMongoDB();
  const db = client.db('xyz');
  app.locals.entryDAO = new MongoGenericDAO<Entry>(db, 'entries');
}

async function connectToMongoDB() {
  const url = 'mongodb://localhost:27017';
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: { user: 'mongo', password: 'mongo' },
    authSource: 'entries'
  };
  try {
    return await MongoClient.connect(url, options);
  } catch (err) {
    console.log('Could not connect to MongoDB: ', err.stack);
    process.exit(1);
  }
}

async function startPsql(app: Express) {
  const client = await connectToPsql();
  app.locals.entryDAO = new PsqlGenericDAO<Entry>(client!, 'entries');
  app.locals.hundeDAO = new PsqlGenericDAO<Hund>(client!, 'hunde');
  app.locals.userDAO = new PsqlGenericDAO<User>(client!, 'users');
  return async () => await client.end();
}

async function connectToPsql() {
  const client = new Client({
    user: 'gassi',
    host: '99a7ecc.online-server.cloud',
    database: 'gassi2go',
    password: 'password',
    port: 5432,
    keepAlive: true,
    keepAliveInitialDelayMillis: 1500

  });
  try {
    await client.connect();
    console.log('Succesfully connected to PostgreSQL database');
    return client;
  } catch (err) {
    console.log('Could not connect to PostgreSQL: ', err.stack);
    process.exit(1);
  }
}

async function startInMemoryDB(app: Express) {
  app.locals.entryDAO = new InMemoryGenericDAO<Entry>();
  return async () => Promise.resolve();
}
