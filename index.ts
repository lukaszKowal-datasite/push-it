import express from 'express';
import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from './secret.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount)
});

var app = express();
var port = 8080;

app.use(express.json());

app.listen(port, () => {
  console.log('app started');
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