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

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = new mongoose.model("List",listSchema);

app.get('/', function(req,res){

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
                res.render('index',{list: "Today", newListItems:found});
            }
        }
    });
});

app.post('/',function(req,res){
   const itemName = req.body.newItem;
   const list = req.body.list

   const item = new Items({
        name: itemName
   });

   if (list === "Today"){
    item.save();
    res.redirect("/");
   }else{
    List.findOne({name: list}, function(err,foundList){
        foundList.items.push(item);
        foundList.save();
        res.redirect("/"+list);
    });
   }

});


app.post("/delete", function (req,res) { 
    const checkedItemid = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Items.findByIdAndRemove(checkedItemid,function(err){
            if (err){
                console.log("error found");
                res.redirect("/");
            }else{
                res.redirect("/");
            }
        });
    }else{
        List.findOneAndUpdate(
            {name: listName},
            {$pull: {items: {_id: checkedItemid}}},
            function(err,results){
                if(!err){
                    res.redirect("/"+listName);
                }
        });
    }
 })

app.get('/:url', function(req,res){
    const customListName = req.params.url;
    List.findOne({name: customListName}, function (err,foundList) {
        if(!err){
            if(!foundList){
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/"+customListName);
            }else{
                res.render("index",{list: foundList.name, newListItems: foundList.items});
            }
        }
    })
});

app.get('/about',function(req,res){
    res.render('about');
});

app.listen(3000,function(){
    console.log("server started at localhost:3000");
})