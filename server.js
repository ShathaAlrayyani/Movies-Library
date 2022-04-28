`use strict`

 let port = 3000;
 let express = require ("express");
// creat express app
 let app = express();

 let movieData = require("./data.json");
 
 
 app.listen(port,() => {
    console.log(`Hello on port ${port}`);
});
 
 app.get("/homePage", handlehomePage);
 app.get("/favorite", favoriteHandler);

 
 function favoriteHandler (req, res) {
    res.send("Welcome to Favorite Page");
}

 
  function Movie (title, poster_path,overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;  
}


 function handlehomePage(req, res) {
     let movie1 = [];
     
      movieData.data.forEach(element => {
 
         let newMovie = new Movie(
             element.title,
             element.poster_path,
             element.overview,
         );
         movie1.push(newMovie);
     })
     console.log(movie1)
 
     res.json(movie1);
 
 }
 



