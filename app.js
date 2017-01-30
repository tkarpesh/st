let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let exphbs = require('express-handlebars');
let expressValidator = require('express-validator');
let flash = require('connect-flash');
let session = require('express-session');
let passport = require('passport');
let localStrategy = require('passport-local').Strategy;
let mongo = require('mongodb');
let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/st');

let db = mongoose.connection;

let routes = require('./routes/index');
let users = require('./routes/users');
let articles = require('./routes/articles');

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;

  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/articles', articles);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
  console.log(`Server started on port ${app.get('port')}`);
});
