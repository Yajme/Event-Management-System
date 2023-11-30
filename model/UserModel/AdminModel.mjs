import OrgModel from '../OrganizationModel.mjs';
import EventModel from '../EventModel.mjs';
import DeptModel from '../DepartmentModel.mjs';
import database from '../../db/connection.mjs';
const Menu = [
    
    {route : "/admin/dashboard", icon:"mdi mdi-home menu-icon",title:"Home"},
    {route : "/admin/eventlist", icon:"mdi mdi-format-list-checkbox menu-icon",title:"Event List View"},
    {route : "/admin/eventmanagement", icon:"mdi mdi-table-large menu-icon",title:"Event Management"},
    {route : "/admin/attendlist", icon:"mdi mdi-account-check menu-icon",title:"Student Attendees"},
    {route : "/admin/moderatorlist", icon:"mdi mdi-account-badge menu-icon",title:"Moderator List"},
    {route : "/admin/addmoderator", icon:"mdi mdi-new-box menu-icon",title:"Add Moderator"}
]

const AttendeesList = async (eventName) => {
    try{
        return new Promise((resolve, reject) => {
        
            if (!eventName) {
                reject("EventName is required");
                return;
            }
    
            const query = "SELECT * FROM AttendeesView WHERE eventname = ?";
            
            console.log(`Query: ${query}, Parameters: [${eventName}]`);
    
            database.query(query, [eventName], (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
    
                if (data.length === 0) {
                    reject(`No attendees found for event: ${eventName}`);
                    return;
                }
                resolve(data);
            });
        });
    }catch(err){
        throw err;
    }
    
}


const AttendeesCount = async(eventName)=>{
    try{
        return new Promise((resolve, reject) => {
            if (!eventName) {
                reject("EventName is required");
                return;
            }
            const query = "SELECT AttendeeCount FROM AttendeesCountView WHERE eventname = ?";
            console.log(`Query: ${query}, Parameters: [${eventName}]`);
            database.query(query, [eventName], (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (data.length === 0) {
                    reject(`No Event found for event: ${eventName}`);
                    return;
                }
                resolve(data);
            });
        });
    }catch(err){
        throw err;
    }
    
};
const superusers = async(username)=>{
    try{
        return new Promise((resolve, reject) => {
            const query = 'SELECT superID, Password, salt FROM superusers WHERE username = ? AND superID = 0';
            console.log(`Query: ${query}, Parameters: [${username}]`);
            database.query(query, [username], (error, data) => {
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
};

const registerModerator = (name, password, username, department) => {
    return new Promise((resolve, reject) => {
      //@param(orgname, password, username, deptid)
      const query = "CALL RegisterModerator(?,?,?,?)";
  
      // Begin the transaction
      database.beginTransaction((err) => {
        if (err) {
          reject({ message: "Internal Server Error", status: 500 });
          return;
        }
  
        // Initiating query
        database.query(query, [name, password, username, department], (error, data) => {
          if (error) {
            // If database throws an error, rollback the transaction
            database.rollback(() => {
              reject({ message: error, status: 500 });
            });
          } else {
            // Commit the changes if there is no error
            database.commit((commitError) => {
              if (commitError) {
                // If committing the transaction throws an error, rollback
                database.rollback(() => {
                  reject({ message: commitError, status: 500 });
                });
              } else {
                // Resolve the promise if everything is successful
                resolve('Transaction successfully completed!');
              }
            });
          }
        });
      });
    });
  };

  const moderatorList = async()=>{
    try{
        return new Promise((resolve,reject)=>{
            const query = 'SELECT * FROM Moderators';
            
            database.query(query,(error,data)=>{
                if(error){
                    reject(error);
                    return;
                }
                if(data.length===0){
                    reject("No moderator found");
                    return;
                }
                resolve(data);
            })
        })
    }catch(error){
        throw error;
    }
  }
  const notifications = async()=>{
    try{
        return new Promise((resolve,reject)=>{
            const query = "SELECT * FROM `notifications`";
            var arrNotif = [];
            database.query(query,(error,data)=>{
                if(error){
                    reject(error);
                    return;
                }
                for(let i= 0; i < data.length;i++){
                    arrNotif.push(data[i].eventName);
                    arrNotif.push(data[i].e_date);
                }

                resolve(arrNotif);
            });
            
        })
    }catch(error){
        throw error;
    }
  }

  const UpdateStatus = async (statusID, eventID) => {
    try {
      return new Promise((resolve, reject) => {
        database.beginTransaction(async (beginTransactionErr) => {
          if (beginTransactionErr) {
            reject(beginTransactionErr);
            return;
          }
          try {
            const query = "UPDATE events SET statusID = ? WHERE eventID = ?";
            database.query(query, [statusID, eventID], (error, updateResult) => {
                database.commit((commitErr) => {
                  if (commitErr) {
                    reject(commitErr);
                    return;
                  } 
                    resolve(updateResult);
                });
            });
          } catch (error) {
            database.rollback(() => {
              reject(error);
            });
          }
        });
      });
    } catch (error) {
      throw error;
    }
  };
  
  

//<------------Template------------->
/*
    try{
    return new Promise((resolve,reject)=>{
            
        })
    }catch(error){
        throw error;
    }
*/
export default {
     Menu, 
     OrgModel, 
     EventModel, 
     DeptModel,
     AttendeesList,
     AttendeesCount,
     superusers,
     registerModerator,
     moderatorList,
     notifications,
     UpdateStatus
    };