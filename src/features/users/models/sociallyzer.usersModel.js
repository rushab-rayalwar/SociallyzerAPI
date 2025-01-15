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
        if(password){
            this.password = bcrypt.hashSync(password,5); // async version of this method with a higher salt round number can be used in Production Environment
        }
        this.id = crypto.randomBytes(16).toString('hex');
        this.likedPosts=[]
    }
     
    //static methods
    static addUser(name,email,password){
        if(name && email && password){
            let user = new User(name,email,password);
            users.push(user);
            return {success:true,user};
        } else {
            throw new ApplicationError
        }
    }
    static confirmLogin(email,password){
        let user = users.find(u=>u.email===email);
        if(user){
            return bcrypt.compareSync(password,user.password) ? {success:true,user}:{success:false,message:'Invalid Credentials'};
        } else {
            return {success:false,message:`Invalid Credentials`};
        }
    }
    //instance methods
    
}