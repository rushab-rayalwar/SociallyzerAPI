//core modules

//third-party modules
import './dotenvConfig.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import swagger from 'swagger-ui-express';
import cors from 'cors';

//custom modules
import userRouter from './src/features/users/routers/sociallyzer.usersRouter.js';
import postsRouter from './src/features/posts/routers/sociallyzer.postsRouter.js';
import { errorHandler } from './src/middlewares/sociallyzer.middleware.errorHandler.js';
import {reqLogger} from './src/middlewares/sociallyzer.middleaware.logger.js';
import authenticateUser from './src/middlewares/sociallyzer.middleware.userAuthenticator.js';
import likesRouter from './src/features/likes/routers/sociallyzer.likesRouter.js';
import commentsRouter from './src/features/comments/routers/sociallyzer.commentsRouter.js';
import docs from './src/docs/swagger.json' assert {type:'json'}; // NOTE
import bookmarksRouter from './src/features/bookmarks/routers/sociallyzer.bookmarksController.js';

let app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

app.use(reqLogger);
app.use('/api/users',userRouter);
app.use('/api/posts',authenticateUser,postsRouter); 
app.use('/api/likes',authenticateUser,likesRouter);
app.use('/api/comments',authenticateUser,commentsRouter);
app.use('/api/bookmarks',authenticateUser,bookmarksRouter);
app.use('/api/docs',swagger.serve,swagger.setup(docs));

app.get('/',(req,res)=>{return res.status(200).json({success:true,message:'Welcome to Sociallyzer!'})});

app.use(errorHandler); // handle errors
app.use((req,res)=>{   // handle invalid url requests
    return res.status(404).json({success:false,message:'The requested URL was not found. Please check the documentation for the correct URL: /api/docs'});
});

export default app;