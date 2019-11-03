const dbApi    = require('./Database/db.js');
const authApp  = (require('express'))();
const parser   = require('body-parser').json();
const tk       = require('./Authentication/auth.js');

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
                tk.provideToken(body).then( token => {
                    res.end(JSON.stringify({"authenticated": true, "token": token, "nickname": auth.nick }));
                })
                .catch(err => {
                    console.log(err);
                    res.end(JSON.stringify({"text": "There was an error on the server. Check err field.", "authenticated": true, "err": err}));
                });

            else
                res.end(JSON.stringify({"authenticated": false}));

        });

    }

});

authApp.post('/register', (req, res) => {

    if ( !req.headers['content-type'].includes('application/json') )
        res.end('Only ContentType: application/json is allowed.');

    else {

        var body = req.body;
        
        if (!body.timestamp)
            body.timestamp = (new Date).toUTCString();

        dbApi.registerUser(body.usr, body.pwd).then( result => {

            res.end(JSON.stringify(result));

        })
        .catch( err => {
            console.log(err);
            res.end(JSON.stringify({"text": "There was an error on the server. Check err field.", "err": err}));
        });
    }

});


authApp.listen(port, _ => {
    console.log('Server is running at port: ' + port);
});