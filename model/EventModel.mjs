import database from "../db/connection.mjs";
//@Params:(Purpose,eventname,deptid,orgid,status)
var Events = async (...args)=>{
    try{
        return new Promise((resolve, reject) => {
            const [request,eventName,deptID,orgID,status] = args; 
            let query = "SELECT * FROM event_info";
            let params = [];
            if(request==='eventlistmoderator') 
            {
                query += " WHERE org_ID = ?";
                params.push(orgID);
            }
    
            database.query(query, params, (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (data.length === 0) {
                    reject("No Event Found");
                    return;
                }
                resolve(data);
            });
        });
    }catch(error){
        throw error;
    }
    
}
//@params: [Request,EventName,DeptID,OrgID]
const ApprovedEvents = async(...args)=>{
    try{
        return new Promise((resolve, reject) => {
            const [Request,EventName,DeptID,OrgID] = args;
            let params = [];
            let query = "SELECT eventName, eventDesc,org_Name,DATE_FORMAT(e_date, '%M %d, %Y at %h:%i %p') as date FROM event_info WHERE status = 'Approved' ";
            if(Request==='ModeratorEventList'){
                query += ' AND dept_ID = ?';
                params.push(DeptID);
            }
            console.log(`Query: ${query}, Parameters: [Approved], ${params}`);
            database.query(query, params, (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (data.length === 0) {
                    reject(`No Data Found`);
                    return;
                }
                resolve(data);
            });
        });
    }catch(err){
        throw err;
    }
}
//@params: [Request,EventName,DeptID,OrgID]
const EventAttendees = async(...args)=>{
    try{
        return new Promise((resolve, reject) => {
            const [Request,EventName,DeptID,OrgID] = args;
            let params = [];
            let query = '';
            if(Request==='SearchEvent'){
                query = 'SELECT AttendeeCount FROM `attendeescountview` WHERE EventName = ?';
                params.push(EventName);
            }
            if(Request ==='LoadAttendees'){
                query = 'SELECT * FROM `attendeesview` WHERE EventName = ?';
                params.push(EventName);
            }
            console.log(`Query: ${query}, Parameters:  ${params}`);
            database.query(query, params, (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (data.length === 0) {
                    reject(`No Data Found`);
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
    ApprovedEvents,
    EventAttendees
};