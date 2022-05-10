`use strict`

 let PORT = 3000;
 const bodyParser = require('body-parser');
 require('dotenv').config();
 const { default: axios } = require("axios");
 let express = require("express");

 // creat express app
 let app = express();
 let movieData = require("./Movie data/data.json");

 // API linkes 
 let apiKey = "05156c2c63a8902e2252fa022c9b2124";
 let trendingUrl = "https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US"
 let searchUrl = "https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=The&page=2"
 let populerUrl = "https://api.themoviedb.org/3/movie/popular?api_key=05156c2c63a8902e2252fa022c9b2124&language=en-US&page=1";
 let topMoviesUrl = "https://api.themoviedb.org/3/movie/top_rated?api_key=05156c2c63a8902e2252fa022c9b2124&language=en-US&page=1";
 
 app.listen(PORT,() => {
    console.log(`Hello on port ${PORT}`);
});


 app.get("/", handlehomePage);
 app.get("/favorite", favoriteHandler);
 app.get("/trending",trendingHandler);
 app.get("/search",searchHandler);
 app.get("/getMovies", getHandler);
 app.post("/addMovie" ,postHandler);
 app.use(handleError);


 
 function getHandler(req, res) {
    let sql = `SELECT * FROM Movies ;`;
    client.query(sql).then((result)=>{
        console.log(result);
        res.json(result.rows);
    }).catch((err) => {
         handleError(err, req, res);
    })
 }

 function handleError(error,req,res){
     res.status(500).send(error ,"Sorry, something went wrong");
     res.status(401).send(error , "Page not found");
 }


 function Movie (id,title,release_date, poster_path,overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date ;
    this.poster_path = poster_path;
    this.overview = overview;
} 


 function handlehomePage(req, res) {
     let newMovie = new Movie(
         movieData.title,
         movieData.poster_path,
         movieData.overview,
         )

     res.json(newMovie);
     }
 

 function favoriteHandler (req, res) {
    res.send("Welcome to Favorite Page");
}



function trendingHandler(req,res){
    axios.get(trendingUrl).then(mov => {
        let trendingMovies = mov.results.map(movies => {
            return new Movie(
                movies.id,
                movies.title,
                movies.release_date,
                movies.poster_path,
                movies.overview
                )
        })
        res.json(trendingMovies);

    }).catch((error =>{
        console.log(error);
        res.send("error 401 page not found");}
        ))
}

function searchHandler (req,res){
    axios.get(searchUrl).then(mov1 => {
        let searchMovies = mov1.results.map(movies => {
            return new Movie(
                movies.id,
                movies.original_title,
                movies.release_date,
                movies.poster_path,
                movies.overview
                )
        })
        res.json(searchMovies);

    }).catch((error =>{
        console.log(error);
        res.send("error 401 page not found");
    }))
    
}



/*function handleError(){
        try {
            decodeURI("%%%");
            }
        catch(err) {
            document.getElementById("demo").innerHTML = "404 Page not found";
            }
    
    }
    */


/*Handle errors
Create a function to handle the server error (status 500)
Create a function to handle "page not found error" (status 404)
Response Example:
{
"status": 500,
"responseText": "Sorry, something went wrong"
}
*/
/* let movieInfo = new Movie(
        movieData.id,
        movieData.title,
        movieData.release_date,
        movieData.poster_path,
        movieData.overview,
        )
        */
