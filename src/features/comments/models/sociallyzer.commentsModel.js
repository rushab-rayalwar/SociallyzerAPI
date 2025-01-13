// core modules
import crypto from 'crypto';

// third-party modules

// custom modules
import { users } from "../../users/models/sociallyzer.usersModel.js";
import { posts } from "../../posts/models/sociallyzer.postsModel.js";

let comments = [];

export default class Comment {
    constructor(userId,postId,content){
        this.postedByUserId = userId;
        this.postedForPostId = postId;
        this.content = content;
        this.id = 'COMMENT-'+Date.now()+crypto.randomBytes(16).toString(hex);
        this.timeStamp = Date.now(); // the timestamp is in milliseconds so that it can be formatted as desired at the client side
    }

    //static methods
    static getCommentsFor(postId){
        let postIdIsValid = posts.some(p=>p.id===postId);
        if(!postIdIsValid){
            return {success:false,message:"Post ID is invalid.",code:400,data:[]};
        }
        let commentsForPost = comments.filter(c=>c.postedForPostId===postId);
        if(commentsForPost.length === 0 ){ // no comments found for the post in the comments array
            return {success:true,code:200,message:"No comments found for the specified post.",data:[]};
        } else {
            return {success:true,code:200,message:"Comments fetched successfully.",data:commentsForPost};
        }
    }
    static addComment(postId,userId,content){
        let postIndexInThePostsArray = posts.findIndex(p=>p.id===postId);  // no additional validation for userId is required as it is extracted from the JWT token in the authenticator middleware
        if(postIndexInThePostsArray < 0){ // postid is invalid
            return {success:false,code:404,message:"Post ID is invalid.",data:[]};
        }
        let newComment = new Comment(userId,postId,content); console.log(newComment);
        comments.push(newComment);
        posts[postIndexInThePostsArray].comments += 1; // increment the comments count for the post in the post's object in the 'posts' array (imported from the post model)
        return {success:true,code:200,message:`Comment added successfully.`,data:newComment};
    }
    static deleteComment(commentId,userId){
        let commentIndexInCommentsArray = comments.findIndex(c=>c.id===commentId);
        if(commentIndexInCommentsArray<0){ // comment id is in-valid. The userId is validated and extracted by the JWT middleware, so no need to validate again here.
            return {success:false,code:404,message:"Comment ID does not exist."};
        }
        let userIdWhoCommented = comments[commentIndexInCommentsArray].postedByUserId;
        let postId = comments[commentIndexInCommentsArray].postedForPostId; 
        let postIndexInPostsArray = posts.findIndex(p=>p.id===postId);
        let userWhoPostedTheComment = posts[postIndexInPostsArray].userId;
        // Only the user who posted the post and the user who commented on the post are authorized to delete the comment

        if(![userIdWhoCommented,userWhoPostedTheComment].includes(userId)){ // the user is unauthorized to delete the comment
            return {success:false,code:403,message:"User is unathorized to delete the comment."};
        }
        comments.splice(commentIndexInCommentsArray,1);
        posts[postIndexInPostsArray].comments = Math.max(0,posts[postIndexInPostsArray].comments - 1); // decrement in the comments counter ensuring it dosent fall below 0
        return {success:true,code:200,message:"The comment has been deleted successfully."};
    }
    static updateComment(commentId,userId,content){
        let commentIndexInCommentsArray = comments.findIndex(c=>c.id===commentId);
        if(commentIndexInCommentsArray<0){ // commentId is invalid
            return {success:false,code:404,message:"Could not find comment"};
        }
        let userIdIsAuthorized = (comments[commentIndexInCommentsArray].postedByUserId === userId) ? true : false;
        if(!userIdIsAuthorized){
            return {success:false,code:403,message:"User is unauthorized to update this comment",data:{}};
        } else {
            comments[commentIndexInCommentsArray].content = content;
            comments[commentIndexInCommentsArray].timeStamp = Date.now(); // updating the timestamp with the time of updation
            return {success:true,code:200,message:"Comment updated successfully.",data:{updatedComment:comments[commentIndexInCommentsArray]}};
        }
    }
    //instance methods

}