//core modules

//third-party modules
import express from 'express';
import upload from '../../../middlewares/sociallyzer.middleware.fileUploader.js';

//custom modules
import PostsController from '../controllers/sociallyzer.postsController.js';

let postsController = new PostsController(); // Make instance of the controller

let postsRouter = express.Router();

// GET Routes
postsRouter.get('/search', (req, res) => postsController.searchPosts(req, res)); // Search posts
postsRouter.get('/filter', (req, res) => postsController.getFilteredPosts(req, res)); // Filtered posts
postsRouter.get('/all', (req, res) => postsController.getAll(req, res)); // Fetch all posts
postsRouter.get('/drafts', (req, res) => postsController.getDrafts(req, res)); // Fetch draft posts
postsRouter.get('/archive', (req, res) => postsController.getArchivedPosts(req, res)); // Fetch archived posts
postsRouter.get('/user/:userId', (req, res) => postsController.getPostsForUserId(req, res)); // Posts for a specific user
postsRouter.get('/pics/:userId/:postId', (req, res) => postsController.getPicture(req, res)); // Fetch a picture for a specific post
postsRouter.get('/:id', (req, res) => postsController.getSpecificPost(req, res)); // Fetch a specific post by ID
postsRouter.get('/', (req, res) => postsController.getUserPosts(req, res)); // Posts by the current user

// POST Routes
postsRouter.post('/draft', upload.single('image'), (req, res) => postsController.addDraft(req, res)); // Add post as a draft
postsRouter.post('/', upload.single('image'), (req, res) => postsController.addPost(req, res)); // Add a new post

// DELETE Route
postsRouter.delete('/:id', (req, res) => postsController.deletePost(req, res)); // Delete a specific post by ID

// PATCH Routes
postsRouter.patch('/archive/:postId', (req, res) => postsController.toggleArchive(req, res)); // Toggle post archive
postsRouter.patch('/postDraft/:id', (req, res) => postsController.postDraft(req, res)); // Publish a draft post

export default postsRouter;