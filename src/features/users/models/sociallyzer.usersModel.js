//core modules
import crypto from 'crypto';

//third-party modules
import bcrypt from 'bcrypt';

//custom modules

export let users = [{
    name:"Default User",
    email:"default@user.com",
    password:"123", 
    id:"defaultUser",
    likedPosts:[]
}];
export class User {
    constructor(name,email,password){
        this.name = name;
        this.email = email;
        this.password = bcrypt.hashSync(password,5); // async version of this method with a higher salt round number can be used in Production Environment
        this.id = 'USER-'+crypto.randomBytes(16).toString('hex');
        this.likedPosts=[]
    }
     
    //static methods
    static addUser(name,email,password){
        if(!(name && email && password)){
            return {success:false,userId:null,message:'Missing Required Fields',code:400};
        }
        let user = users.find(u=>u.email===email);
        if(user){
            return {success:false,message:'User Already Exists',code:400,userId:null};
        }
        let newUser = new User(name,email,password);
        users.push(newUser);
        return {success:true,userId:newUser.id,message:"User registered successfully",code:201};
    }
    static confirmLogin(email,password){
        let user = users.find(u=>u.email===email);
        if(user){
            return bcrypt.compareSync(password,user.password) ? {success:true,code:200,message:"Login Successfull",user}:{success:false,message:'Invalid Credentials',code:401,user:null};
        } else {
            return {success:false,message:`Invalid Credentials`,code:401,user:null};
        }
    }
    static logout(userId){
        let userIndex = users.findIndex(u=>u.id===userId);
        if(userIndex < 0){
            return {code:404,success:false,message:"User Not Found"};
        }

        return {code:200,success:true,message:"Logout Successful / User not logged in"}    // no error handling is done here specifically. In case any error occurs, it will be caught in the error handler middleware
    }
}