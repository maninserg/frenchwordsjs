const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('node:path');
const db = require('./db');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const Word = require('./models/words');
const Translate = require('./models/translates');
const Part = require('./models/parts');
const { getAllParts, getPartById } = require('./services/partsServices');
const {
  getAllWords,
  getOneWordById,
  getRandomIdWord,
} = require('./services/wordsServices');
const {
  getAllTranslates,
  getTranslateById,
} = require('./services/translatesServices');
const User = require('./models/users');

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
    secret: 'dfkjdklajfkdajfkdajs4385954kfdgsdf===',
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
      const user = await User.findOne({
        where: {
          user: req.body.username,
        },
      });
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

app.get('/addpart', isAuthenticated, async (req, res) => {
  res.render('addpart', { userId: req.session.user });
});

app.post('/addpart-process', isAuthenticated, async (req, res) => {
  await Part.create({
    part: req.body.part,
    description: req.body.description,
    userId: req.session.user,
  });
  res.redirect('allparts');
});

app.get('/editpart/:partId', isAuthenticated, async (req, res) => {
  const part = await getPartById(req.params.partId);
  res.render('editpart', { part });
});

app.post('/editpart-process/:partId', isAuthenticated, async (req, res) => {
  const partOld = await getPartById(req.params.partId);
  partOld.set({
    part: req.body.part,
    description: req.body.description,
  });
  await partOld.save();
  res.redirect(`/allparts`);
});

app.get('/deletepart/:partId', isAuthenticated, async (req, res) => {
  const part = await getPartById(req.params.partId);
  await Part.destroy({
    where: {
      id: req.params.partId,
    },
  });
  res.redirect(`/allparts`);
});

app.get('/allparts', isAuthenticated, async (req, res) => {
  const parts = await getAllParts(req.session.user);
  res.render('allparts', { parts });
});

app.get('/addtranslate', isAuthenticated, async (req, res) => {
  res.render('addtranslate');
});

app.post('/addtranslate-process', isAuthenticated, async (req, res) => {
  await Translate.create({
    translate: req.body.translate,
    userId: req.session.user,
  });
  res.redirect(`alltranslates`);
});

app.get('/edittranslate/:translateId', isAuthenticated, async (req, res) => {
  const translate = await getTranslateById(req.params.translateId);
  res.render('edittranslate', { translate });
});

app.post(
  '/edittranslate-process/:translateId',
  isAuthenticated,
  async (req, res) => {
    const translateOld = await getTranslateById(req.params.translateId);
    translateOld.set({
      translate: req.body.translate,
    });
    await translateOld.save();
    res.redirect(`/alltranslates`);
  }
);

app.get('/deletetranslate/:translateId', isAuthenticated, async (req, res) => {
  const translate = await getTranslateById(req.params.translateId);
  await Translate.destroy({
    where: {
      id: req.params.translateId,
    },
  });
  res.redirect(`/alltranslates`);
});

app.get('/alltranslates', isAuthenticated, async (req, res) => {
  const translates = await getAllTranslates(req.session.user);
  res.render('alltranslates', { translates });
});

app.get('/addword', isAuthenticated, async (req, res) => {
  const parts = await getAllParts(req.session.user);
  const translates = await getAllTranslates(req.session.user);
  res.render('addword', { parts, translates });
});

app.post('/addword-process', isAuthenticated, async (req, res) => {
  const word = await Word.create({
    word: req.body.word || null,
    ipa_str: req.body.ipa_str || null,
    forvo_link: `https://forvo.com/word/${req.body.word}/#fr` || null,
    partId: req.body.partId || null,
    userId: req.session.user || null,
  });
  const translate = await Translate.findOne({
    where: {
      id: req.body.translateId,
    },
  });
  translate.set({
    wordId: word.id,
  });
  await translate.save();
  res.redirect(`allwords`);
});

app.get('/editword/:wordId', isAuthenticated, async (req, res) => {
  const word = await getOneWordById(req.params.wordId);
  const parts = await getAllParts(word.userId);
  const translates = await getAllParts(word.userId);
  res.render('editword', {
    word,
    parts,
    translates,
    userId: word.userId,
  });
});

app.post('/editword-process/:wordId', isAuthenticated, async (req, res) => {
  const wdOld = await getOneWordById(req.params.wordId);
  wdOld.set({
    word: req.body.word,
    ipa_str: req.body.ipa_str,
    forvo_link: `https://forvo.com/word/${req.body.word}/#fr`,
    partId: req.body.partId,
  });
  await wdOld.save();
  res.redirect(`/allwords`);
});

app.get('/deleteword/:wordId', isAuthenticated, async (req, res) => {
  const word = await getOneWordById(req.params.wordId);
  await Word.destroy({
    where: {
      id: req.params.wordId,
    },
  });

  res.redirect(`/allwords`);
});

app.get('/allwords/:wordId', isAuthenticated, async (req, res) => {
  const word = await getOneWordById(req.params.wordId);
  const part = await getPartById(word.partId);
  const translates = await Translate.findAll({
    where: {
      wordId: word.id,
    },
  });
  //const randId = await getRandomIdWord();
  res.render('oneword', { word, part, translates });
});

app.get('/allwords', isAuthenticated, async (req, res) => {
  const words = await getAllWords(req.session.user);
  res.render('allwords', { words });
});

app.get('/alltranclates', isAuthenticated, async (req, res) => {
  const data = await Translate.findAll();
  res.render('alltranslates', { data: data });
});

app.get('/editword/:wordId/translates', isAuthenticated, async (req, res) => {
  const word = await getOneWordById(req.params.wordId);
  const translatesbyword = await Translate.findAll({
    where: {
      wordId: req.params.wordId,
    },
  });
  const translatesbyuser = await Translate.findAll({
    where: {
      userId: word.userId,
    },
  });
  res.render('wordtranslates', { word, translatesbyword, translatesbyuser });
});

app.get(
  '/editword/:wordId/deletetranslate/:translateId',
  isAuthenticated,
  async (req, res) => {
    const translate = await getTranslateById(req.params.translateId);
    translate.set({
      wordId: null,
    });
    await translate.save();
    res.redirect(`/editword/${req.params.wordId}/translates`);
  }
);

app.post(
  '/addwordtranslate-process/:wordId/',
  isAuthenticated,
  async (req, res) => {
    const translate = await Translate.findOne({
      where: {
        id: req.body.translateId,
      },
    });
    translate.set({
      wordId: req.params.wordId,
    });
    await translate.save();
    res.redirect(`/editword/${req.params.wordId}/translates`);
  }
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
