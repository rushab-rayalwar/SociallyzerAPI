//core modules
import path from 'path';

//third-party modules

//custom modules
import PostsModel from '../models/sociallyzer.postsModel.js';
import { ApplicationError } from '../../../middlewares/sociallyzer.middleware.errorHandler.js';

export default class PostController {
    //static methods

    //instance methods
    getAll(req,res){
        let limit = req.query.limit; // pagination parameters
        let page = req.query.page;

        let sort = !!req.query.sort; // parameter to fetch posts in the descending order of engagement

        let response = PostsModel.getAll(limit,page,sort);
        if(!response.success) {
            new ApplicationError(response.code,response.message)
        }
        if(response.data.posts.length > 0){
            return res.status(200).json({success:true,data:response.data});
        } else {
            new ApplicationError(404,'Nothing posted yet!');
        }
    }
    getSpecificPost(req,res){
        let postId = req.params.id;
        let userId = req.tokenPayload.userID;
        let post = PostsModel.getById(postId,userId);
        if(post.found){
            return res.status(post.code).json({success:true,post:post.details});
        } else {
            throw new ApplicationError(post.code,post.message);
        }
    }
    getUserPosts(req,res){
        let userID = req.tokenPayload.userId;
        let posts = PostsModel.getForUser(userID);
        if(posts.found){
            return res.status(posts.code).json({success:true,data:response.data,message:posts.message})
        } else {
            return res.status(posts.code).json({success:true,data:response.data,message:posts.message});
        }
    }
    getPostsForUserId(req,res){
        let userId = req.params.userId;
        let posts = PostsModel.getPostsForUserId(userId);
        if(posts.success){
            return res.status(posts.code).json({success:true,message:posts.message,data:posts.data})
        } else {
            throw new ApplicationError(posts.code,posts.message);
        }
    }
    addPost(req,res){
        let {caption} = req.body;
        if(!req.file) throw new ApplicationError(400,"Post image is required.")
        if( !caption || caption.length == 0 ) throw new ApplicationError(400,'Caption cannot be empty.');
        let userId = req.tokenPayload.userId;
        let postId = req.customData.postId;
        let isDraft = !!req.params.isDraft;
        let imageFileExtension = req.customData.imageFileExtension;
        let post = PostsModel.add(userId,postId,caption,imageFileExtension,isDraft);
        return res.status(post.code).json({success:post.added,post:post.details});
    }
    addDraft(req,res){
        let isDraft = true;        
        let {caption} = req.body;
        if(!req.file) throw new ApplicationError(400,"Post image is required.")
        if( !caption || caption.length == 0 ) throw new ApplicationError(400,'Caption cannot be empty.');
        let userId = req.tokenPayload.userId;
        let postId = req.customData.postId;
        let imageFileExtension = req.customData.imageFileExtension;
        let post = PostsModel.add(userId,postId,caption,imageFileExtension,isDraft);
        return res.status(post.code).json({success:post.added,post:post.details});
    }
    getPicture(req,res){
        let userId = req.params.userId;
        let postId = req.params.postId;
        let picture = PostsModel.getPicture(userId,postId);
        if(picture.success){
            res.status(picture.code).sendFile(picture.path);  // NOTE this: this is an asynchronous method
        } else {
            res.status(picture.code).sendFile(path.join(process.cwd(),'uploads','Error.jpg'));
        }
    }
    deletePost(req,res){
        let postId = req.params.id;
        let userId = req.tokenPayload.userId;
        let postDeleted = PostsModel.delete(postId,userId);
        if(postDeleted.success){
            return res.status(postDeleted.code).json({success:true,deletedId:postDeleted.deletedPostId});
        } else {
            throw new ApplicationError(postDeleted.code,postDeleted.message);
        }
    }
    
    search(req,res){
        let query = req.query.query; // search query

        let pageNumber = req.query.page; // parameters for pagination
        let limit = req.query.limit

        let filteredPosts = PostsModel.search(query,pageNumber,limit);
        if(!filteredPosts.success){
            throw new ApplicationError(filteredPosts.code,filteredPosts.message);
        }
        return res.status(filteredPosts.code).json({success:filteredPosts.success,message:filteredPosts.message,data:filteredPosts.data});
    }
    getDrafts(req,res){
        let userId = req.tokenPayload.userId;
        let response = PostsModel.getDrafts(userId);
        return res.status(response.code).json({success:response.success,message:response.message,data:response.data});
    }
    toggleArchive(req,res){
        let userId = req.tokenPayload.userId;
        let postId = req.params.postId;
        let response = PostsModel.toggleArchive(userId,postId);
        if(response.success){
            return res.status(response.code).json({success:response.success,message:response.message})
        } else {
            return res.status(response.code).json({success:response.success,message:response.message})
        }
    }
    // searchPosts(req,res){
    //     let {query,page,limit} = req.query;
    //     let response = PostsModel.searchFor(query,page,limit);
    // }
    postDraft(req,res){
        let draftId = req.params.id;
        let userId = req.tokenPayload.userId;
        let response = PostsModel.postDraft(userId,draftId);
        if(response.success){
            return res.status(response.code).json({success:true,message:response.message});
        } else {
            throw new ApplicationError(response.code,response.message);
        }
    }
    getArchivedPosts(req,res){
        let userId = req.tokenPayload.userId;
        let response = PostsModel.getArchivedPosts(userId);
        if(response.success){
            return res.status(response.code).json({success:true,message:response.message,data:response.data});
        } else {
            throw new ApplicationError(response.code,response.message);
        }
    }
}