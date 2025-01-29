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

        let alreadyLoggedIn = false;
        if(req.cookies.jwt){  // the client would send a JWT (token) if someone had already logged in
            let tokenPayload = jwt.verify(req.cookies.jwt,process.env.JWT_SECRET);
            alreadyLoggedIn = (tokenPayload.email === email);
        }
        if(alreadyLoggedIn){
            return res.status(200).json({success:true,message:"User already logged in. Please log out before logging into a different account.",userId:null,token:null});
        }

        let confirmLogin = User.confirmLogin(email,password);
        if(confirmLogin.success){
            let tokenSecret = process.env.JWT_SECRET;
            let token = jwt.sign({
                name:confirmLogin.user.name,
                email:confirmLogin.user.email,
                userId:confirmLogin.user.id},
                tokenSecret,
                { expiresIn: "2h"}
                );
            return res.status(200).cookie('authentication',token,{maxAge: 1000*60*120}).json({success:true,message:'Login Successful',userID:confirmLogin.user.id,token});
            // tokens will be valid for 2 hours
        } else {
            throw new ApplicationError(401,confirmLogin.message); 
        }
    }
    static logout(req,res){
        let token = req.cookies.jwt;
        if(!token){
            return res.status(400).json({message:"Token is missing.",success:false});
        }
        let payload = jwt.verify(token,process.env.JWT_SECRET);
        let response = User.logout(payload.userId);
        if(response.success){
            return res.status(response.code).clearCookie('jwt').json({message:response.message,success:response.success}) // clears the jwt token
        } else {
            return res.status(response.code).json({message:response.message,success:response.success})
        }
    }
    //instance methods
    
}