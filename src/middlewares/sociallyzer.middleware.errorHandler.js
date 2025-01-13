//core modules

//third-party modules

//custom modules
import {errorLogger} from './sociallyzer.middleaware.logger.js';

export class ApplicationError extends Error {
    constructor(statusCode,message){
        super(message);
        this.statusCode = statusCode;
    }
}
export function errorHandler(err,req,res,next) {
    if(err instanceof ApplicationError) {
        errorLogger(req,err.statusCode,err.message);
        res.status(err.statusCode).json({success:false, message:err.message});
    } else {
        console.error('Error Message -',err.stack);  // this helps in debugging 
        errorLogger(req,500,err.message);
        res.status(500).json({success:false,message:`Oops! Something went wrong.`});
    }
}