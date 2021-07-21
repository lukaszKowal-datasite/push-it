require('dotenv').config();
import express from 'express';
import admin, { ServiceAccount } from 'firebase-admin';
import { MongoClient } from 'mongodb';
import serviceAccount from './secret.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount)
});

const client = new MongoClient(process.env.DATABASE_URL!);

var app = express();
var port = 8080;

app.use(express.json());

app.listen(port, () => {
  console.log('app started');
});

app.put('/token/:tokenId', async (req, res) => {
  const { tokenId } = req.params;
  const { userId } = req.body;

  if (!tokenId) {
    res.status(422).send('Device token is missing');
    return;
  }

  if (!userId) {
    res.status(422).send('User id is missing');
    return;
  }

  await client.connect()
  const db = client.db('pushNotificationService')
  const collection = db.collection('userDeviceTokens');

  const token = await collection.findOne({
    token: tokenId,
  });

  if (!token) {
    res.status(403).send('Invalid device token');
    return;
  }

  await collection.updateOne({
    token: tokenId,
  }, {
    $set: { userId },
  });

  await client.close();
  
  res.send('ok');
});

app.post('/token', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(422).send('Device token is missing');
    return;
  }

  await client.connect()
  const db = client.db('pushNotificationService')
  const collection = db.collection('userDeviceTokens');
  await collection.insertOne({
    token,
    userId: null,
  });
  await client.close();

  res.send('ok');
});

app.post('/push', async (req, res) => {
    const { to, notification, data } = req.body;

    try {
      const response = await admin.messaging().send({
        notification,
        data,
        token: to,
      });

      console.log('Successfully sent message:', response);

      res.send('ok')
    } catch (e) {
      console.log('Error sending message:', e);
    }
});