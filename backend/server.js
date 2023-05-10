const express = require('express')
const db = require('./db.js')
var cors = require('cors')
var app = express()

app.use(cors())
app.use(express.json())

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/users', function(req, res){
    var query = "select * from user"
    var params = []
    db.all(query, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
})
app.get('/user/:id', function (req, res) {
    var query = "select * from user where id = ?"
    var params = [req.params.id]
    db.get(query, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
})
app.post('/alarm', function(req, res){
    console.log('req.body: ', req.body)
})

app.listen(3000, function(){
    console.log("running on port 3000...")
})