import Router from 'express';
import { usersData } from '../models/users.js';

const usersRouter = Router();

//GET route for rendering Pug template
usersRouter.get('/', (_, res) => {
    res.render('users', { usersProp: usersData });
});

//GET route to render the thank-you Pug template
usersRouter.get('/thank-you', (req, res) => {
    res.render('thank-you'); 
});

//GET route for fetching a user by user ID through API
usersRouter.get('/api/:userId', (req, res) => {
    const { userId } = req.params;

    const existingUser = usersData.find(u => u.id === parseInt(userId));
    if (!existingUser) {
        return res.status(404).json({ message: "User not found." });
    }

    res.json(existingUser);
});

//POST route for creating a new user account
usersRouter.post('/submit-user', (req, res) => {
    const { username, email, password } = req.body;

    //validate input to check for existing user
    const existingUser = usersData.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "Email already registered." });
    }

    //create a new user object
    const newUser = {
        id: usersData.length + 1, 
        username,
        email,
        password 
    };

    //add the new user to the users array
    usersData.push(newUser);

    //check if the request came from an API (to return JSON) or a regular user
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
        //respond with JSON for API requests
        return res.status(201).json({ message: "User registered successfully!", user: newUser });
    }

   //redirect to thank-you page 
   res.redirect('/users/thank-you'); 
    
});



export default usersRouter;