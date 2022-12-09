var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()
const MongoClient = require('mongodb').MongoClient;
const objectID = require('mongodb').ObjectId
const url= 'mongodb://localhost:27017';

const dbName = 'adbms';

const client = new MongoClient(url);
const assert = require('assert');
const { callbackify } = require('util');
const { Router } = require("express");

app.use(bodyParser.json())
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({
    extended:true
}))
app.use(bodyParser.urlencoded({
    extended:true
}))

//mongodb connection

mongoose.connect('mongodb://Localhost:27017/adbms',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"))
db.once('open',()=>console.log("Connected to Database"))


app.use(express.static("public"));

app.set('view engine', 'ejs')

// for data insertion in checkin page


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
 

// for menu ordering

app.post("/menu",(req,res)=>{
    //var volvo = req.body.volvo
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
  
  db.collection('order').insertOne(data,(err,collection)=>{
    if(err){
        throw err;
    }
    console.log("Record inserted successfully");
  });
  
  return res.redirect('order.html')
  })

/*Update function*/

app.post("/update",function(req,res, next){
    var item = {
         starters:req.body.starters,
         ramen:req.body.ramen,
         soft: req.body.soft,
         alcool: req.body.alcool
    };
    
    var tableno = req.body.tableno;

    MongoClient.connect(url, function(err,client){
        assert.equal(null,err);
        db.collection('order').updateOne({"tableno":tableno}, {$set: item}, function(err, result){
            assert.equal(null, err);
            console.log('Record updated');
            client.close();
        });
    });
    return res.redirect('order.html')
});

/*Delete Function*/

app.post("/delete", function(req, res, next){
    var tableno = req.body.tableno;

    MongoClient.connect(url, function(err,client){
        assert.equal(null,err);
        db.collection('order').deleteOne({"tableno":tableno}, function(err, result){
            assert.equal(null, err);
            console.log('Record deleted');
            client.close();
        });
    });
    return res.redirect('order.html')

})


//for Kitchen Display page



app.get('/devices',(req,res) =>{
    // let device_list = [{'name':'dht22'},{'name':'temp36'}]
     const db = client.db(dbName);
     const collection = db.collection('order');
     collection.find({}).toArray(function(err,user_list){
         assert.equal(err,null);
         res.render('users',{'users': user_list})
     });
 })

// for Connection to LocalHost


app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin":'*'
    })
    return res.redirect('loader.html')
}).listen(4000);

console.log("listening on PORT 4000");
