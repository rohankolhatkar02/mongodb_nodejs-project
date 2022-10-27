const express = require('express')
const app = express()
const port = 3000

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { callbackify } = require('util');

const url= 'mongodb://localhost:27017';

const dbName = 'test';

const client = new MongoClient(url);


app.set('view engine', 'ejs')

app.get('/devices',(req,res) =>{
   // let device_list = [{'name':'dht22'},{'name':'temp36'}]
    const db = client.db(dbName);
    const collection = db.collection('users');
    collection.find({}).toArray(function(err,user_list){
        assert.equal(err,null);
        res.render('users',{'users': user_list})
    });
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})


client.connect(function(err){
    assert.equal(null,err);
    console.log("Connected Successfully to Test db");

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
      })
});