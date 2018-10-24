const express = require('express');
const hbs = require('hbs');
const myParser = require('body-parser');
const bcryptjs = require('bcryptjs');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const {mongoose} = require('./db/mongoose.js');
const {User} = require('./models/user');
const {Post} = require('./models/post');
const PORT = process.env.PORT || 3000;


var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
mongoose.set('useFindAndModify', false);

app.use(myParser.urlencoded({extended: true}));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy( (username, password, done) => {

  User.findOne({email: username}, (err, doc) => {

    if(err) { return done(err); }

    if(!doc) { return done(null, false); }

    const hash = doc.password;

    bcryptjs.compare(password, hash).then((res) => {
      if(res === true){
        return done(null, doc);
      }
      else {
        return done(null, false);
      }
    });
  });
}
));

app.get('/', authMiddleWare(), (req, res) => {
  res.render('index.hbs');
});

app.get('/login', authMiddleWare(), (req, res) => {
  res.render('login.hbs');
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

app.get('/profile', authenticationMiddleware(), (req, res) => {
  res.render('profile.hbs', {
    username: req.user.email
  });
});

app.get('/home', authenticationMiddleware(), (req, res) => {
  console.log(req.user.id);
  Post.find({}, (err, doc) => {
    res.render('home.hbs', {
      posts: doc
    });
  });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
})
);

app.get('/signup', authMiddleWare(), (req, res) => {
  res.render('signup.hbs');
});

app.post('/signup', (req, res) => {
  bcryptjs.hash(req.body.password, 10).then((hash) => {
    var user = new User({
      email: req.body.email,
      password: hash
    });

    user.save().then((doc) => {
      req.login(doc, (err) => {
        if(err)
        return next(err);

        return res.redirect('/profile');
      })
      console.log(JSON.stringify(doc, undefined, 2));
    }, (e) => {
      res.send(e);
      console.log(e);
    });
  }, (e) =>{
    console.log(e);
    res.send(e);
  });
});

app.get('/dashboard', (req, res) => {
  User.find({role: 'student'}, (err, doc) => {
    res.render('dashboard.hbs', {
      users: doc
    });
  })
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
})

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login');
  }
}

function authMiddleWare () {
  return function(req, res, next) {
    if (req.isAuthenticated()) {
      if(req.user.role === 'student')
      {
        return res.redirect('/home');
      }

      if(req.user.role === 'admin')
      {
        return res.redirect('/dashboard');
      }
    }
    return next()
  }
}
