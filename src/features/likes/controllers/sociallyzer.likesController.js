//core modules

//third-party modules

//custom modules
import { ApplicationError } from "../../../middlewares/sociallyzer.middleware.errorHandler.js";
import LikesModel from "../models/sociallyzer.likesModel.js";

export default class LikesController {
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
    static getLikesForPost(req,res){
        let postId = req.params.postId;
        let likes = LikesModel.getLikes(postId);
        if(likes.success){
            return res.status(likes.code).json({success:true,message:likes.message,data:{numberOfLikes:likes.numberOfLikes,likedBy:likes.likedBy}});
        } else {
            throw new ApplicationError(likes.code,likes.message);
        }
    }
    static getLikedPostsForUser(req,res){
        let userIdSendingTheRequest = req.tokenPayload.userId;
        let userId = req.params.userId;
        let response = LikesModel.getLikedPostsForUser(userIdSendingTheRequest,userId);
        if(response.success){
            return res.status(response.code).json({success:true,message:response.message,data:response.data});
        } else {
            throw new ApplicationError(response.code,response.message);
        }
    }
}