`use strict`


 let PORT = process.env.PORT || 3001 ;
 const express = require("express");
 require("dotenv").config();
 const { default: axios } = require("axios");
 
 const {Client} = require("pg");
 const client = new Client(process.env.DATABASE_URL);
 // creat express app
 let app = express();
 let movieData = require("./Movie_data/data.json");

 app.use(express.json());

 //let movieUrl = `https://api.themoviedb.org/3/movie/(Movie_id)?api_key=05156c2c63a8902e2252fa022c9b2124&language=en-US`

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
 app.get("/populer",populerHandler);
 app.get("/top-movies",topHandler)
 app.get("/getMovies", getHandler);

 //CRUD
 
 app.post("/addMovie" ,postHandler);
 app.put('/UPDATE/MovieId', updateHandler);
 app.delete('/DELETE/MovieId', deleteHandler);
 app.get("/getMovie/MovieId",getMovieHandler)
 app.use(handleError);


 // task 12 req : 
 
function trendingHandler(req,res){
    axios.get(trendingUrl).then(mov => {
        let trendingMovies = mov.data.results.map(movies => {
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
        let searchMovies = mov1.data.results.map(movies => {
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

function populerHandler(req,res){
    axios.get(populerUrl).then(mov => {
        let populerMovies = mov.data.results.map(movies => {
            return new Movie(
                movies.id,
                movies.title,
                movies.release_date,
                movies.poster_path,
                movies.overview
                )
        })
        res.json(populerMovies);

    }).catch((error =>{
        console.log(error);
        res.send("error 401 page not found");}
        ))
}

function topHandler(req,res){
    axios.get(topMoviesUrl).then(mov => {
        let topMovies = mov.data.results.map(movies => {
            return new Movie(
                movies.id,
                movies.title,
                movies.release_date,
                movies.poster_path,
                movies.overview
                )
        })
        res.json(topMovies);

    }).catch((error =>{
        console.log(error);
        res.send("error 401 page not found");}
        ))
}


function handleError(error,req,res){
    res.status(500).send(error ,"Sorry, something went wrong");
    res.status(401).send(error , "Page not found");
}


//CRUD functions 

 function getMovieHandler(req, res) {
     let url = "https://api.themoviedb.org/3/movie/113?api_key=05156c2c63a8902e2252fa022c9b2124&language=en-US"

     axios.get(url).then(result => {
        let movieObj = result.data.results;
        let movie = new Film (movieObj);
        res.json(movie);
        console.log(movieObj);
        console.log(movie);

    }).catch(error => {
        console.log(error);
    })

}

 function updateHandler(req, res) {
    let id = req.params.MovieId;
    let name = req.body.original_title;
    let url = req.body.url;
    let sql = `UPDATE movies SET Movie_Name =$1 ,  poster =$2 WHERE id = ${id} RETURNING *`;
    let values = [name, url];
    client.query(sql, values).then(result => {
        console.log(result.rows[0]);
        res.json(result.rows[0]);
    }).catch()
}

function deleteHandler(req, res) {
    let id = req.params.MovieId;
    let sql = `DELETE FROM movies WHERE id =${id} RETURNING *`;
    client.query(sql).then(result => {
        console.log(result.rows[0]);
        res.status(204).json([]);
    }).catch(err => {
        console.log(err);
    })
}

function postHandler(req,res){
    let name = req.body.movieName; 
    let poster = req.body.poster;
    // let {name,url}= req.body
    let sql = `INSERT INTO favanime (Movie_Name,Poster) VALUES($1,$2) RETURNING *`;
    let values = [name, poster];
    client.query(sql, values).then(result => {
        console.log(result.rows[0]);
        res.json(result.rows)
    }).catch()

}

 function getHandler(req, res) {
    let sql = `SELECT * FROM movies ;`;
    client.query(sql).then((result)=>{
        console.log(result);
        res.json(result.rows);
    }).catch((err) => {
         handleError(err, req, res);
    })
 }
//________________________________________________________


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

client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
})

function Movie (id,title,release_date, poster_path,overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date ;
    this.poster_path = poster_path;
    this.overview = overview;
} 

function Film (movieData) {
    this.id = movieData.id;
    this.title = movieData.title;
    this.overview = movieData.overview;
     // this.release_date = movieData.release_date ;
     // this.poster_path = movieData.poster_path;
} 


   /* let movieInfo = new Movie(
        movieData.id,
        movieData.title,
        movieData.release_date,
        movieData.poster_path,
        movieData.overview,
        )
        */
   
/*function handleError(){
        try {
            decodeURI("%%%");
            }
        catch(err) {
            document.getElementById("demo").innerHTML = "404 Page not found";
            }
    
    }

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
