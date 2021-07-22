# push-it

Download your Firebase secrets https://firebase.google.com/docs/admin/setup#set-up-project-and-service-account

Place the `secret.json` file in project `root` directory.  

Create `.env` file and add mongo DB endpoint to `DATABASE_URL=`

```
npm install
npm run dev
```

Store device token:

```
POST localhost:8080/api/v1/token

// payload
{
    "token": "someToken"
}
```

Assign user to device token

```
PUT localhost:8080/api/v1/token/someToken

//payload
{
    "userId": "123"
}
```

Send push notification

```
POST localhost:8080/api/v1/push

// payload
{
    "userId": "123",
    "projectId": "someproject",
    "event": {
        "template": "QANDA_INSTANT_POST_SUBMITTED_QUESTION",
        "templateParams": {}
    }
}
```