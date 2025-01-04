//core modules

//third-party modules
import express from 'express';

//custom modules
import UserController from '../controllers/sociallyzer.usersController.js';

let usersRouter = express.Router();


usersRouter.post('/register',UserController.handleRegistration);
usersRouter.post('/login',UserController.handleLogin);

export default usersRouter;