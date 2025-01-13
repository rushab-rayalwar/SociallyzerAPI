//core modules

//third-party modules

//custom modules
import { ApplicationError } from "../../../middlewares/sociallyzer.middleware.errorHandler.js";
import LikesModel from "../models/sociallyzer.likesModel.js";

export default class LikesController {
    constructor() {
    }

    //static methods
    static getLikesForPost(req,res){
        let postId = req.params.postId;
        let likes = LikesModel.getLikes(postId);
        if(likes.success){
            return res.status(likes.code).json({success:true,message:likes.message,data:{numberOfLikes:likes.numberOfLikes,likedBy:likes.likedBy}});
        } else {
            throw new ApplicationError(likes.code,likes.message);
        }
    }
    static toggleLike(req,res){
        let postId = req.params.postId;
        let userId = req.tokenPayload.userId;
        let likeAdded = LikesModel.toggleLike(postId,userId);
        if(likeAdded.success){
            return res.status(likeAdded.code).json({success:true,message:likeAdded.message});
        } else {
            throw new ApplicationError(likeAdded.code,likeAdded.message);
        }
    }
}