//core modules

//third-party modules

//custom modules
import { ApplicationError } from "../../../middlewares/sociallyzer.middleware.errorHandler.js";
import CommentsModel from "../models/sociallyzer.commentsModel.js"

export default class CommentsController {
    constructor(){}
    //static methods
    static getCommentsForPost(req,res){
        let postId = req.params.id;

        let limit = req.query.limit; // pagination parameters
        let page = req.query.page;

        let comments = CommentsModel.getCommentsFor(postId,limit,page);
        if(comments.success){
            return res.status(comments.code).json({success:true,message:comments.message,data:comments.data});
        } else {
            throw new ApplicationError(comments.code,comments.message);
        }
    }
    static addComment(req,res) {
        let userId = req.tokenPayload.userId;
        let postId = req.params.id;
        let content = req.body.content;
        let addCommentResponse = CommentsModel.addComment(postId,userId,content);
        if(addCommentResponse.success){
            return res.status(addCommentResponse.code).json({success:true,message:addCommentResponse.message,data:addCommentResponse.data})
        } else {
            throw new ApplicationError(addCommentResponse.code,addCommentResponse.message);
        }
    }
    static deleteComment(req,res){
        let commentId = req.params.id;
        let userId = req.tokenPayload.userId;
        let deleteCommentResponse = CommentsModel.deleteComment(commentId,userId);
        if(deleteCommentResponse.success){
            return res.status(deleteCommentResponse.code).json({success:true,message:deleteCommentResponse.message});
        } else {
            throw new ApplicationError(deleteCommentResponse.code,deleteCommentResponse.message);
        }
    }
    static updateComment(req,res){
        let commentId = req.params.id;
        let userId = req.tokenPayload.userId;
        let content = req.body.content;
        let updateCommentResponse = CommentsModel.updateComment(commentId,userId,content);
        if(updateCommentResponse.success){
            return res.status(updateCommentResponse.code).json({success:true,message:updateCommentResponse.message});
        } else {
            throw new ApplicationError(updateCommentResponse.code,updateCommentResponse.message);
        }
    }
    //instance methods
}