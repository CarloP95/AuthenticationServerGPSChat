const dbApi    = require('./Database/db.js');
const authApp  = (require('express'))();
const parser   = require('body-parser').json();
const tk       = require('./Authentication/auth.js');
const redisApi = require('./Redis/redis.js');
const uuid     = require('uuid/v4');

const port     = process.env.PORT || 3000;


authApp.use(parser);


/***************
***** GET ******
****************/
authApp.get('/', (req, res) => {
  res.end('You should redirect to /auth');
});


authApp.get('/ping', (req, res) => {
  res.end('Authentication Server is online');
});

authApp.get('/auth', (req, res) => {
  res.end('Will check if user is authenticated');
});

authApp.get('/register', (req, res) => {
  res.end('Do a Post on the same endpoint to register');
});

/***************
***** POST ******
****************/
authApp.post('/', (req, res) => {
  res.end('You are doing something wrong... Make a post to /auth');
});


authApp.post('/auth', (req, res) => {

    if ( !req.headers['content-type'].includes('application/json') )
        res.status(400).end('Only ContentType: application/json is allowed.');

    else {

        var body = req.body;
        
        if (!body.timestamp)
            body.timestamp = (new Date).toUTCString();

        const authenticated = dbApi.authenticateUser(body.usr, body.pwd).then( auth => {


            if (auth.authenticated)
                tk.provideToken(body).then( tokens => {
                    const sessionId = uuid();
                    // real Token is not used.
                    res.end(JSON.stringify({"authenticated": true, "token": tokens["fakeToken"], "nickname": auth.nick, "session-id": sessionId }));
                    redisApi.writeValueInRedis(sessionId, tokens["fakeToken"]);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).end(JSON.stringify({"text": "There was an error on the server. Check err field.", "authenticated": false, "err": err}));
                });

            else
                res.status(404).end(JSON.stringify({"authenticated": false}));

        });

    }

});

authApp.post('/register', (req, res) => {

    if ( !req.headers['content-type'].includes('application/json') )
        res.status(400).end('Only ContentType: application/json is allowed.');

    else {

        var body = req.body;
        
        if (!body.timestamp)
            body.timestamp = (new Date).toUTCString();

        dbApi.registerUser(body.usr, body.pwd, body.nick).then( result => {

            res.end(JSON.stringify(result));

        })
        .catch( err => {
            console.log(err);
            res.status(500).end(JSON.stringify({"text": "There was an error on the server. Check err field.", "err": JSON.stringify(err)}));
        });
    }

});


authApp.listen(port, _ => {
    console.log('Server is running at port: ' + port);
});