const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const proxy = require('http-proxy-middleware');
const passport = require('passport');
const session = require('express-session');
const jwt = require('jwt-simple');
const { Strategy: FlickrStrategy } = require('passport-flickr');

const users = require('./users.js');

// PASSPORT
passport.use(new FlickrStrategy({
    consumerKey: 'acd08a2259872ec9244be88933d4b805',
    consumerSecret: process.env.FLICKR_SECRET,
    callbackURL: 'http://127.0.0.1:3003/auth/flickr/callback',
}, (token, tokenSecret, profile, done) => {
    // STEP 3
    console.log('token!!!', token);
    console.log('tokenSecret!!', tokenSecret);
    console.log('profile!!!', profile);
    const user = {
        id: profile.id,
        flickrProfile: profile,
        flickrToken: token,
        flikrSecretToken: tokenSecret,
    };
    users.save(user);
    return done(null, user);
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
    const user = users.findById(id);
    console.log('passport.serializeUser  user!!!', user);
    done(null, user);
});

const app = express();

app.use(session({
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
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/auth/flickr');
}

app.get(['/', '/home'], checkAuthMiddleware, (req, res) => {
    res.render('index.ejs');
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
            if (err) {
                console.log('error /auth/flickr/callback => redirect /auth/flickr', err)
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
    const token = jwt.encode(payload, 'mysecret');
    const infos = {
        user: req.user.flickrProfile,
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
