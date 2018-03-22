const express = require('express');
const session = require('express-session');
// Require passport in a variable called passport
const passport = require('passport');
const {secret, clientID} = require(`${__dirname}/config`);
const request = require('request');
// Require strategy in a variable called strategy
const strategy = require(`${__dirname}/strategy.js`);

const app = express();
// Configure the app to use sessions.
// Hint: secret, resave, and saveUninitialized
app.use( session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 100000
  }
}));

// Initialize passport.
app.use( passport.initialize() );
// Configure passport to use sessions.
app.use( passport.session() );
// Configure passport to use our strategy from strategy.js.
passport.use( strategy );

// Call passport.serializeUser.
// Pass in a function as the first argument.
// The function should have two parameters: user and done.
// The function should call done and with an object that only has the clientID, email, name, and followers_url from user._json as the first arugment.

// Since we only want the clientID, email, name, and followers_url from user._json we'll call done with a new object instead of the entire user object. Remember, we pick what properties we want in serializeUser.
passport.serializeUser( (user, done) => {
  done( null, user );
});

// Call passport.deserializeUser.
// Pass in a function as the first argument.
// The function should have two parameters: obj and done.
// The functions should just call done and pass in obj as the first argument.

// This new object will then be passed on to deserializeUser when done is invoked. Since we don't have any additional logic to execute, simply call done with null and obj.
passport.deserializeUser( (user, done) => {
  done( null, user );
});

// -Create a GET endpoint at /login that calls passport.authenticate.
// -We'll want to call passport.authenticate and pass in a strategy type and configuration object. The strategy type will be 'auth0' since we are using an auth0 strategy.
// -Then, in the configuration object we can specify the SUCCESS and FAILURE REDIRECTS, turn failure flash on, and force the connection type to GitHub. We can do all of these by using the following properties in the configuration object: successRedirect, failureRedirect, failureFlash, and connection. The success redirect should go to '/followers'; The failure redirect should go to '/login'; Failure flash should be set to true; The connection should be set to 'github'.

app.get('/login',
  passport.authenticate('auth0',{
    successRedirect: '/followers', 
    failureRedirect: '/login', 
    failureFlash: true, 
    // connection: 'github'
  })
);


app.get("/followers", (req, res, next) => {  
   if (req.user) {
     const FollowersRequest = { url: `https://api.github.com/users/${req.user.nickname}/followers`, headers: { "User-Agent": clientID } };

     request(FollowersRequest, (error, response, body) => {
       res.status(200).json(body);
      });
   } else {
     res.redirect("/login");
  } 

});

const port = 3001;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );