//core modules
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

//third-party modules
import {users} from '../../users/models/sociallyzer.usersModel.js';

//custom modules

let stopWords = [
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "he", 
    "in", "is", "it", "its", "of", "on", "that", "the", "to", "was", "were", "will", 
    "with", "about", "above", "after", "again", "against", "all", "am", "an", "any", 
    "are", "aren't", "because", "been", "before", "being", "below", "between", 
    "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", 
    "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", 
    "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", 
    "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", 
    "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", 
    "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", 
    "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", 
    "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", 
    "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", 
    "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", 
    "the", "their", "theirs", "them", "themselves", "then", "there", "there's", 
    "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", 
    "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", 
    "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", 
    "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", 
    "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", 
    "you're", "you've", "your", "yours", "yourself", "yourselves"
  ]; // these are the words to be excluded while extracting keywords from a caption or a search query

export let posts = [
    {
        userId:'defaultUser',
        caption:'Heyy! I captured a really good picture today!!',
        id:'lake',
        pictureUrl:'/api/posts/pics/defaultUser/lake',
        timeStamp:0,
        imageFileExtension: '.jpg',
        likes: 0,
        comments: 0,
        captionKeywords: ['good','picture'],
        isDraft: false,
        isArchived: false
    },
    {
        userId:'defaultUser',
        caption:'The calm night!',
        id:'tree',
        pictureUrl:'/api/posts/pics/defaultUser/tree',
        timeStamp:0,
        imageFileExtension: '.jpg',
        likes: 0,
        comments: 0,
        captionKeywords: ['night','calm'],
        isDraft: false,
        isArchived: false
    },
    {
        userId:'defaultUser',
        caption:'Blessing your feed with an awesome bird picture!!',
        id:'bird',
        pictureUrl:'/api/posts/pics/defaultUser/bird',
        timeStamp:0,
        imageFileExtension: '.jpg',
        likes: 0,
        comments: 0,
        captionKeywords: ['blessing','feed','bird','picture'],
        isDraft: false,
        isArchived: false
    }
];

export function generateUniquePostId() {
    let timeStamp = Date.now();
    let buffer = crypto.randomBytes(16).toString('hex');
    return `Post-${timeStamp}-${buffer}`;
}

export default class Post {
    constructor(userId,postId,caption,imageFileExtension,draft = false) {
        this.userId = userId;
        this.caption = caption;
        this.id = postId;
        this.pictureUrl = `/api/posts/pics/${userId}/${postId}`; // NOTE this
        this.timeStamp = Date.now();
        this.imageFileExtension = imageFileExtension; // NOTE : this is useful for searching if the picture exists before sending it as a response
        this.likes = 0; // the post object will only contain the number of likes. Other details like the list of users who liked is stored in the likes modal / likes object for that post
        this.comments = 0; // post obj will contain only the number of comments. The comments can be retieved from the comments modal / comments object
        
        this.captionKeywords = caption.trim().toLowerCase().replace(/[^a-zA-Z0-9\s]/g,'').split(/\s+/).filter(word=>!stopWords.includes(word));//NOTE
        this.isDraft = draft;
        this.isArchived = false;
    }
    //static methods
    static getAll(){
        let allPosts = posts.filter(p=>!p.isDraft&&!p.isArchived);
        return {posts:allPosts};
    }
    static getById(id){
        let post = posts.find(p=>p.id === id);
        if(post){
            return {found:true, details:post, code:200, message:"Post retrieved successfully"};
        } else {
            return {found:false, details:null, code:404, message:"Could not find the post"};
        }
    }
    static getForUser(userID){         // for posts posted by the user sending the request
        let postsForUser = posts.filter(p=>{p.userId === userID});
        if(postsForUser.lenght > 0){
            return {found:true, details:postsForUser,code:200,message:"Posts retrieved successfully"}
        } else {
            return {found:false, details:null,code:404,message:'No posts yet!'}
        }
    }
    static getPostsForUserId(userId){       // for any other user's posts
        let userExists = users.some(u=>{
            if(u.id===userId){
                return true;
            };
        });
        if(!userExists){
            return {success:false,message:"Could not find the user with the specified userID",code:404,data:[]};
        }
        let postsByUser = posts.filter(post=>post.userId===userId);
        if(postsByUser.length==0){
            return {success:true,message:'No posts posted by the user.',code:200,data:[]};
        }
        return {success:true,message:"Posts retrieved successfully",code:200,data:postsByUser}
    }
    static add(userId,postId,caption,imageFileExtension,isDraft){
        let post = new Post(userId,postId,caption,imageFileExtension,isDraft);
        posts.push(post);
        return {added:true, details:post, code:200};
    }
    static getPost(userId,postId) {
        let post = posts.find(p=>p.id == postId && p.userId == userId);
        if(!!post){
            return {exists:true,message:null,details:post,code:200}
        } else {
            return {exists:false,message:'Post by user does not exist',details:null,code:404};
        }
    }
    static getPicture(userId,postId){
        let post = posts.find(p=>p.id==postId);
        if(post){
            let picturePath = path.resolve('uploads',userId,`${postId}${post.imageFileExtension}`);
            let pictureExists = fs.existsSync(picturePath);
            if(pictureExists){
                return {accessible:true,message:"Picture found successfully",path:picturePath,code:200};
            } else {
                return {accessible:false,message:"Picture could not be found in the specified directory",path:null,code:404};
            }
        } else {
            return {accessible:false,message:"Post does not exist",path:null,code:404};
        }
    }
    static delete(postId,userId) {
        let postIndex = posts.findIndex(p=>p.id == postId);
        if(postIndex >= 0){
            let userAuthorised = (posts[postIndex].userId == userId);
            if(userAuthorised){
                let deletedPostId = posts[postIndex].id;
                posts.splice(postIndex,1);
                let imagePath = path.join(process.cwd(),'uploads',userId,`${postId}${posts[postIndex].imageFileExtension}`);
                let imageFileExists = fs.existsSync(imagePath);
                if(imageFileExists){
                    fs.unlink(imagePath,(err)=>{
                        if(err){
                            console.error('Error deleting the image file');
                        }
                    });
                }
                return {success:true,deletedPostId,code:200,message:"Post deleted successfully"};
            } else {
                return {success:false,deletedPostId:null,code:401,message:"User unauthorized"};
            }
        } else {
            return {success:false,deletedPostId:null,code:404,message:"Post to be deleted does not exist"};
        }
    }
    static getfilteredPosts(query){
        if(!query || typeof query !== 'string'){
            return{success:false,posts:[],message:"Search query is invalid",code:400}
        }
        let queryKeywords = query.trim().toLowerCase().replace(/[^a-zA-Z0-9\s]/g,'').split(/\s+/).filter(word=>!stopWords.includes(word)); //NOTE
        let queryKeywordsSet = new Set(queryKeywords); // NOTE
        let matchingPosts = posts.filter(post=>
            post.captionKeywords.some(c=>queryKeywordsSet.has(c)) // NOTE this is more efficient than using array's .includes() method due3 to how the data structures are designed
        );
        if(matchingPosts.length===0){
            return {success:true,posts:[],message:"No matching posts found...",code:404}
        } else {
            return {success:true,posts:matchingPosts,message:"Matching posts found",code:200}
        }
    }
    static getDrafts(userId){
        // userId is extracted from the JWT token. Hence no additional verification is needed
        let draftPosts = posts.filter(p=>p.userId===userId && p.isDraft);
        if(draftPosts.length === 0){
            return {success:true,code:200,message:"No posts saved as draft", data:[]}
        }
        return {success:true,code:200,message:"Draft posts fetched successfully", data:draftPosts};
    }
    static toggleArchive(userId,postId){
        let postIndex = posts.findindex(p=>p.id===postId);
        if(postIndex < 0){
            return {success:false,code:400,message:"Invalid Post ID"}
        }
        let post = posts[postIndex];
        if(!post.userId === userId){
            return {success:false,code:403,message:"Unauthorized"}
        }
        if(post.isDraft){
            return {success:false,code:400,message:"Cannot add draft to the archive"}
        }
        post.isArchived = !post.isArchived;
        return {success:true,code:200,message:""}
    }
    //instance methods
}