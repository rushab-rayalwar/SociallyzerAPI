// core

// third-party

// custom
import Bookmark from "../models/sociallyzer.bookmarksModel.js";
import { ApplicationError } from "../../../middlewares/sociallyzer.middleware.errorHandler.js";

export default class BookmarksController {
    constructor(){

    }
    //static methods
    static toggleBookmark(req,res){
        let postId = req.params.postId;
        let userId = req.tokenPayload.userId;
        
        let response = Bookmark.toggleBookmark(postId,userId);
        if(response.success){
            return res.status(response.code).json({success:response.success,message:response.message});
        } else {
            throw new ApplicationError(response.code,response.message);
        }
    }
    static getBookmarks(req,res){
        let userId = req.tokenPayload.userId;

        let limit = req.query.limit; // pagination parameters
        let page = req.query.page;

        let response = Bookmark.getBookmarks(postId,userId,limit,page);
        if(response.success){
            return res.status(response.code).json({success:response.success,message:response.message,data:response.data})
        } else {
            throw new ApplicationError(response.code,response.message);
        }
    }
}