//core modules

//third-party modules
import express from "express";

//custom modules
import LikesController from "../controllers/sociallyzer.likesController.js";

let likesRouter = express.Router();

likesRouter.post("/toggle/:postId",LikesController.toggleLike);
likesRouter.get("/post/:postId",LikesController.getLikesForPost);
likesRouter.get("/users/:userId",LikesController.getLikedPostsForUser);

export default likesRouter;