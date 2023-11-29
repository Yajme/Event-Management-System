import database from "../db/connection.mjs";
var Events = async ()=>{
    try{
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM event_info";
    
            database.query(query, (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (data.length === 0) {
                    reject("Organization not found");
                    return;
                }
                resolve(data);
            });
        });
    }catch(error){
        throw error;
    }
    
}
const ApprovedEvents = async()=>{
    try{
        return new Promise((resolve, reject) => {
            const query = "SELECT eventName, eventDesc,org_Name,DATE_FORMAT(e_date, '%M %d, %Y at %h:%i %p') as date FROM event_info WHERE status = 'Approved' ";
            console.log(`Query: ${query}, Parameters: [Approved]`);
            database.query(query, (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (data.length === 0) {
                    reject(`Invalid username or password`);
                    return;
                }
                resolve(data);
            });
        });
    }catch(err){
        throw err;
    }
}
export default {
    Events,
    ApprovedEvents
};