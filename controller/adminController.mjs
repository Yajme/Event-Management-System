import AdminModel from "../model/UserModel/AdminModel.mjs";
import authentication from '../utils/authentication.mjs';
/* 
<---------------------------------------->
/ GET Request START                    /
*/

const loginPage = (req,res)=>{
    res.render('./admin-moderator/index',{
        usertype: "Administrator", 
        login: "/admin/login",
        HasError: false
    });
}

const logout = (req,res)=>{
    res.cookie("a_std_id", "username", { maxAge: -1 }, { httpOnly: true });
    res.cookie("a_std_name", "username", { maxAge: -1 }, { httpOnly: true });
    res.redirect('/admin');
}
const AttendList = async (req,res) =>{
    const events = await AdminModel.EventModel.ApprovedEvents();
    res.render('./admin-moderator/attendlist',{
        path: "admin",
        usertype: "Administrator",
        Menu: AdminModel.Menu,
        HasTable: false,
        HasError: false,
        Events: events,
        action : "/admin/attendlist"
    });
}
const AttendListLoad = async (req,res) =>{
    const eventName = req.params.eventname;
    const attendList = await AdminModel.AttendeesList(eventName);
    res.render('./admin-moderator/attendlist',{
        path: "admin",
        usertype: "Administrator",
        Menu: AdminModel.Menu,
        HasTable: true,
        HasError: false,
        Attendees : attendList,
        action : "/admin/attendlist"
    });
}
const home = (req,res) =>{
    res.render('./admin-moderator/dashboard',{
        path: "admin",
        usertype : "Administrator",
        Menu : AdminModel.Menu
    });
}

const eventList = async (req,res) =>{
    try{
        const rows = await AdminModel.EventModel.Events(); 
        res.render('./admin-moderator/eventlist',{
            path: "admin",
            data: rows,
            usertype : "Administrator",
            Menu: AdminModel.Menu
        });
        }catch(err){
            req.flash('error', err)
            res.render('profile', { data: '' })
        }
}

const eventManagement = (req,res) =>{
    res.render('./admin-moderator/eventmanagement',{
        path: "admin",
        usertype : "Administrator",
        Menu: AdminModel.Menu
    });

}

const moderatorList = (req,res) =>{
    res.render('./admin-moderator/moderatorlist',{
        path: "admin",  
        usertype : "Administrator",
        Menu: AdminModel.Menu
    });
}
const addModeratorPage = async (req,res) =>{
    try {
        const deptList = await AdminModel.DeptModel();    
        res.render('./admin-moderator/addmoderator', {
            path: "admin",
            usertype: "Administrator",
            departments: deptList,
            Menu: AdminModel.Menu,
            HasError : false
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

/* 
/ GET Request END                        /
<---------------------------------------->
/ POST Request START                    /
*/

const login = async (request,response,next)=>{
    try{
        const minute = 6000000;
        const user_email_address = request.body.user_email_address;
        const user_password = request.body.user_password;
        if(!user_email_address && !user_password) throw new Error("Please Enter Email Address and Password Details");
            const data = await AdminModel.superusers(user_email_address);
            const authenticate = authentication(data[0].Password,data[0].salt,user_password);
            if(!authenticate) throw new Error("Incorrect username or password");
            response.cookie("a_std_name", user_email_address, { maxAge: minute }, { httpOnly: true });
            response.cookie("a_std_id", data[0].superID, { maxAge: minute }, { httpOnly: true });
            response.cookie("utype", "admin", { maxAge: minute }, { httpOnly: true });
            response.redirect('dashboard');
    }catch(error){
        console.log(error);
        response.render('./admin-moderator/index',{
            usertype: "Administrator", 
            login: "/admin/login",
            HasError: true,
            ErrorMessage: error
        });
    }
    

}

const AttendListSearch = async (req,res,next) =>{
try{
    const eventName = req.body.EventName;
    const Attendees = await AdminModel.AttendeesCount(eventName);
    if(Attendees[0].AttendeeCount == 0) throw new Error('Attendee Count is 0');
    res.redirect(`attendlist/${eventName}`);
}catch(error){
    const events = await AdminModel.EventModel.ApprovedEvents();
    res.render('./admin-moderator/attendlist',{
        path: "admin",
        usertype: "Administrator",
        Menu: AdminModel.Menu,
        HasTable: false,
        HasError: true,
        ErrorMessage: error,
        Events: events,
        action : "/admin/attendlist"
    });
}
}
const addModerator = async (req,res) =>{
    try{
    // User inputs
    const username = req.body.username;
    const name = req.body.name;
    const password = req.body.password;
    const department = req.body.department;
  
    // Validation of user input
    if (!username) throw new Error("Username must not be empty!");
    if (!password) throw new Error("Password must not be empty!");
    if (!name) throw new Error("Organization Name must not be empty!");
  
    // Declaring object for organizations
    const organizations = await AdminModel.OrgModel();
  
    // Use the some method to check if any department has the same username across all organizations
    const usernameExists = organizations.some(organization => organization.username === username);
    if (usernameExists) throw new Error("Username already exists");
    AdminModel.registerModerator(name,password,username,department);
    }catch(error){
        res.render('./admin-moderator/addmoderator', {
            path: "admin",
            usertype: "Administrator",
            departments: deptList,
            Menu: AdminModel.Menu,
            HasError : true,
            ErrorMessage : error
        });
    }
}

const updateevent= async (req,res)=>{
    const evid = req.body.eventID;
    const update = req.body.approve;
       if(!update){
           const query = `DELETE FROM events
           WHERE eventID = ?`;
           database.query(query,evid,(err,data)=>{
               if(err){
                   console.log(err);
               }
               else{
                   console.log("successful query");
                   database.query("SELECT * FROM `events`", function (err, rows) {
                       if (err) {
                         CatchThatError(err,500,next);
                       } else {
                       //console.log(rows);
                   res.render('./admin-moderator/eventmanagement',{
                       path: "admin",
                       event: rows,
                       usertype : "Administrator",
                       Menu: AdminModel.Menu
                   });
                   }
                   });
               }
           })
       }else{
           const query = `UPDATE events
           SET statusID = 2
           WHERE eventID = ?`;
           database.query(query,evid,(err,data)=>{
               if(err){
                   console.log(err);
               }
               else{
                   console.log("successful query");
                   database.query("SELECT * FROM `events`", function (err, rows) {
                       if (err) {
                         CatchThatError(err,500,next);
                       } else {
                       //console.log(rows);
                   res.render('./admin-moderator/eventmanagement',{
                       path: "admin",
                       event: rows,
                       usertype : "Administrator",
                       Menu: AdminModel.Menu
                   });
                   }
                   });
               }
           })
       }
}
/* 
<---------------------------------------->
/ POST Request END                /
*/

export default {
    loginPage,
    login,
    logout,
    AttendList,
    home,
    eventList,
    eventManagement,
    moderatorList,
    addModeratorPage,
    addModerator,
    AttendListSearch,
    AttendListLoad,
    updateevent
};