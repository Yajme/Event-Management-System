import database from '../db/connection.mjs';


var Organizations= async ()=>{
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM Moderators";

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
}

export default Organizations;