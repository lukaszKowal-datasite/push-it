require('dotenv').config();
import express from 'express';
import admin, { ServiceAccount } from 'firebase-admin';
import { MongoClient } from 'mongodb';
import serviceAccount from './secret.json';
import routes from './routes';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount)
});

export const mongoClient = new MongoClient(process.env.DATABASE_URL!);

var app = express();
var port = 8080;

app.use(express.json());
app.use('/api/v1/', routes)

app.listen(port, () => {
  console.log('app started');
});
