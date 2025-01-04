//core modules

//third-party modules
import express from 'express';
import cookieParser from 'cookie-parser';

//custom modules
import userRouter from './src/features/users/routers/sociallyzer.usersRouter.js';
import postsRouter from './src/features/posts/routers/sociallyzer.postsRouter.js';
import { errorHandler } from './src/middlewares/sociallyzer.middleware.errorHandler.js';
import {reqLogger} from './src/middlewares/sociallyzer.middleaware.logger.js';
import authenticateUser from './src/middlewares/sociallyzer.middleware.userAuthenticator.js';
import likesRouter from './src/features/likes/routers/sociallyzer.likesRouter.js';
import commentsRouter from './src/features/comments/routers/sociallyzer.commentsRouter.js';

let app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

app.use(reqLogger);
app.use('/api/users',userRouter);
app.use('/api/posts',authenticateUser,postsRouter);
app.use('/api/likes',authenticateUser,likesRouter);
app.use('/api/comments',authenticateUser,commentsRouter);

app.get('/',(req,res)=>{return res.status(200).json({success:true,message:'Welcome to Sociallyzer!'})});

app.use(errorHandler); // middleware to handle errors
app.use((req,res)=>{   // middleware to handle invalid url requests
    return res.status(404).json({success:false,message:'Oops! The requested url does not exist.'});
});

export default app;