//core modlues

//thied-party modules

//custom modules
import { users } from "../../users/models/sociallyzer.usersModel.js";
import { posts } from "../../posts/models/sociallyzer.postsModel.js";

let likes = []; // all likes are stored in this array

export default class Like {
        constructor(postId,userId){
        this.postId = postId; console.log(userId,'is the userId');
        let user = users.find(u=>u.id == userId);   // the case in which the userId dosent exist / invalid is considered in the method that calls the constructor
        console.log(user,"-user");
        this.likedBy = [{userName:user.name,userId:user.id}]
    }
    static toggleLike(postId,userId){
        let postIndexInPostsArray = posts.findIndex(p=>p.id===postId && !p.isDraft && !p.isArchived);
        let userIndexInUsersArray = users.findIndex(u=>u.id===userId); // this is always valid because the userId id extracted from the token
        if(postIndexInPostsArray < 0){
            return {code:404,message:"Could not find the post",success:false};
        }
        let likeIndexInLikesArray = likes.findIndex(l=>l.postId === postId);
        if(likeIndexInLikesArray < 0){ // no likes exist for the post
            let newLike = new Like(postId,userId);
            likes.push(newLike);
            users[userIndexInUsersArray].likedPosts.push(postId);
            posts[postIndexInPostsArray].likes += 1;
            return {code:200,message:"Like Added",success:true}
        } else {  // like object for the post exists
            let likedAlready = likes[likeIndexInLikesArray].likedBy.some(like=>like.userId === userId); // checks if the user had liked the post, if so the like will get removed and if not, the like will be added
            if(!likedAlready){
                likes[likeIndexInLikesArray].likedBy.push({userName:users[userIndexInUsersArray].name, userId:users[userIndexInUsersArray].id});
                users[userIndexInUsersArray].likedPosts.push(postId);
                posts[postIndexInPostsArray].likes += 1;
                return {code:200,message:"Like Added",success:true};
            } else {
                let userIndexInLikedByArray = likes[likeIndexInLikesArray].likedBy.findIndex(u=>u.userId === userId);
                likes[likeIndexInLikesArray].likedBy.splice(userIndexInLikedByArray,1);
                posts[postIndexInPostsArray].likes = Math.max(0, posts[postIndexInPostsArray].likes - 1); // ensuring it does not go below 0 in case of an error
                let indexOfPostInTheLikedPostsArray = users[userIndexInUsersArray].likedPosts.indexOf(postId); 
                users[userIndexInUsersArray].likedPosts.splice(indexOfPostInTheLikedPostsArray,1);
                return {code:200,message:"Like Removed",success:true};
            }
        }
    }
    static getLikes(postId){
        let likeIndex = likes.findIndex(l=>l.postId===postId);
        let postIndex = posts.findIndex(p=>p.id === postId && !p.isDraft && !p.isArchived);
        if(postIndex>=0){ // postId is valid
            if(likeIndex>=0){
                let userIds = likes[likeIndex].likedBy;
                let numberOfLikes = userIds.length;
                return {likedBy:userIds,code:200,message:"Successfully fetched the likes for the post",numberOfLikes,success:true};
            } else {
                return {likedBy:null,code:200,message:"Could not find any likes for the Post",numberOfLikes:null,success:false};
            }
        } else { // postId is invalid
            return {likedBy:null,code:400,message:"Post ID is invalid",numberOfLikes:null,success:false};
        }
    }
    static getLikedPostsForUser(userId){
        let userIndex = users.findIndex(u=>u.id===userId);
        if(userIndex < 0){
            return {code:400,message:"Invalid User ID",success:false};
        }
        let likedPosts = users[userIndex].likedPosts;
        if(likedPosts.length===0){
            return {code:200,message:"No posts liked",data:[],success:true};
        }
        let likedPostsData = [];
        likedPosts.forEach(postId=>{
            let postIndex = posts.findIndex(p=>p.id===postId && !p.isDraft && !p.isArchived);
            if(postIndex>=0){
                likedPostsData.push(posts[postIndex]);
            }
        });
        return {code:200,message:"Successfully fetched the liked posts",data:likedPostsData,success:true};
    }
}