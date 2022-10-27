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

mongoose.connect('mongodb://Localhost:27017/adbms',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"))
db.once('open',()=>console.log("Connected to Database"))


// for data insertion


app.post("/sign_up",(req,res)=>{
    var name = req.body.name;
    var tableno = req.body.tableno;

    var data = {
        "name":name,
        "tableno":tableno,
    }

  db.collection('users').insertOne(data,(err,collection)=>{
    if(err){
        throw err;
    }
    console.log("Record inserted successfully");
  });

  return res.redirect('menu.html')
})
 

// for new collection


app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin":'*'
    })
    return res.redirect('index.html')
}).listen(4000);

console.log("listening on PORT 4000");