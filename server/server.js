var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(bodyParser.json());

//post/add todos to todo database
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

//get all todos
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos
    });
  }, (e) => {
    res.status(400).send(e);
  })
});

//get an individual todo
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  //validate the id
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  //find the todo by its ID
  Todo.findById(id).then((todo) => {
    //id valid but no todo found with that id
    if(!todo){
      return res.status(404).send();
    }
    //matching todo for given id
    // res.send(todo);
    // res.send({todo: todo});
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

//delete an individual todo
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });

});


app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  // this is so a user can only change these two properties
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    //is bool and is true
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id,{$set: body},{new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});



// start the server
app.listen(PORT, () => {
  console.log(`Sever started on PORT: ${PORT}`);
});

// export server for testing in tests/sever.test.js
module.exports = {app};
