import express from "express";
import moviesRouter from './routes/Movies.js';
import reviewsRouter from './routes/Reviews.js';
import usersRouter from './routes/Users.js';


const app = express();
const PORT = 4000;

//setup
app.set("view engine", "pug");
app.set("views", "./views");

//middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//logging Middleware
const loggingMiddleware = (req, res, next) => {
    const currentTime = new Date().toISOString();
    console.log(`[${currentTime}] ${req.method} request to ${req.url}`);
    next(); 
};

app.use(loggingMiddleware);

//routes to render Pug templates 'Home'
app.get('/', (req, res) => {
    res.render('home');
});


//use routers
app.use('/movies', moviesRouter); 
app.use('/reviews', reviewsRouter); 
app.use('/users', usersRouter); 

//error handling middleware
app.use((err, _, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" }); 
});

//start the server
app.listen(PORT, () => 
    console.log(`Server running on port: ${PORT}`));