const apis     = require('./Database/db.js');
const authApp  = (require('express'))();
const parser   = require('body-parser').json();
const tk       = require('./Authentication/auth.js');

const port     = process.env.PORT || 3000;

authApp.use(parser);


authApp.get('/', (req, res) => {
  res.end('You should redirect to /auth');
});


authApp.get('/auth', (req, res) => {
  res.end('Authentication Server is online');
});


authApp.post('/', (req, res) => {
  res.end('You are doing something wrong... Make a post to /auth');
});


authApp.post('/auth', (req, res) => {

    if ( req.headers['content-type'] != 'application/json')
        res.end('Only ContentType: application/json is allowed.');

    else {

        var body = req.body;
        
        if (!body.timestamp)
            body.timestamp = (new Date).toUTCString();

        const authenticated = apis.authenticateUser(body.usr, body.pwd).then( auth => {


            if (auth.authenticated)
                tk.provideToken(body).then( token => {
                    res.end(JSON.stringify({"authenticated": true, "token": token }));
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


authApp.listen(port, _ => {
    console.log('Server is running at port: ' + port);
});
