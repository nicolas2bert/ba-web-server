const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const jwt = require('jwt-simple');
const { Strategy: FlickrStrategy } = require('passport-flickr');
const users = require('./users.js');

const apiEndpoint = process.env.API_ENDPOINT;

// PASSPORT
passport.use(new FlickrStrategy({
    consumerKey: process.env.FLICKR_KEY,
    consumerSecret: process.env.FLICKR_SECRET,
    callbackURL: 'http://localhost:3003/auth/flickr/callback',
}, (token, tokenSecret, profile, done) => {
    // STEP 3
    console.log('token!!!', token);
    console.log('tokenSecret!!', tokenSecret);
    console.log('profile!!!', profile);
    const user = {
        id: profile.id,
        // flickrProfile: profile,
        flickrToken: token,
        flickrSecretToken: tokenSecret,
    };
    return users.save(user)
        .then(() => {
            return done(null, user);
        })
        .catch(err => {
            console.log('users.save(user) => err!!!', err);
            return done(err, null)
        });
    // User.findOrCreate({ flickrId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
}));

passport.serializeUser((user, done) => {
    console.log('passport.serializeUser  user!!!', user);
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser((id, done) => {
    return users.findById(id)
        .then(resp => {
            return done(null, resp.body);
        })
        .catch(err => {
            return done(err, null)
        });
});

const app = express();

// a session will be established and maintained via a cookie set in the user's browser.
app.use(session({
    // NOTE: USE ENV VAR TO KEEP SECRET SECRET
    name: 'ba-auth-cookie',
    secret: '123456',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(bodyParser.json());

// views
app.set('view engine', 'ejs'); // set up ejs for templating
app.set('views', path.join(__dirname, '/views'));

// public image, css, js
app.use(express.static('public'));

function checkAuthMiddleware(req, res, next) {
    console.log('req.isAuthenticated()!!!', req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/auth/flickr');
}

app.get(['/', '/home'], checkAuthMiddleware, (req, res) => {
    res.render('index.ejs', { apiEndpoint });
});

app.get('/auth/flickr',
    // STEP 1
    passport.authenticate('flickr'), (req, res) => {
        console.log('/auth/flickr!!!');
        // The request will be redirected to Flickr for authentication, so this
        // function will not be called.
    });

app.get('/auth/flickr/callback', (req, res) => {
    // Successful authentication, redirect home.
    // STEP 2
    console.log('CALLBACK!!');
    passport.authenticate('flickr',
        { failureRedirect: '/toto' },
        (err, user, info) => {
            console.log('callback err!!! =>', err)
            console.log('callback user!!! =>', user)
            if (err) {
                return res.redirect('/auth/flickr');
            }
            // STEP 4
            console.log('/auth/flickr/callback => err!!!', err);
            console.log('/auth/flickr/callback => user!!!', user);
            console.log('/auth/flickr/callback => info!!!', info);
            return req.logIn(user, error => {
                if (error) {
                    console.log('error req.logIn!!!!', error)
                    return res.redirect('/oups');
                }
                return res.redirect('/');
            });
        })(req, res);
});

app.get('/auth/refresh', (req, res) => {
    console.log('req.isAuthenticated()!!!', req.isAuthenticated());
    console.log('req.user!!!', req.user);
    const payload = {
        role: 'user',
        userId: req.user.id,
        exp: (Date.now() / 1000) + (20 * 60),
    };
    console.log('auth/refresh => payload!!!', payload);
    const token = jwt.encode(payload, 'secret');
    const infos = {
        // user: req.user.flickrProfile,
        user: req.user,
        token,
    };
    console.log('auth/refresh => infos!!!', infos);
    res.json(infos);
});

// app.post('/api/openbrowsertab', (req, res) => {
//     console.log('/api/openbrowsertab!!!', req.body);
//
//     return res.json({ ok: 'ok' });
// });


const port = process.env.PORT || '3003';

app.listen(port);
