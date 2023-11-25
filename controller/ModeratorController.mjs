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
        Menu : ModeratorModel.Menu
    });
};
const eventregistration = async (req,res)=>{
    res.render('./admin-moderator/eventregistration',{
        usertype: "Moderator", //DON'T REMOVE
        path : "moderator",
        Menu : ModeratorModel.Menu,
        HasError : false
    });
};
const eventlist = async (req,res)=>{
    try{
        const rows = await ModeratorModel.EventModel.Events();
        res.render('./admin-moderator/eventlist',{
            path: "moderator",
            data: rows,
            usertype : "Moderator",
            Menu : ModeratorModel.Menu
        });
    }catch(Error){
        req.flash('error', err)
        res.render('profile', { data: '' })
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
    const eventlist = await ModeratorModel.EventModel.ApprovedEvents();
    res.render('./admin-moderator/attendlist',{
        usertype: "Moderator", //DON'T REMOVE
        path: "moderator",
        Menu : ModeratorModel.Menu,
        HasError : false,
        HasTable : false,
        Events : eventlist,
        action: "/moderator/attendlist"
    });
};


const logout = async (req,res)=>{
    res.cookie("m_std_id", "username", { maxAge: -1 }, { httpOnly: true });
    res.cookie("m_std_name", "username", { maxAge: -1 }, { httpOnly: true });
    res.redirect('/moderator')
};

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
        const modID = req.cookies['m_std_id'];
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
            HasError : false
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
    addevent


};