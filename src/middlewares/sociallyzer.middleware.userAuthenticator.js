//core modules

//third-party modules
import jwt from 'jsonwebtoken';

//custom modules
import { ApplicationError } from './sociallyzer.middleware.errorHandler.js';

export default function userAuthenticator (req,res,next) {
    let token = req.cookies.jwt;
    if(token){
        try{
            let payload = jwt.verify(token, process.env.JWT_SECRET);
            req.tokenPayload = payload;
            next();
        } catch(err) {
            throw new ApplicationError(401,'Authentication-Token is invalid / expired');
        }
    } else {
        throw new ApplicationError(401,'Authentication-Token is missing');
    }
}