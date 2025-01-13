// core modules

// third-party modules
import express from 'express';

// custom modules
import CommentsController from '../controllers/sociallyzer.commentsController.js';

let commentsRouter = express.Router();

commentsRouter.get('/:id',CommentsController.getCommentsForPost);
commentsRouter.post('/:id',CommentsController.addComment);
commentsRouter.delete('/:id',CommentsController.deleteComment);
commentsRouter.put('/:id',CommentsController.updateComment);

export default commentsRouter;