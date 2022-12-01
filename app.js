const express = require('express');
const bodyParser = require('body-parser');


const app = express();
var items = ["learn node js","learn ejs","learn express"];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get('/', function(req,res){
    var today = new Date();

    var options ={
        weekday: "long",
        day: "numeric",
        month:"long"
    };
    var day = today.toLocaleDateString("en-Us",options)

    res.render('index',{day:day, newListItems:items});
});

app.post('/',function(req,res){
    item = req.body.newItem;
    items.push(item);
    res.redirect('/');
});

app.listen(3000,function(){
    console.log("server started at localhost:3000");
})