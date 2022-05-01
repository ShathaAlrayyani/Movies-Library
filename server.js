`use strict`

 let PORT = 3002;
 let express = require("express");
// creat express app
 let app = express();

 let movieData = require("./Movie data/data.json");
 
 
 app.listen(PORT,() => {
    console.log(`Hello on port ${PORT}`);
});

 app.get("/homePage", handlehomePage);
 app.get("/favorite", favoriteHandler);
 app.get("/trending",trendingHandler);

 function trendingHandler(req,res){
     let movieInfo = new Movie(
         movieData.id,
         movieData.title,
         movieData.release_date,
         movieData.poster_path,
         movieData.overview,
         )
         
     res.json(movieInfo)
    }

 function handlehomePage(req, res) {
     let newMovie = new Movie(
         movieData.title,
         movieData.poster_path,
         movieData.overview,
         )

     res.json(newMovie);
     }
 

function Movie (title, poster_path,overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date ;
    this.poster_path = poster_path;
    this.overview = overview;
} 
 
 function favoriteHandler (req, res) {
    res.send("Welcome to Favorite Page");
}