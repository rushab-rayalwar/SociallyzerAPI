//core modlues

//thied-party modules

//custom modules
import { users } from "../../users/models/sociallyzer.usersModel.js";
import { posts } from "../../posts/models/sociallyzer.postsModel.js";

let likes = [];

export default class Like {
    constructor(postId,userId){
        this.postId = postId; console.log(userId,'is the userId');
        let user = users.find(u=>u.id == userId);   // the case in which the userId dosent exist / invalid is considered in the method that calls the constructor
        this.likedBy = [{userName:user.name,userId:user.id}]
    }
    //static methods
    static toggleLike(postId,userId){
        let postIndexInPostsArray = posts.findIndex(p=>p.id===postId);
        let userIndexInUsersArray = users.findIndex(u=>u.id===userId);
        if(postIndexInPostsArray>=0){ // postId is valid
            let likeIndexInLikesArray = likes.findIndex(l=>l.postId === postId);
            if(likeIndexInLikesArray>=0){ // at least a like exists for the post, ie the like object for the post exists
                let userIndexInLikedByArray = likes[likeIndexInLikesArray].likedBy.findIndex(l=>l.userId === userId);
                if(userIndexInLikedByArray>=0){ // the user had liked the post
                    likes[likeIndexInLikesArray].likedBy.splice(userIndexInLikedByArray,1);
                    posts[postIndexInPostsArray].likes = Math.max(0, posts[postIndexInPostsArray].likes - 1); // decrement in the likes, ensuring it does not go below -1 
                    let indexOfPostInTheLikedPostsArray = users[userIndexInUsersArray].likedPosts.indexOf(postId); 
                    users[userIndexInUsersArray].likedPosts.splice(indexOfPostInTheLikedPostsArray,1);
                    return {code:200,message:"Like Removed",success:true};
                } else { // the user is liking the post for the first time
                    likes[likeIndexInLikesArray].likedBy.push({userName:users[userIndexInUsersArray].name, userId:users[userIndexInUsersArray].id});
                    users[userIndexInUsersArray].likedPosts.push(postId);
                    posts[postIndexInPostsArray].likes += 1;
                    return {code:200,message:"Like Added",success:true};
                }
            } else { // the likes object for the post does not exist
                let newLike = new Like(postId,userId);
                likes.push(newLike);
                users[userIndexInUsersArray].likedPosts.push(postId);
                posts[postIndexInPostsArray].likes += 1;
                return {code:200,message:"Like Added",success:true}
            }
        } else { // postId is invalid
            return {code:400,message:`Post ID ${postId} is invalid`,success:false}
        }
    }
    static getLikes(postId){
        let likeIndex = likes.findIndex(l=>l.postId===postId);
        let postIndex = posts.findIndex(p=>p.id === postId);
        if(postIndex>=0){ // postId is valid
            if(likeIndex>=0){
                let userIds = likes[likeIndex].likedBy;
                let numberOfLikes = userIds.length;
                return {likedBy:userIds,code:200,message:"Successfully fetched the likes for the post",numberOfLikes,success:true};
            } else {
                return {likedBy:null,code:204,message:"Could not find any likes for the Post",numberOfLikes:null,success:false};
            }
        } else { // postId is invalid
            return {likedBy:null,code:400,message:"Post ID is invalid",numberOfLikes:null,success:false};
        }
    }

    //instance methods
}