//core modules

//third-party modules
import express from "express";

//custom modules
import LikesController from "../controllers/sociallyzer.likesController.js";

let likesRouter = express.Router();

likesRouter.get("/user",LikesController.getLikedPostsForUser);
likesRouter.get("/post/:postId",LikesController.getLikesForPost);
likesRouter.post("/toggle/:postId",LikesController.toggleLike);

export default likesRouter;