require('dotenv').config()
var clientId = process.env.GOOGLE_CLIENT_ID

//For ID Token
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(clientId)
const verifyGoogleIDToken = async (req, res, next) => {
  const token = req.header('id-token')
  console.log(token)
  console.log(process.env.GOOGLE_CLIENT_ID_ANDROID)
  console.log(client)

  const ticket = await client
    .verifyIdToken({
      idToken: token,
      // audience: process.env.GOOGLE_CLIENT_ID_ANDROID,  // Specify the CLIENT_ID of the app that accesses the backend
    })
    .catch((e) => {
      if (e.message.includes('Token used too late')) {
        res.status(401).send({ error: 'This token has expired' })
      } else {
        res.status(401).send({ error: `${e.message} ` })
      }
    })
  console.log('ticket')
  console.log(ticket)
  req.googleId = ticket
  next()
}

var request = require('request')

const verifyGoogleAccessToken = async (req, res, next) => {
  console.log(queryObject)

  const _auth = req.headers.authorization
  var urlAcessToken = 'https://www.googleapis.com/oauth2/v1/tokeninfo?'
  var queryObject = {
    accessToken: _auth,
  }
  console.log(queryObject)
  request(
    {
      url: urlAcessToken,
      qs: queryObject,
    },
    function (error, response, body) {
      if (error) {
        console.log('error:', error) // Print the error if one occurred
      } else if (response && body) {
        console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
        res.status(200) // Print JSON response.
        next()
      }
    },
  )
}

exports.verifyGoogleIDToken = verifyGoogleIDToken
exports.verifyGoogleAccessToken = verifyGoogleAccessToken

/* 
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Replace by your client ID

async function verifyGoogleToken(token, _accessToken) {
  console.log("token")
  console.log(token)
  const ticket = await client.verifyIdToken({
    idToken: token,
    accessToken: _accessToken,
    audience: process.env.GOOGLE_CLIENT_ID  // Replace by your client ID 
  });
  const payload = ticket.getPayload();
  return payload;
}

app.post("/auth/google/accessTokenVerfy", (req, res, next) => {
  verifyGoogleToken(req.body.idToken, req.body.accessToken).then(user => {
    console.log(user); // Token is valid, do whatever you want with the user 
  })
  .catch(console.error); // Token invalid
});
*/

/* 

app.use(passport.initialize())

const passport = require('passport');
const GoogleTokenStrategy = require("passport-google-verify-token").Strategy;


passport.use(new GoogleTokenStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,// Specify the CLIENT_ID of the backend,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  audience: process.env.GOOGLE_CLIENT_ID_ANDROID
 // If other clients (such as android / ios apps) also access the google api:
 // audience: [CLIENT_ID_FOR_THE_BACKEND, CLIENT_ID_ANDROID, CLIENT_ID_IOS, CLIENT_ID_SPA]
},
function(parsedToken, googleId, done) {
  try {
    
    console.log("Hello");
    console.log(parsedToken);
    console.log("Hello");
    

    done(null, googleId);
  } catch (error) {
   console.log(error) 
  }
  
}
));




app.post('/auth/google/token1',
function(req,res,next){
passport.authenticate('google-verify-token', function(error, user, info) {
  // do stuff with user
  console.log(error);
  console.log(user);
  console.log(info);
  res.json(user);
})(req, res)
}
);









*/
