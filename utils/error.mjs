function CatchThatError(errorMessage, errorStatus,next){
    const customError = new Error(errorMessage);
    customError.status = errorStatus; // HTTP Unauthorized
    next(customError);
    
}

export default CatchThatError;