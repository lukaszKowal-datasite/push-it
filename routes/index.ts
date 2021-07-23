import express from 'express';
import admin from 'firebase-admin';
import i18next from 'i18next';
import { mongoClient } from '..';
import { NotificationEvent } from '../interfaces/NotificationEvent';

const router = express.Router()

router.post('/push', async (req, res) => {
    // TODO: map it properly
    const notificationEvent: NotificationEvent = req.body;

    await mongoClient.connect()
    const db = mongoClient.db('pushNotificationService')
    const collection = db.collection('userDeviceTokens');

    const userDeviceTokens = await collection.find({ userId: notificationEvent.userId }).toArray();

    if (!userDeviceTokens.length) {
        // probably log it
        return;
    }

    await mongoClient.close();

    const userLanguage = notificationEvent.languageCode ?? 'en';
    await i18next.changeLanguage(userLanguage);

    const deviceTokens = userDeviceTokens.map(dt => dt.token);
        
    let title = '';
    let body = '';
    const data = {};

    const template = notificationEvent.event.template;

    switch (template) {
        case 'QANDA_INSTANT_POST_SUBMITTED_QUESTION':
            title = i18next.t('pns_newQuestion');
            body = i18next.t('pns_qandaPostSubmitted');
        break;
    }

    try {
        const response = await admin.messaging().send({
            notification: {
                title,
                body,
            },
            data,
            token: deviceTokens[0],
        });

        console.log('Successfully sent message:', response);

        res.send('ok')
    } catch (e) {
        console.log('Error sending message:', e);
    }
});

router.put('/token/:tokenId', async (req, res) => {
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
    
    await mongoClient.connect()
    const db = mongoClient.db('pushNotificationService')
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
    
    await mongoClient.close();
    
    res.send('ok');
});
      
router.post('/token', async (req, res) => {
    const { token } = req.body;
    
    if (!token) {
        res.status(422).send('Device token is missing');
        return;
    }
    
    await mongoClient.connect()
    const db = mongoClient.db('pushNotificationService')
    const collection = db.collection('userDeviceTokens');
    await collection.insertOne({
        token,
        userId: null,
    });
    await mongoClient.close();
    
    res.send('ok');
});    

export default router;
