var express = require('express');
var app = express();

var cpt = 0;

var allMsgs = [
  {
    pseudo: "Adam",
    msg: "Hello World",
    date: "2026-03-06 10:00"
  },
  {
    pseudo: "Sara",
    msg: "Blah Blah",
    date: "2026-03-06 10:05"
  },
  {
    pseudo: "Yasmine",
    msg: "I love cats",
    date: "2026-03-06 10:10"
  }
];

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Route de test
app.get(/^\/test\/(.+)$/, function(req, res) {
  const msg = req.params[0];
  res.json({ msg: msg });
});

// Lire le compteur
app.get('/cpt/query', function(req, res) {
  res.json(cpt);
});

// Incrémenter le compteur
app.get('/cpt/inc', function(req, res) {
  if (req.query.v === undefined) {
    cpt = cpt + 1;
    res.json({ code: 0 });
    return;
  }

  const v = req.query.v;

  if (String(v).match(/^-?\d+$/)) {
    cpt = cpt + parseInt(v, 10);
    res.json({ code: 0 });
  } else {
    res.json({ code: -1 });
  }
});

// Lire tous les messages
app.get('/msg/getAll', function(req, res) {
  res.json(allMsgs);
});

// Retourner le nombre de messages
app.get('/msg/nber', function(req, res) {
  res.json(allMsgs.length);
});

// Retourner un message par son id
app.get(/^\/msg\/get\/(\d+)$/, function(req, res) {
  const id = parseInt(req.params[0], 10);

  if (id >= 0 && id < allMsgs.length) {
    res.json({ code: 1, msg: allMsgs[id] });
  } else {
    res.json({ code: 0 });
  }
});

// Ajouter un message
app.get('/msg/post', function(req, res) {
  const pseudo = req.query.pseudo;
  const msg = req.query.msg;
  const date = req.query.date;

  if (!pseudo || !msg || !date) {
    res.json({ code: -1 });
    return;
  }

  allMsgs.push({
    pseudo: pseudo,
    msg: msg,
    date: date
  });

  res.json({ code: 0, id: allMsgs.length - 1 });
});

// Supprimer un message
app.get(/^\/msg\/del\/(\d+)$/, function(req, res) {
  const id = parseInt(req.params[0], 10);

  if (id >= 0 && id < allMsgs.length) {
    allMsgs.splice(id, 1);
    res.json({ code: 1 });
  } else {
    res.json({ code: 0 });
  }
});

app.listen(8080);
console.log("App listening on port 8080...");