import Router from 'express';
import { moviesData } from '../models/movies.js'; 

const moviesRouter = Router(); 

//GET route for rendering Pug template
moviesRouter.get('/', (_, res) => {
    res.render('movies', { moviesProp: moviesData });
});

//GET route to fetch movies
moviesRouter.get('/api', (req, res) => {
    let filteredMovies = moviesData; 

    //filter by title
    if (req.query.title) {
        filteredMovies = filteredMovies.filter(movie => 
            movie.title.toLowerCase().includes(req.query.title.toLowerCase())
        );
    }

    //filter by ID
    if (req.query.id) {
        filteredMovies = filteredMovies.filter(movie => 
            movie.id === parseInt(req.query.id)
        );
    }

    //filter by genre
    if (req.query.genre) {
        filteredMovies = filteredMovies.filter(movie => 
            movie.genre.toLowerCase() === req.query.genre.toLowerCase()
        );
    }

    //filter by release date
    if (req.query.releaseDate) {
        filteredMovies = filteredMovies.filter(movie => 
            movie.releaseDate === req.query.releaseDate
        );
    }
 
    //respond with the filtered movies
    res.json(filteredMovies);
    
});

export default moviesRouter;