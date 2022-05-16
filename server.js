`use strict`

 require("dotenv").config();

 let PORT = process.env.PORT || 3005 ;
 
 const {Client} = require("pg");
 const client = new Client(process.env.DATABASE_URL);
 const bodyParser = require('body-parser');
 const express = require("express");
 let app = express();


 
 const { default: axios } = require("axios");
 let cors = require("cors");
 

 app.use(bodyParser.json());

 app.use(cors());
 let movieData = require("./Movie_data/data.json");


 //app.use(express.json());

 //let movieUrl = `https://api.themoviedb.org/3/movie/(Movie_id)?api_key=05156c2c63a8902e2252fa022c9b2124&language=en-US`

 // API linkes for Task 12
 let apiKey = "05156c2c63a8902e2252fa022c9b2124";
 let trendingUrl = "https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US"
 let searchUrl = "https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=The&page=2"
 let populerUrl = "https://api.themoviedb.org/3/movie/popular?api_key=05156c2c63a8902e2252fa022c9b2124&language=en-US&page=1";
 let topMoviesUrl = "https://api.themoviedb.org/3/movie/top_rated?api_key=05156c2c63a8902e2252fa022c9b2124&language=en-US&page=1";
 

 app.get("/", handlehomePage);
 app.get("/favorite", favoriteHandler);
 app.get("/trending",trendingHandler);
 app.get("/search",searchHandler);
 app.get("/populer",populerHandler);
 app.get("/top-movies",topHandler)
 

 //CRUD
 
 app.post("/addMovie" ,postHandler);
 app.get("/getMovies", getHandler);

 app.put('/UPDATE/:MovieId', updateHandler);
 app.delete('/DELETE/:MovieId', deleteHandler);
 app.get("/getMovie/:MovieId",getMovieHandler);

 app.use(handleError);




// Task 11

function handlehomePage(req, res) {
    let newMovie = new Film(
        movieData.title,
        movieData.poster_path,
        movieData.overview,
        )

    res.json(newMovie);
    }

function favoriteHandler (req, res) {
    res.send("Welcome to Favorite Page");
   }
  
function Film (title,poster_path,overview) {
    
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
} 

function handleError(err,req,res){
    console.log(err);
   res.status(500).send(err ,"Sorry, something went wrong");

   // res.status(401).send(error , "Page not found");
}


// Task 12 : 
 
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

function Movie (id,title,release_date, poster_path,overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date ;
    this.poster_path = poster_path;
    this.overview = overview;
} 



//CRUD functions 

//Task 13 :

 function getHandler(req, res) {
     let sql = `SELECT * FROM movies ;`;
     client.query(sql).then((result)=>{
        console.log(result);
        res.json(result.rows);
     }).catch((err) => {
         handleError(err, req, res);
     })
}

function postHandler(req,res){

    let {Movie_Name,Poster,comment}= req.body ;
 
    let sql = `INSERT INTO movies (Movie_Name,Poster,comment) VALUES($1,$2,$3) RETURNING *`;
    let values = [Movie_Name,Poster,comment];
    client.query(sql, values).then(result => {
        console.log(result.rows[0]);
        res.json(result.rows)
    }).catch((err) => {
        handleError(err, req, res);
    })

}

//Task 14 :

 function updateHandler(req, res) {
    let id = req.params.MovieId;
    let comment = req.body.comment

    let sql = `UPDATE movies SET comment =$1  WHERE id = ${id} RETURNING *;`
    let values = [comment];

    client.query(sql, values).then(result => {
        console.log(result.rows[0]);
        res.json(result.rows[0]);
    }).catch((err) => {
        handleError(err, req, res);
    })
}

function deleteHandler(req, res) {
    let id = req.params.MovieId;

    let sql = `DELETE FROM movies WHERE id =${id} RETURNING *;`;

    client.query(sql).then(result => {
        console.log(result.rows[0]);
        res.status(204).json([]);
    }).catch(err => {
        console.log(err);
    })
}

 function getMovieHandler(req, res) {
    let id=req.params.MovieId;
    let sql = `SELECT * FROM movies WHERE id=${id} RETURNING *;`;
    client.query(sql).then((result)=>{
        console.log(result);
        res.json(result.rows);
    }).catch()
}


//________________________________________________________


client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
})
  




/* let movieInfo = new Movie(
        movieData.id,
        movieData.title,
        movieData.release_date,
        movieData.poster_path,
        movieData.overview,
        )
        */
