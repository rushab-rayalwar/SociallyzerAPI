//core modules

//third-party-modules
import winston from 'winston';

//cusomy modules

let logger = winston.createLogger({
    level: 'info',
    format : winston.format.combine(
        winston.format.timestamp({
            format:"HH:mm:ss DD-MM-YYYY"
        }),
        winston.format.printf(({level,message,timestamp,reqURL,reqBody,errCode})=>{  // NOTE: the object being passed to the printf function is called the info object
            if(!errCode){
                return `[SOCIALLYZER] [${level.toUpperCase()}] [${timestamp}] message:${message} reqURL: ${reqURL} reqBody:${JSON.stringify(reqBody)}`;
            } else {
                return `[SOCIALLYZER] [${level.toUpperCase()}] [${timestamp}] message:${message} errorCode: ${errCode} reqURL: ${reqURL} reqBody:${JSON.stringify(reqBody)}`;
            }
        })
    ),
    transports: [
        new winston.transports.File({filename:'./logs/logs.txt',level:'info'}),
        new winston.transports.File({filename:'./logs/errorsLog.txt',level:'error'})
    ]
});

export function reqLogger(req,res,next){
    let reqBody = req.body;
    let reqURL = req.originalUrl;
    logger.info('Request Logged',{reqURL,reqBody});
    next();
}

export function errorLogger(req,errCode,errMessage){
    let reqURL = req.originalUrl, reqBody = req.body;
    logger.error(`${errMessage}`,{reqURL,reqBody,errCode});
}