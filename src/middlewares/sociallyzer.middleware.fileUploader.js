//core modules
import path from 'path';
import fs from 'fs';

//third-party modules
import multer from 'multer';

//custom modules
import { ApplicationError } from './sociallyzer.middleware.errorHandler.js';
import { generateUniquePostId } from '../features/posts/models/sociallyzer.postsModel.js';

let storageOptions = multer.diskStorage({
    destination:(req,file,cb)=>{ 
        let uploadPath = path.join(process.cwd(),'uploads',req.tokenPayload.userId);
        if(!fs.existsSync(uploadPath)){
            try{
                fs.mkdirSync(uploadPath); // NOTE this
            } catch(err){
                throw new Error("Could Not Save The Uploaded File");
            }
        };
        cb(null,path.join(process.cwd(),'uploads',req.tokenPayload.userId));
        //cb(null,"./uploads");
    },
    filename: (req,file,cb)=>{
        req.customData = {};
        req.customData.postId = generateUniquePostId();// NOTE postid is being generated here because, the image has to be saved by the name of the postId
        req.customData.imageFileExtension = (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg') ? '.jpg' : '.png'; // NOTE this
        let name = req.customData.postId+req.customData.imageFileExtension;
        cb(null,name);
    }
});
let filter = (req,file,cb)=>{ // NOTE this
    let fileExtentionIsOkay = ['image/jpeg','image/png','image/jpg'].includes(file.mimetype); // NOTE this
    if(fileExtentionIsOkay){
        cb(null,true);
    } else {
        cb(new ApplicationError(400,'Only .jpg and .png files are allowed!'),false);
    }
}
export default multer({storage:storageOptions,fileFilter:filter});

