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
const {Profile} = require('./models/profile');
const {Job} = require('./models/job');
const PORT = process.env.PORT || 3000;
global.currentUser;

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

    if(!doc) {
      return done(null, false);
    }

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
  console.log(req.flash('login'));
  res.render('login.hbs');
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

app.get('/profile', authenticationMiddleware(), (req, res) => {
  req.user.populate('profile', (err, user) => {
      global.currentUser = user;
      if(global.currentUser.role == 'admin')
      {
        res.redirect('/dashboard')
      }
      else {
        res.render('profile.hbs', {
          user: global.currentUser
        });
      }
  });
});

app.get('/home', authenticationMiddleware(), (req, res) => {
  req.user.populate('profile', (err, user) => {
      global.currentUser = user;
      if(global.currentUser.role == 'admin')
      {
        res.redirect('/dashboard')
      }
      else {
        Post.find({}, (err, doc) => {
          res.render('home.hbs', {
            posts: doc,
            user:global.currentUser
          });
        });
      }
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

  var profile = new Profile({
    about: {name: {firstName: req.body.fName, lastName: req.body.lName, middleName: req.body.mName}, usn: req.body.usn, contact: {email: req.body.email, phone: req.body.phone}}
  });

  profile.save().then((doc) =>{
    bcryptjs.hash(req.body.password, 10).then((hash) => {
      var user = new User({
        email: req.body.email,
        password: hash,
        profile: profile._id
      });

      user.save().then((doc) => {
        req.login(doc, (err) => {
          if(err)
            return next(err);

          return res.redirect('/edit');
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
  }, (e) => {
    res.send(e);
    console.log(e);
  })
});

app.get('/dashboard', (req, res) => {

  req.user.populate('profile', (err, user) => {
      global.currentUser = user;
      if(global.currentUser.role == 'admin') {
        User.find({role: 'student'}).populate('profile').then((doc) => {
          Post.find({}).then((posts) => {
            res.render('dashboard.hbs', {
              users: doc,
              posts: posts
            });
          })
        });
      }
      else {
        res.redirect('/home')
      }
  });
});

app.get('/edit', (req, res) => {
  req.user.populate('profile', (err, user) => {
      global.currentUser = user;
      Post.find({}, (err, doc) => {
        res.render('edit.hbs', {
          user: global.currentUser
        });
      });
  });
});

app.post('/edit', (req, res) => {
  console.log(req.body);

  Profile.findById(global.currentUser.profile).then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));

    doc.about.dob = req.body.dob
    doc.about.gender = req.body.gender
    doc.about.branch = req.body.branch
    doc.education.be = req.body.score
    doc.education.college = req.body.xiiscore
    doc.education.school = req.body.xscore

    doc.save().then((doc)=>{
      res.redirect('/profile');
    }, (e) => {
      console.log(e);
      res.send(e);
    })
  }, (e) => {
    console.log(e);
    res.send(e);
  });
});

app.get('/jobprofiles', (req, res) => {
  res.render('jobprofiles.hbs');
});

app.get('/job', (req, res) => {
  res.render('job.hbs');
});

app.get('/about', (req, res) => {
  res.render('about.hbs');
});

app.get('/help', (req, res) => {
  res.render('help.hbs');
})

app.post('/notice', (req, res) => {
  var post = new Post({
    title: req.body.title,
    content: req.body.content,
    username: currentUser.profile.about.name.firstName
  });

  post.save().then((doc) => {
    console.log('Notice Sent');
    res.redirect('/dashboard');
  }, (e) => {
    console.log(e);
    res.send(e);
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
