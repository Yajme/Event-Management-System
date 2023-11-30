import StudentModel from '../model/UserModel/StudentModel.mjs';
import session, { Session } from "express-session";
import Authentication from '../utils/authentication.mjs';
import db from '../db/connection.mjs';
import sha256 from '../utils/sha256.mjs';

const home = async (req,res)=>{
    console.log(req.cookies['std_id']);
    let val_dept_ID = req.cookies['u_dept_id'];
console.log(req.sessionID);
    let query = "SELECT * FROM `atendees_view` right join event_info on atendees_view.eventID=event_info.eventID where event_info.dept_ID = ? and  event_info.statusID = 2 group by event_info.eventID ;";

    db.query(query, [val_dept_ID],function (err, rows) {
        if (err) {
          req.flash('error', err)
          res.render('404', { data: '' })
        } else {
          
        
    res.render('./students/dashboard',{
        path: "student",
        data: rows,
        Menu : StudentModel.Menu
    });
}
});
};

const loginPage = async (req,res)=>{
    let minute = 600 * 10000;
    let arrNotif = [];
    res.setHeader('set-cookie', 'utype=; max-age=0');
    res.cookie("utype", "student", { maxAge: minute }, { httpOnly: true });
    let val_dept_ID = req.cookies['u_dept_id'];

    let query = "SELECT * FROM `notifications`";

    db.query(query, [val_dept_ID],function (err, rows) {
        if (err) {
          req.flash('error', err)
          res.render('404', { data: '' })
        } else {

            for(var passCount = 0; passCount < rows.length; passCount++){
                arrNotif.push(rows[passCount].eventName);
                arrNotif.push(rows[passCount].e_date);
            }
          
    res.cookie("arrNotif", arrNotif, { maxAge: minute }, { httpOnly: true });
    res.render('./students/index',{
        path: "student",
        data: rows,
        Menu : StudentModel.Menu
    });
}
});
};

const logout = async (req,res)=>{
    res.cookie("std_id", "username", { maxAge: -1 }, { httpOnly: true });
    res.cookie("std_name", "username", { maxAge: -1 }, { httpOnly: true });
    res.redirect('/student')
};

const eventcalendar = async (req,res)=>{
    console.log(req.cookies['std_id']);
    let val_dept_ID = req.cookies['u_dept_id'];

    let query = "SELECT * FROM `atendees_view` right join event_info on atendees_view.eventID=event_info.eventID where event_info.dept_ID = ? and  event_info.statusID = 2 group by event_info.eventID ;";

    db.query(query, [val_dept_ID],function (err, rows) {
        if (err) {
          req.flash('error', err)
          res.render('404', { data: '' })
        } else {
          
        
    res.render('./students/eventcalendar',{
        path: "student",
        data: rows,
        Menu : StudentModel.Menu
    });
}
});
};

const eventlist = async (req,res)=>{
    let val_dept_ID = req.cookies['u_dept_id'];
    
    let query = "SELECT * FROM `stud_atendees_view` right join event_info on stud_atendees_view.eventID=event_info.eventID where event_info.dept_ID = ? and event_info.status = 'approved' group by event_info.eventID;";
    db.query(query, [val_dept_ID], function (err, rows) {
        if (err) {
          req.flash('error', err)
          res.render('404', { data: '' })
        } else {
          
        console.log(rows);
    res.render('./students/eventlist',{
        path: "student",
        message: req.flash('message'),
        stud_id: req.cookies['std_id'],
        data: rows,
        Menu : StudentModel.Menu
    });
}
});
};


/* 
/ GET Request END                        /
<---------------------------------------->
/ POST Request START                    /
*/

const register = async (req,res)=>{
    const eventid = req.body.e_id;
    const userid = req.cookies['std_id'];
    let val_dept_ID = req.cookies['u_dept_id'];
    
    const query = "INSERT INTO `eventattendees` ( `eventID`, `sr_code`, `DateRegistered`) VALUES ( ? , ? ,current_timestamp()) ";
    db.query(query,[eventid, userid],function (err, resp) {
        if (err) {
            if (err) throw err;
            }});
            let setquery = "SELECT * FROM `stud_atendees_view` right join event_info on stud_atendees_view.eventID=event_info.eventID where event_info.dept_ID = ? and event_info.status = 'approved' group by event_info.eventID;" ;
            db.query(setquery, [val_dept_ID], function (err, rows) {
                if (err) {
                  req.flash('error', err)
                  res.render('404', { data: '' })
                } else {
                  
            req.flash('message', 'You Registered to the Event!');       
            res.render('./students/eventlist',{
                path: "student",
                message: req.flash('message'),
        stud_id: req.cookies['std_id'],
        data: rows,
                Menu : StudentModel.Menu
            });
            
        }
        });
};

const changepassword = async (req,res)=>{
    const newpass = req.body.confirmpass;
    const userid = req.cookies['std_id'];
    let val_dept_ID = req.cookies['u_dept_id'];
    const oldpassword = req.body.oldpass;

    // Query the MySQL database for the student user record
    const query = 'SELECT * FROM studentinfoview WHERE sr_code = ?';
    db.query(query,[userid, oldpassword], function(error,result){
        if (error) {
            if (error) throw err;
            }
            else{
                for(var passCount = 0; passCount < result.length; passCount++){
                    const salt = result[passCount].salt;
                    const passwordHash = oldpassword+salt;
                    const newpasswordHash = newpass+salt;
                    const dbPassword = result[passCount].password;
                    const has = crypto.createHash('sha256');
                    const hasnew = crypto.createHash('sha256');
                    // Update the hash with the data
                    has.update(passwordHash);
                    hasnew.update(newpasswordHash);
                    // Calculate the hexadecimal hash
                    const hashedSaltAndPass = has.digest('hex')
                    const newhashedSaltAndPass = hasnew.digest('hex')
                    if (dbPassword != hashedSaltAndPass) {
                        return CatchThatError('Wrong Password',401,next);
                    }
                    
                    const query = "UPDATE `userstudents` SET `PASSWORD` = ? WHERE `userstudents`.`sr_code` = ?";
                    db.query(query,[newhashedSaltAndPass, userid],function (err, resp) {
                        if (err) {
                            if (err) throw err;
                            }
                            else{
                    req.flash('messagepass', 'You Changes your password!');  
                    res.render("./students/dashboard",{
                        sUsername: result[0].firstName + " " + result[0].lastName,
                        messagepass: req.flash('messagepass'),
                        Menu : Menu
                    });
                    
                }
            });
                }
            }
    
    
    
    });

            
};

const login = async (request,response)=>{
    try{
//names of the input text fields in the views/index.ejs
    
    let minute = 600 * 10000;
    const username = request.body.username;
    const password = request.body.password;
    console.log(username);
    console.log(password);
// Query the MySQL database for the student user record
    const query = 'SELECT * FROM studentinfoview WHERE sr_code = ?';
db.query(query,[username], function(error,result){
     // If the user is found, return the user's record
     
    if (result.length === 0) { 
        throw new Error('Invalid Password or Username');// HTTP Unauthorized
    }

     //checking of password and salt
     for(var passCount = 0; passCount < result.length; passCount++){
        const salt = result[passCount].salt;
        const passwordHash = password+salt;
        const dbPassword = result[passCount].password;
        const hashedSaltAndPass = sha256(passwordHash);
        if (dbPassword != hashedSaltAndPass) {
            return Error('Wrong Password',401,next);
        }
        response.setHeader('set-cookie', 'utype=; max-age=0');
        response.cookie("std_name", result[passCount].firstName + " " + result[passCount].lastName, { maxAge: minute }, { httpOnly: true });
        response.cookie('sr_code',username,{ maxAge: minute }, { httpOnly: true });
        response.cookie("std_id", username, { maxAge: minute }, { httpOnly: true });
        response.cookie("u_dept_id", result[passCount].dept_ID, { maxAge: minute }, { httpOnly: true });
        response.cookie("utype", "student", { maxAge: minute }, { httpOnly: true });
        response.render("./students/dashboard",{
            sUsername: result[passCount].firstName + " " + result[passCount].lastName,
            Menu : StudentModel.Menu,
            path: "student"
        });
    }
       
    response.end();
    }); 
    }catch(error){
        res.render('./students/index',{
            path: "student",
            HasError : true,
            ErrorMessage: error
        });
    }
    
};

/**
 * home
 * loginpage
 * logout
 * eventcalendar
 * eventlist
 * changepass
 * <--->
 * POST
 * register
 * changepassword
 * login
 */
export default {
    home,
    loginPage,
    logout,
    eventcalendar,
    eventlist,
    register,
    changepassword,
    login
};