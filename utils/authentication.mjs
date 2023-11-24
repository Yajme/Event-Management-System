import sha256 from "./sha256.mjs";
//@params basePW is password retrieved in database
//@params salt is random string stored in database
//@params inputPW is password input by user
const Authentication =(basePW,salt,inputPW)=>{
    const pwHashed = sha256(inputPW+salt);
    if(basePW!=pwHashed) return false;
    return true;
}


export default Authentication;