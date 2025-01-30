//core

//third-party

//custom
import { posts } from "../../posts/models/sociallyzer.postsModel.js";

export let bookmarks = [];

export default class Bookmark {
    constructor(userId,postId){
        this.bookmarkedBy = userId;
        this.postIds = [postId];
    }

    //static methods
    static toggleBookmark(postId,userId){
        let postExists = posts.some(p=>p.id===postId && !p.isDraft && !p.isArchived);
        if(!postExists){
            return {success:false,message:"Could not find the post",code:404}
        }

        let index = bookmarks.findIndex(b=>b.bookmarkedBy === userId);
        let isBookmarkAdded = true;
        if(index >= 0){  // bookmark object for the user exists
            let bookmarkObject = bookmarks[index];
            let postBookmarkIndex = bookmarkObject.postIds.indexOf(postId);
            if(postBookmarkIndex >= 0){  // post is already bookmarked by the user
                bookmarks[index].postIds.splice(postBookmarkIndex,1);
                isBookmarkAdded = false;
                if(bookmarks[index].postIds.length === 0){
                    bookmarks.splice(index,1);
                }
            }
            else{ // post is being bookmarked by the user
                bookmarks[index].postIds.push(postId);
            }
        }else{ // bookmark object for the post does not exist
            let bookmark = new Bookmark(userId,postId);
            bookmarks.push(bookmark);
        }

        let message = isBookmarkAdded ? 'Post added to bookmarks' : 'Post removed from bookmarks';

        return {success:true,message,code:200}
    }

    static getBookmarks(postId,userId,limit=Infinity,page=1){
        let bookmarkedPosts = [];
        let message = '';

        let post = posts.find(p=>p.id === postId);
        if(!post){
            return {success:false,message:"Invalid Post ID",code:400,data:null}
        }

        let userIsAuthorized = (post.userId === userId);
        if(!userIsAuthorized){
            return {success:false,message:"Unauthorized",code:403,data:null}
        }

        let bookmarkObject = bookmarks.find(b=>b.bookmarkedBy === userId);
        if(!bookmarkObject || bookmarkObject.postIds.length === 0) {
            return {success:true,message:"User hasn't bookmarked any posts yet.",code:200,data:{page:1,totalPages:1,posts:[]}}
        } else {
            let postIds = bookmarkObject.postIds;
            for(let pId of postIds){
                let postObj = posts.find(pObj=>pObj.id === pId);
                if(postObj){
                    bookmarkedPosts.push(postObj)
                } else {
                    message = "Some bookmarked posts no longer exist.";
                    continue;
                }
            }
        }
        //pagination logic
        let totalPages = 1;
        if(limit!=Infinity){
            if(limit < 1){
                return {success:false,code:400,message:"Limit Parameter should be greater than 0.",data:null};
            }
            totalPages = Math.max( Math.ceil(bookmarkedPosts.length/limit), 1); // Math.max ensures that the totalPages remains 1 even when no bookmarked posts exist
            if(page > totalPages || page < 1) {
                return {success:false,message:"Page does not exist",code:404,data:null}
            }
            let lowerIndex = (page - 1) * limit;
            let upperIndex = lowerIndex + limit;
            bookmarkedPosts = bookmarkedPosts.slice(lowerIndex,upperIndex);
        }

        message = 'Bookmarks retrieved successfully.'+message;
        return {success:true,message,code:200,data:{page,totalPages,posts:bookmarkedPosts}}
    }
}