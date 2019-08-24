const apis     = require('./Database/db.js');
const authApp  = (require('express'))();
const parser   = require('body-parser').json();

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

    const body = req.body;

    const authenticated = apis.authenticateUser(body.usr, body.pwd).then( auth => {

      if (auth.authenticated)
        res.end(`You have been correctly authenticated.`);
      else
        res.end(`You are not registered.`);

    });

  }

});

authApp.listen(port, _ => {
  console.log('Server is running at port: ' + port);
});
