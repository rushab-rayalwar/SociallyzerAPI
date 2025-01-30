// core

//third party
import express from 'express';

//custom
import BookmarksController from '../controllers/sociallyzer.bookmarksController.js';

let bookmarksRouter = express.Router();

bookmarksRouter.get('/',BookmarksController.getBookmarks);
bookmarksRouter.patch('/:postId',BookmarksController.toggleBookmark);

export default bookmarksRouter;