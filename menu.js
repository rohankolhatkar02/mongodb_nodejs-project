var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()

app.use(bodyParser.json())
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({
    extended:true
}))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://Localhost:27017/test',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Database Connection"))
db.once('open',()=>console.log("Connected to Db"))



app.post("/menu",(req,res)=>{
  var tableno = req.body.tableno;
  var starters = req.body.starters;
  var ramen = req.body.ramen;
  var soft = req.body.soft;
  var alcool = req.body.alcool;


  var data = {
      "tableno": tableno,
      "starters":starters,
      "ramen":ramen,
      "soft": soft,
      "alcool": alcool
  }

db.collection('users').insertOne(data,(err,collection)=>{
  if(err){
      throw err;
  }
  console.log("Record inserted successfully");
});

return res.redirect('menu.html')
})

app.get("/",(req,res)=>{
  res.set({
      "Allow-access-Allow-Origin":'*'
  })
  return res.redirect('menu.html')
}).listen(4000);

console.log("Listening on PORT 4000");