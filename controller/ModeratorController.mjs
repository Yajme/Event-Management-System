import authentication from '../utils/authentication.mjs';
import ModeratorModel from '../model/UserModel/ModeratorModel.mjs';
import database from '../db/connection.mjs';
import session from "express-session";

/* 
<---------------------------------------->
/ GET Request START                    /
*/

const loginPage = async (req,res)=>{
    let minute = 600 * 10000;
    let arrNotif = [];
    res.setHeader('set-cookie', 'utype=; max-age=0');
    res.cookie("utype", "moderator", { maxAge: minute }, { httpOnly: true });
    console.log(req.cookies['std_id']);
    let val_dept_ID = req.cookies['u_dept_id'];

    let query = "SELECT * FROM `notifications`";

    database.query(query, [val_dept_ID],function (err, rows) {
        if (err) {
          req.flash('error', err)
          res.render('404', { data: '' })
        } else {

            for(var passCount = 0; passCount < rows.length; passCount++){
                arrNotif.push(rows[passCount].eventName);
                arrNotif.push(rows[passCount].e_date);
            }
          
    res.cookie("arrNotif", arrNotif, { maxAge: minute }, { httpOnly: true });
    res.render('./admin-moderator/index',{
        usertype: "Moderator", //DON'T REMOVE
        base: "moderator",
        login:"/moderator/login",
        HasError: false
    });
}
});
   
};

const homePage = async (req,res)=>{
    res.render('./admin-moderator/dashboard',{
        usertype: "Moderator", //DON'T REMOVE
        path : "moderator",
        Menu : ModeratorModel.Menu,
        HasError : false,
        Message : ''
    });
};
const eventregistration = async (req,res)=>{
    res.render('./admin-moderator/eventregistration',{
        usertype: "Moderator", //DON'T REMOVE
        path : "moderator",
        Menu : ModeratorModel.Menu,
        HasError : false,
        Message : ''
    });
};
const eventlist = async (req,res)=>{
    try{
        const deptid = req.cookies['m_dept_id'];
        const orgid = req.cookies['m_org_id'];
        console.log(orgid);
        if(!deptid) throw new Error('Logout or refresh the page');
        const rows = await ModeratorModel.EventModel.Events('eventlistmoderator','*',deptid,orgid);
        res.render('./admin-moderator/eventlist',{
            path: "moderator",
            data: rows,
            usertype : "Moderator",
            Menu : ModeratorModel.Menu,
            HasError: false
        });
    }catch(Error){
        res.render('./admin-moderator/eventlist',{
            path: "moderator",
            data: {},
            usertype : "Moderator",
            Menu : ModeratorModel.Menu,
            HasError : true,
            ErrorMessage : Error
        });
    }
};
const eventmanagement = async (req,res)=>{
    res.render('./admin-moderator/eventmanagement',{
        usertype: "Moderator", //DON'T REMOVE
        path: "moderator",
        Menu : ModeratorModel.Menu
    });
    
};
const attendlist = async (req,res)=>{
    try{
        const deptid = req.cookies['m_dept_id'];
        const eventlist = await ModeratorModel.EventModel.ApprovedEvents('ModeratorEventList','*',deptid);
        res.render('./admin-moderator/attendlist',{
        usertype: "Moderator", //DON'T REMOVE
        path: "moderator",
        Menu : ModeratorModel.Menu,
        HasError : false,
        HasTable : false,
        Events : eventlist,
        action: "/moderator/attendlist"
    });
    }catch(error){
        res.render('./admin-moderator/attendlist',{
            usertype: "Moderator", //DON'T REMOVE
            path: "moderator",
            Menu : ModeratorModel.Menu,
            HasError : true,
            HasTable : false,
            Events : {},
            ErrorMessage: error,
            action: "/moderator/attendlist"
        });
    }
    
};


const logout = async (req,res)=>{
    res.cookie("m_std_id", "username", { maxAge: -1 }, { httpOnly: true });
    res.cookie("m_std_name", "username", { maxAge: -1 }, { httpOnly: true });
    res.redirect('/moderator')
};
const AttendListLoad = async (req,res) =>{
    try{
        const eventName = req.params.eventname;
        console.log(eventName);
        const attendList = await ModeratorModel.EventModel.EventAttendees('LoadAttendees',eventName);
        res.render('./admin-moderator/attendlist',{
            path: "moderator",
            usertype: "Moderator",
            Menu: ModeratorModel.Menu,
            HasTable: true,
            HasError: false,
            Attendees : attendList,
            action : "/moderator/attendlist"
        });
    }catch(error){

    }
    
}
/* 
/ GET Request END                        /
<---------------------------------------->
/ POST Request START                    /
*/

const login = async (request,response)=>{
    const minute = 600 * 10000;
    try{
        var user_email_address = request.body.user_email_address;
        var user_password = request.body.user_password;
        if(!user_email_address) throw new Error("username must not be empty!");
        if(!user_password) throw new Error("password must not be empty!");

        const data = await ModeratorModel.superuser(user_email_address);
        const authenticate = authentication(data[0].password,data[0].salt,user_password);
        if(!authenticate) throw new Error("Invalid password");
        response.setHeader('set-cookie', 'utype=; max-age=0');
        response.cookie("m_std_name", user_email_address, { maxAge: minute }, { httpOnly: true });
        response.cookie("m_std_id", data[0].superID, { maxAge: minute }, { httpOnly: true });
        response.cookie("m_dept_id", data[0].dept_ID, { maxAge: minute }, { httpOnly: true });
        response.cookie("m_org_id", data[0].org_ID, { maxAge: minute }, { httpOnly: true });
        response.cookie("utype", "moderator", { maxAge: minute }, { httpOnly: true });
        request.session.superID = data[0].superID;
        response.redirect("dashboard");
    }catch(error){
        response.setHeader('set-cookie', 'utype=; max-age=0');
        response.cookie("utype", "moderator", { maxAge: minute }, { httpOnly: true });
        response.render('./admin-moderator/index',{
            usertype: "Moderator", 
            base: "moderator",
            login:"/moderator/login",
            HasError: true,
            ErrorMessage : error
        });
    }
    
};



const addevent = async (req,res)=>{
    try{
        // User inputs
        const eName = req.body.eventName;
        const eDesc = req.body.eventDesc;
        const eDate = new Date(req.body.eventDate);
        const modID = req.cookies['m_org_id'];
        if(!eName) throw new Error("Event Name is required!");
        if(!eDesc) throw new Error("Description must not be empty!");
        if(!eDate) throw new Error("Date must not be empty!");
        if(!modID) throw new Error("Moderator ID is undefined");
        const values = [eName, eDesc,eDate, modID];
        const data = await ModeratorModel.addevent(values);

        res.render('./admin-moderator/eventregistration',{
            usertype: "Moderator",
            path: "moderator",
            Menu: ModeratorModel.Menu,
            HasError : false,
            Message : "Event Registered!"
        });

    }catch(error){
        res.render('./admin-moderator/eventregistration',{
            usertype: "Moderator",
            path: "moderator",
            Menu: ModeratorModel,
            HasError : true,
            ErrorMessage : error.message,
        });
    }
}

const changepassword = async (req,res)=>{
    
    try{
        console.log(req.url);
        const newpass = req.body.confirmpass;
        const username = req.cookies['m_std_name'];
        if(!username) throw new Error('Logout or refresh your browser');
        const oldpassword = req.body.oldpass;
        // Query the MySQL database for the student user record
       const data = await ModeratorModel.superuser(username);
       const password = data[0].password;
        const authenticate = authentication(password,data[0].salt,oldpassword);
        if(!authenticate) throw new Error("Wrong old password");
        const updatepassword = await ModeratorModel.updatepassword(newpass,data[0].superID);
        res.render('./admin-moderator/dashboard',{
            path: "admin",
            usertype : "Administrator",
            Menu : ModeratorModel.Menu,
            HasError : false,
            Message : "Password Changed Successfully"
        });
    }catch(error){
        res.render('./admin-moderator/dashboard',{
            path: "admin",
            usertype : "Administrator",
            Menu : ModeratorModel.Menu,
            Message :'',
            HasError : true,
            ErrorMessage : error
        });
    }
}
const AttendListSearch = async (req,res,next) =>{
    try{
        const eventName = req.body.EventName;
        const Attendees = await ModeratorModel.EventModel.EventAttendees('SearchEvent',eventName);
        if(Attendees[0].AttendeeCount == 0) throw new Error('Attendee Count is 0');
        res.redirect(`attendlist/${eventName}`);
    }catch(error){
        const deptid = req.cookies['m_dept_id'];
        const eventlist = await ModeratorModel.EventModel.ApprovedEvents('ModeratorEventList','*',deptid);
        res.render('./admin-moderator/attendlist',{
        usertype: "Moderator", //DON'T REMOVE
        path: "moderator",
        Menu : ModeratorModel.Menu,
        HasError : true,
        ErrorMessage : error,
        HasTable : false,
        Events : eventlist,
        action: "/moderator/attendlist"
    });
    }
    
    }
/* 
/ POST Request END                      /
<---------------------------------------->
*/

export default {
    loginPage,
    homePage,
    eventregistration,
    eventlist,
    eventmanagement,
    attendlist,
    logout,
    login,
    addevent,
    changepassword,
    AttendListSearch,
    AttendListLoad


};