const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('node:path');
const db = require('./db');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const wordsControllers = require('./controllers/wordsControllers');
const partsControllers = require('./controllers/partsControllers');
const translatesControllers = require('./controllers/translatesControllers');
const usersServices = require('./services/usersServices');

/* 
// Setting Up
*/

const app = express();

const port = process.env.PORT || 3000;

app.engine(
  'handlebars',
  expressHandlebars.engine({
    defaultLayout: 'main',
  })
);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

/*
//---------------------
// Auth
//---------------------
*/

app.use(
  session({
    resave: false, // don't save session if unmodified
    saveUninitialized: true, // don't create session until something stored
    secret: 'dfkjdklajfkdajfdfdfdkdajs4385954kfdgsdf===',
  })
);

function isAuthenticated(req, res, next) {
  console.log(req.session.user);
  if (req.session.user) next();
  else next('route');
}

app.post(
  '/login',
  express.urlencoded({ extended: false }),
  async function (req, res) {
    if (req.body.username && req.body.password) {
      const user = await usersServices.getUserByUsername(req.body.username);
      if (user && user.dataValues.password === req.body.password) {
        req.session.regenerate(function (err) {
          if (err) next(err);
          req.session.user = user.dataValues.id;
          req.session.save(function (err) {
            if (err) return next(err);
            res.redirect(`/allwords`);
          });
        });
      } else {
        res.redirect('/');
      }
    }
  }
);

app.get('/logout', function (req, res, next) {
  req.session.user = null;
  req.session.save(function (err) {
    if (err) next(err);
    req.session.regenerate(function (err) {
      if (err) next(err);
      res.redirect('/');
    });
  });
});

/*
//---------------------
// Server rendering
//---------------------
*/

app.get('/', (req, res) => {
  const user = req.session.user;
  res.render('home', { user });
});

app.get('/addpart', isAuthenticated, partsControllers.createNewPartGet);

app.post(
  '/addpart-process',
  isAuthenticated,
  partsControllers.createNewPartPost
);

app.get(
  '/editpart/:partId',
  isAuthenticated,
  partsControllers.updatePartByIdGet
);

app.post(
  '/editpart-process/:partId',
  isAuthenticated,
  partsControllers.updatePartByIdPost
);

app.get(
  '/deletepart/:partId',
  isAuthenticated,
  partsControllers.deletePartById
);

app.get('/allparts', isAuthenticated, partsControllers.getAllParts);

app.get(
  '/addtranslate',
  isAuthenticated,
  translatesControllers.createNewTranslateGet
);

app.post(
  '/addtranslate-process',
  isAuthenticated,
  translatesControllers.createNewTranslatePost
);

app.get(
  '/edittranslate/:translateId',
  isAuthenticated,
  translatesControllers.updateTranslateByIdGet
);

app.post(
  '/edittranslate-process/:translateId',
  isAuthenticated,
  translatesControllers.updateTranslateByIdPost
);

app.get(
  '/deletetranslate/:translateId',
  isAuthenticated,
  translatesControllers.deleteTranslateById
);

app.get(
  '/alltranslates',
  isAuthenticated,
  translatesControllers.getAllTranslates
);

app.get('/addword', isAuthenticated, wordsControllers.createNewWordGet);

app.post(
  '/addword-process',
  isAuthenticated,
  wordsControllers.createNewWordPost
);

app.get(
  '/editword/:wordId',
  isAuthenticated,
  wordsControllers.updateWordByIdGet
);

app.post(
  '/editword-process/:wordId',
  isAuthenticated,
  wordsControllers.updateWordByIdPost
);

app.get(
  '/deleteword/:wordId',
  isAuthenticated,
  wordsControllers.deleteWordById
);

app.get('/allwords/:wordId', isAuthenticated, wordsControllers.cardWord);

app.get('/allwords', isAuthenticated, wordsControllers.getAllWords);

app.get(
  '/alltranclates',
  isAuthenticated,
  translatesControllers.getAllTranslates
);

app.get(
  '/editword/:wordId/translates',
  isAuthenticated,
  wordsControllers.getAllTranslatesByWordIdAndUserId
);

app.get(
  '/editword/:wordId/deletetranslate/:translateId',
  isAuthenticated,
  wordsControllers.deleteTranslateFromWord
);

app.post(
  '/addwordtranslate-process/:wordId/',
  isAuthenticated,
  wordsControllers.createTranslateToWord
);

/* ++++++++++++++++++++++++++
/ +++++++++++++++++++++++++++
// API
/ +++++++++++++++++++++++++++
/ +++++++++++++++++++++++++++
*/
/*
app.get('/api/v1/allwords', async (req, res) => {
  const data = await Word.findAll();
  res.json(data);
});

app.get('/api/v1/allwords/:wordId', async (req, res) => {
  const data = await Word.findOne({
    where: {
      id: req.params.wordId,
    },
  });
  res.json(data);
});

app.put('/api/v1/allwords/:wordId', async (req, res) => {
  const data = await Word.findOne({
    where: {
      id: req.params.wordId,
    },
  });
  console.log(req.body);
  data.set({
    word: req.body.word,
    ipa_str: req.body.ipa_str,
    forvo_link: `https://forvo.com/word/${req.body.word}/#fr`,
  });
  await data.save();
  res.json({ succuss: true });
});

app.delete('/api/v1/allwords/:wordId', async (req, res) => {
  await Word.destroy({
    where: {
      id: req.params.wordId,
    },
  });
  res.json({ succuss: true });
});
*/

app.listen(port, () =>
  console.log(`Express is started on http://localhost:${port}`)
);
