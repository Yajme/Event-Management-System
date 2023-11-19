import crypto from"node:crypto";

const sha256 = (unhash) =>{

    const has = crypto.createHash('sha256');
    has.update(unhash);
    return has.digest('hex');
    
}

export default sha256;
