var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });

app.use(express.static('public'));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5670);

app.get('/', function (req, res, next) {
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function (err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    context.exercises = rows;
    res.render('home', context);
  });
});

app.get('/edit', function (req, res, next) {
  var context = {
    id: req.query.id,
    name: req.query.name,
    weight: req.query.weight,
    reps: req.query.reps,
    date: req.query.date,
    lbs: req.query.unit
  };
  res.render('edit', context);

});

app.post('/createExercise', function (req, res, next) {
  var exercise = {
    name: req.body.name,
    reps: req.body.reps,
    weight: req.body.weight,
    date: req.body.date,
    lbs: req.body.unit
  };
  mysql.pool.query(
    "INSERT INTO workouts SET ?", exercise, function (err, result) {
      if (err) {
        next(err);
        return;
      }
      res.json({ success: 1, id: result.insertId });
    })
});

app.post('/updateExercise', function (req, res, next) {
  var exercise = {
    name: req.body.name,
    reps: req.body.reps,
    weight: req.body.weight,
    date: req.body.date,
    lbs: req.body.unit
  };
  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.body.id], function (err, result) {
    if (err) {
      next(err);
      return;
    }
    if (result.length == 1) {
      var curVals = result[0];
      exercise.name = exercise.name || curVals.name;
      exercise.reps = exercise.reps || curVals.reps;
      exercise.weight = exercise.weight || curVals.weight;
      exercise.date = exercise.date || curVals.date;
      exercise.lbs = exercise.lbs || curVals.lbs;
      mysql.pool.query("UPDATE workouts SET ? WHERE id=?",
        [exercise, curVals.id],
        function (err, result) {
          if (err) {
            next(err);
            return;
          }
          res.json({ success: 1 });
        });
    } else {
      res.json({ success: 0, reason: 'NotFound' });
    }
  });
});

app.post('/deleteExercise', function (req, res, next) {
  var id = req.body.id;
  mysql.pool.query("DELETE FROM workouts WHERE id=?", [id], function (err, result) {
    if (err) {
      next(err);
      return;
    }
    res.json({ success: 1 });
  })
});

app.get('/reset-table', function (req, res, next) {
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function (err) {
    var createString = "CREATE TABLE workouts(" +
      "id INT PRIMARY KEY AUTO_INCREMENT," +
      "name VARCHAR(255) NOT NULL," +
      "reps INT," +
      "weight INT," +
      "date DATE," +
      "lbs BOOLEAN)";
    mysql.pool.query(createString, function (err) {
      context.results = "Table reset";
      res.render('home', context);
    })
  });
});

app.use(function (req, res) {
  res.status(404);
  res.render('404');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
