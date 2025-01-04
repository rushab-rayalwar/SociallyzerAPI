//core modules

//third-party modules
import express from "express";

//custom modules
import LikesController from "../controllers/sociallyzer.likesController.js";

let likesRouter = express.Router();

likesRouter.get("/:postId",LikesController.getLikesForPost);
likesRouter.get("/toggle/:postId",LikesController.toggleLike);

export default likesRouter;