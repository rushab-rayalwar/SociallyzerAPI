//core modules

//third-party modules
import jwt from 'jsonwebtoken';

//custom modules
import { ApplicationError } from '../../../middlewares/sociallyzer.middleware.errorHandler.js';
import { User } from '../models/sociallyzer.usersModel.js';

export default class UserController {
    constructor(){}
    //static methods
    static handleRegistration(req,res){
        let {name,email,password} = req.body;
        if(name,email,password){
        let response = User.addUser(name,email,password);
            if(response.success){
                return res.status(201).json({
                    success: true,
                    message: 'User Registration Successfull.',
                    userId: response.user.userId,
                });
            } else {
                throw new ApplicationError(400,"Invalid User Data");
            }
        }
    }
    static handleLogin(req,res){
        let {email,password} = req.body;
        let confirmLogin = User.confirmLogin(email,password);
        if(confirmLogin.success){
            let tokenSecret = '3f4b9c7a5d8e1f4a7c2e8d9f1b6c3a4e';
            let token = jwt.sign({name:confirmLogin.user.name,email:confirmLogin.user.email,userId:confirmLogin.user.id},tokenSecret,{ expiresIn: "1h"});
            return res.status(200).cookie('authentication',token,{maxAge: 1000*60*60}).json({success:true,message:'Login Successful',userID:confirmLogin.user.id,token});
        } else {
            throw new ApplicationError(401,confirmLogin.message); 
        }
    }

    //instance methods
    
}