const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
// var items = ["learn node js","learn ejs","learn express"];
let workItem = [];



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemsSchema = mongoose.Schema({
    name: String
});

const Items =  mongoose.model('Item', itemsSchema);

const item1 = new Items({
    name: "first item"
});
const item2 = new Items({
    name: "second item"
});
const item3 = new Items({
    name: "third item"
});

const defaultItems = [item1, item2, item3];


app.get('/', function(req,res){
    var today = new Date();

    var options ={
        weekday: "long",
        day: "numeric",
        month:"long"
    };
    var day = today.toLocaleDateString("en-Us",options)

   Items.find({},function(err, found){
        if(err){
            console.log("error hapend");
        }else{
            if (found.length === 0 ){
                Items.insertMany(defaultItems,function(error){
                    if(error){
                        console.log(error)
                    }else{
                        console.log("successfully saved default items")
                    }
                });
                res.redirect("/");
            }else{
                res.render('index',{list:day, newListItems:found});
            }
        }
    });
});

app.post('/',function(req,res){
   const itemName = req.body.newItem;

   const item = new Items({
        name: itemName
   });

   item.save();

   res.redirect("/");
});


app.post("/delete", function (req,res) { 
    const checkedItemid = req.body.checkbox;

    Items.findByIdAndRemove(checkedItemid,function(err){
        if (err){
            console.log("error found");
            res.redirect("/");
        }else{
            res.redirect("/");
        }
    })
 })
app.get('/work',function(req,res){
    res.render('index',{list: "work list",newListItems:workItem});
});

app.get('/about',function(req,res){
    res.render('about');
});

app.listen(3000,function(){
    console.log("server started at localhost:3000");
})