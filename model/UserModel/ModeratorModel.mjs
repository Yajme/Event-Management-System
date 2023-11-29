import database from '../../db/connection.mjs';
import EventModel from '../EventModel.mjs';
const Menu = [
    
    {route : "/moderator/dashboard", icon:"mdi mdi-home menu-icon",title:"Home"},
    {route : "/moderator/eventlist", icon:"mdi mdi-format-list-checkbox menu-icon",title:"Event List View"},
    {route : "/moderator/eventregistration", icon:"mdi mdi-table-large menu-icon",title:"Event Registration"},
    {route : "/moderator/attendlist", icon:"mdi mdi-account-check menu-icon",title:"Student Attendees"},

]

const superuser = async (username)=> {
   try{
    return new Promise((resolve,reject)=>{
        const query = `SELECT * FROM superusers WHERE userName = ? AND superID != 0`;
        database.query(query,[username],(error,result)=>{
            if(error){
                reject (error);
                return;
            }
            if(result.length===0){
                reject("Invalid username");
                return;
            }
            resolve(result);
        });
    });
   }catch(error){
    throw error;
   }
}

const addevent = async (fields)=>{
    try{
        return new Promise((resolve,reject)=>{
            const query = 'CALL EventManager(?,?,?,?)'; 
            database.query(query,fields,(error,data)=>{
                if(error){
                    reject(error);
                    return;
                }
                if(data.length===0){
                    reject(error);
                    return;
                }
                resolve(data);
            });
        });
    }catch(error){
        throw error;
    }
}
export default {
    Menu,
    EventModel,
    superuser,
    addevent
};