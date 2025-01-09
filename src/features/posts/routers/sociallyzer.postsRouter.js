//core modules

//third-party modules
import express from 'express';
import upload from '../../../middlewares/sociallyzer.middleware.fileUploader.js';

//custom modules
import PostsController from '../controllers/sociallyzer.postsController.js';

let postsController = new PostsController(); // Make instance of the controller

let postsRouter = express.Router();

postsRouter.get('/all', (req,res)=>postsController.getAll(req,res)); // Fetch all posts  d
postsRouter.get('/drafts',(req,res)=>postsController.getDrafts(req,res)); // Fetch draft posts  d
postsRouter.get('/user/:userId', (req,res)=>postsController.getPostsForUserId(req,res)); // Posts for a specific user  d
postsRouter.get('/pics/:userId/:postId', (req,res)=>postsController.getPicture(req,res)); // Fetch a picture for a specific post  d
postsRouter.get('/:id', (req,res)=>postsController.getSpecificPost(req,res)); // Fetch a specific post by ID  d
postsRouter.get('/', (req,res)=>postsController.getUserPosts(req,res)); // Posts by the current user  d
postsRouter.post('/draft',upload.single('image'), (req,res)=>postsController.addDraft(req,res)); // Add post as a draft d
postsRouter.post('/',upload.single('image'), (req,res)=>postsController.addPost(req,res)); // Add a new post  d
postsRouter.delete('/:id', (req,res)=>postsController.deletePost(req,res)); // Delete a specific post by ID  d
postsRouter.patch('/archive/:postId',(req,res)=>postsController.toggleArchive(req,res)); // Add post to archive
// NOTE the order here is important.

postsRouter.get('/filter',(req,res)=>postsController.getFilteredPosts(req,res));
export default postsRouter;