var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");


// body parser
app.use(bodyParser.urlencoded({extended: true}));


// Page with the form to lookup movies
app.get("/", function(req, res){
    res.render("home.ejs");
});


// Page with results from search
app.get("/results", function(req, res){
    var query = req.query.search;
    var url = "http://omdbapi.com/?s=" + query + "&apikey=thewdb";
    
    request(url, function(error, response, body){
        if(!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("movies.ejs", {movies: data.Search});
        }
        else {
            console.log("Error!");
            console.log(error);
        }
    });
});



app.listen(3000, process.env.IP, function(){
   console.log("Server is running!"); 
});
 