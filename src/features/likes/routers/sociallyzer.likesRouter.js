//core modules

//third-party modules
import express from "express";

//custom modules
import LikesController from "../controllers/sociallyzer.likesController.js";

let likesRouter = express.Router();

likesRouter.post("/toggle/:postId",LikesController.toggleLike);
likesRouter.get("/:postId",LikesController.getLikesForPost);

export default likesRouter;