const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
var items = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req,res){
    var today = new Date();

    var options ={
        weekday: "long",
        day: "numeric",
        month:"long"
    };
    var day = today.toLocaleDateString("en-Us",options)

    res.render('index',{day:day, newItem:items});
});

app.post('/',function(req,res){
    item = req.body.newItem;
    items.push(item);
    res.redirect('/');
});

app.listen(3000,function(){
    console.log("server started at localhost:3000");
})