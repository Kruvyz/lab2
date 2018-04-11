const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoUrl = 'mongodb://localhost:27017/02-server';
let mongo;
MongoClient
  .connect(mongoUrl)
  .then(function(client) {
    mongo = client.db();
  });

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.post('/show/:id', function(req, res){
  mongo
  .collection('tasks').find({_id: new mongodb.ObjectID(req.params.id)}).toArray()
  .then(function(task){
    res.render('pages/show', {task: task[0]});
  });
});

app.post('/delete/:id', function(req, res){
  mongo
  .collection('tasks').remove({ _id: new mongodb.ObjectID(req.params.id) })
  .then(function() {
    res.redirect('/')
  });
});

app.post('/edit/:id', function(req, res){
  mongo
  .collection('tasks').find({_id: new mongodb.ObjectID(req.params.id)}).toArray()
  .then(function(task){
    res.render('pages/edit', {task: task[0]});
  });
});

app.post('/save/:id', function(req, res){
  mongo
  .collection('tasks').update(
    { _id: new mongodb.ObjectID(req.params.id) },
    {
      name: req.body.name,
      done: req.body.done,
      details: req.body.details
    })
  .then(function() {
    res.redirect('/');
  });
});

app.post('/new', function(req, res) {
  mongo
  .collection('tasks').insert({ name: req.body.name, done: false, details: req.body.details })
  .then(function() {
    res.redirect('/');
  });
});

app.get('/', function(req, res) {
  mongo
  .collection('tasks').find().toArray()
  .then(function(tasks) {
    res.render('pages/index', {tasks: tasks});
  });
});

app.listen(3000, function() {
  console.log('App started on http://localhost:3000');
});
