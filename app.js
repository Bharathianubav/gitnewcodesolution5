const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, 'moviesData.db');
const app = express();
app.use(express.json());

let database = null;
const initializeDbAndServer = async () => {
    try {
        database = await open({
            filename: databasePath,
            driver: sqlite3.Database,
        });
        app.listen(3000, () => {
            console.log("Server Running at http://localhost:3000/");
        })

    }catch(error) {
        console.log(`DB Error: $(e.message}`);
        process exit(1);
    }
};
initializeDbAndServer();

const convertMovieDbObjectToResponseObject= (dbObject) => {
    return { 
        movieId: dbObject.movie_id,
        directorID: dbObject.director_id,
        movieName: dbObject.movie_name,
        leadActor: dbObject.lead_actor,

};

};

const convertDirectorDbObjectToResponseObject = (dbObject) => {
 return {
    directorID: dbObject.director_id,
    directorName: dbObject.director_name,
 };
};
app.get("/movies/", async(request,response) => {
    const getMovieQuery = `
    SELECT 
    *
    FROM 
    movie;`;
    const moviesArray = await database.all(getMovieQuery);
    response.send(
        moviesArray.map((eachMovie) => ({ movieNmae: eachMovie.movie_name }))
);
        });
    

app.get("/movies/:movieId/",async (request, response) => {
    const { movieId } = request.params;
    const getMovieQuery = `
    SELECT
     *
    FROM 
    movie
    WHERE 
    movie_id = ${movieId};`;
    const movie = await database.get(getMovieQuery);
    
    response.send(convertMovieDbObjectToResponseObject(movie));

});
app.post("/movies/", async (request, response) => {
    const { directorId, movieName, leadActor } = request.body;
    const postMovieQuery = `
    INSERT INTO 
    movie (director_id, movie_name, lead_actor)
    VALUES 
    (${directorId}, `${movieName}`, `${leadActor}`);`;
    await database.run(postMovieQuery);
    response.send("Movie Successfully Added");
});

app.put("/movies/:moviesId/", async (request,response) => {
    const {movieId} = request.params;
    
    const {directorId, movieName, leadActor }= request.body;
    const updateMovieQuery = `
    UPDATE 
    movie 
    SET 
    director_id=${directorId},
    movie_name=`${movieName}`,
    lead_actor=`${leadActor}`
    WHERE 
    movie_id = ${movie_id};`;


    await database.run(updateMovieQuery);
    response.send("Movie Details Updated");
    
});


app.delete("/movies/:moviesId/",async(request,response) => {
    const {movieId} = request.params;
    const deleteMovieQuery = `
    DELETE FROM 
    movie 
    WHERE 
    movie_id = ${movieID};`;
    await database.run(deleteMovieQuery);
    response.send("Movie Removed");

});




app.get("/directors/",async(request,response) => {
    const getDirectorsQuery = `
    SELECT * 
    FROM 
    director ;`;
    const moviesArray = await database.all(getAllDirectorQuery);
    response.send(
        directorsArray.map(each.director) => 
        convertDirectorDbObjectToResponseObject(each.director)
        )

    );

});
 


 app.get("/directors/:directorId/movies/", async(request,response) = > {
    const {directorId} = request.params;
    const getDirectorMovieQuery = `
    SELECT 
    movie_name 
    FROM 
    movie
    
    WHERE 
    director_id = `${directorId}``;`;
    const moviesArray = await databasee.all(getDirectorMovieQuery);
    
    response.send(
        moviesArray.map((movienames) => ({ movieName: eachMovie.movie_name }) )
    );
    

 });
 module.exports = app;

