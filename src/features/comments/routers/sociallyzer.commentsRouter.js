// core modules

// third-party modules
import express from 'express';

// custom modules
import CommentsController from '../controllers/sociallyzer.commentsController.js';

let commentsRouter = express.Router();

commentsRouter.get('/:id',CommentsController.getCommentsForPost);
commentsRouter.post('/:id',CommentsController.addComment);
commentsRouter.put('/:id',CommentsController.updateComment);
commentsRouter.delete('/:id',CommentsController.deleteComment);

export default commentsRouter;