//core modules

//third-party modules
import express from 'express';
import upload from '../../../middlewares/sociallyzer.middleware.fileUploader.js';

//custom modules
import PostsController from '../controllers/sociallyzer.postsController.js';

let postsController = new PostsController();

let postsRouter = express.Router();

postsRouter.get('/all', postsController.getAll); // Fetch all posts
postsRouter.get('/user/:userId', postsController.getPostsForUserId); // Posts for a specific user
postsRouter.get('/pics/:userId/:postId', postsController.getPicture); // Fetch a picture for a specific post
postsRouter.get('/:id', postsController.getSpecificPost); // Fetch a specific post by ID
postsRouter.get('/', postsController.getUserPosts); // Posts by the current user
postsRouter.post('/',upload.single('image'), postsController.addPost); // Add a new post
postsRouter.delete('/:id', postsController.deletePost); // Delete a specific post by ID
// NOTE the order here is important.

postsRouter.get('/filter',postsController.getFilteredPosts);
export default postsRouter;