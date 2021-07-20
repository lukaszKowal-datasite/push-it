# push-it

Download your Firebase secrets https://firebase.google.com/docs/admin/setup#set-up-project-and-service-account

Place the `secret.json` file in project `root` directory.  

```
npm install
npm run dev
```

Push notification endpoint

```
POST http://localhost:8080/send
```

payload 

```
{
    "token":"bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
    "notification":{
      "title":"Portugal vs. Denmark",
      "body":"great match!"
    },
    // For data transfer notification
     "data":{
      "Nick" : "Mario",
      "body" : "great match!",
      "Room" : "PortugalVSDenmark"
    }
}
```