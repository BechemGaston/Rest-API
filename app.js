const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB')

const { Schema } = mongoose;
const articleSchema = new Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);

//////////////////////////////request targetting all articles////////////////////////////////////////////////////////////////////
app.route('/articles')

.get((req, res)=>{
    Article.find(function(err, foundArticles){
        if(!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
        
    });
})

.post( (req, res)=>{

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
  
    newArticle.save(function(err){
        if(!err){
            res.send("successfully added a new article")
        } else {
            res.send(err)
        }
    });
  })

  .delete((req, res)=>{
    Article.deleteMany(function(err){
        if(!err) {
            res.send("successfully deleted articles from database");
        } else {
            res.send(err);
        }
    });
});

////////////////////////////////////////request targeting a specific article////////////////////////////////////////////////////

app.route('/articles/:articleTitle')

.get((req, res)=>{
    Article.findOne({title: req.params.articleTitle},(err, foundArticle)=>{
        if (foundArticle) {
            res.send(foundArticle)
        } else {
            res.send('404. No matching article.')
        }
    });
})

.put((req, res)=>{
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err) {
                res.send('successfully updated');
            }
        });
})


.patch((req, res)=>{
    Article.replaceOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err) {
                res.send("successfully updated article");
            } else {
                res.send(err)
            }
        }
    );
})

.delete((req, res)=>{
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err) {
            if(!err) {
                res.send('succesfully deleted');
            } else {
                res.send(err);
            }
        }
    );
});







app.listen(3000,()=>{
    console.log("server is runnin...")
})
