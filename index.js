require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const request = require('request');
const app = express();

const clientID = 'YOUR CLIENT ID HERE';
const clientSecret = 'YOUR CLIENT SECRET HERE';
const redirectURI = 'YOUR REDIRECT URI HERE';

app.use(express.static('static'));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.get('/granted', ({ query: { code } }, res) => {
  console.log('Code : ', code);
  console.log('Status Code : ', res.statusCode);
  get_access_token(code);
});

function get_access_token(code) {
  const options = {
    method: "POST",
    url: "https://webexapis.com/v1/access_token",
    headers: {
       "content-type": "application/x-www-form-urlencoded"
    },
    form: {
       grant_type: "authorization_code",
       client_id: clientID,
       client_secret: clientSecret,
       code: code,
       redirect_uri: redirectURI
    }
 };

 request(options, function (error, response, body) {
  const json = JSON.parse(body);
  if (error) {
    console.log("could not reach Webex cloud to retreive access & refresh tokens");
  }
  console.log("Status Code : ", response.statusCode);
  console.log("OAuth flow completed, fetched tokens: " + JSON.stringify(json));
 });
}

app.listen(3000);
console.log('App listening on port 3000');
