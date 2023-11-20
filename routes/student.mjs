import express from "express";
import session from 'express-session';
const router = express.Router();
import db from "../db/connection.mjs";
import crypto from "node:crypto";
const Menu = [
    {
        "Menu" : [
            {
                Title : "Main Menu",
                Class : "nav-label first",
                Icon : "icon icon-single-04",
                Route : "dashboard"
            },
            {
                Title : "Events list",
                Class : "nav-label",
                Dropdown : "Events",
                Icon : "icon icon-form",
                Route : "eventlist"
            },
            {
                Title : "Events Calendar",
                Class : "nav-label",
                Icon : "icon icon-form",
                Route : "eventcalendar"
            },
        ]
    }
]

router.get("/dashboard" ,(req,res)=>{
    console.log(req.cookies['std_id']);
    db.query('SELECT * FROM atendees_view where sr_code = '+ req.cookies['std_id'], function (err, rows) {
        if (err) {
          req.flash('error', err)
          res.render('profile', { data: '' })
        } else {
          
        
    res.render('./students/dashboard',{
        path: "student",
        data: rows,
        Menu : Menu
    });
}
});
});


router.get("/logout" ,(req,res)=>{
    res.cookie("std_id", "username", { maxAge: -1 }, { httpOnly: true });
    res.cookie("std_name", "username", { maxAge: -1 }, { httpOnly: true });
    res.render('./students')
});

router.get("/eventcalendar", (req,res)=>{
    console.log(req.cookies['std_id']);
    db.query('SELECT * FROM atendees_view where sr_code = '+ req.cookies['std_id'], function (err, rows) {
        if (err) {
          req.flash('error', err)
          res.render('profile', { data: '' })
        } else {
          
        
    res.render('./students/eventcalendar',{
        path: "student",
        data: rows,
        Menu : Menu
    });
}
});
})

router.get("/eventlist", (req,res)=>{
    console.log(req.cookies['std_id']);
    db.query("SELECT * FROM `atendees_view` right join event_info on atendees_view.eventID=event_info.eventID;", function (err, rows) {
        if (err) {
          req.flash('error', err)
          res.render('profile', { data: '' })
        } else {
          
        
    res.render('./students/eventlist',{
        path: "student",
        message: req.flash('message'),
        stud_id: req.cookies['std_id'],
        data: rows,
        Menu : Menu
    });
}
});
})


router.post("/register", (req,res)=>{
    const eventid = req.body.e_id;
    const userid = req.cookies['std_id'];
    
    const query = "INSERT INTO `eventattendees` ( `eventID`, `sr_code`, `DateRegistered`) VALUES ('"+[eventid]+"','"+[userid]+"',current_timestamp())";
    db.query(query,function (err, resp) {
        if (err) {
            if (err) throw err;
            }});
            db.query("SELECT * FROM atendees_view where sr_code = '"+ req.cookies['std_id'] + "'", function (err, rows) {
                if (err) {
                  req.flash('error', err)
                  res.render('profile', { data: '' })
                } else {
                  
            req.flash('message', 'You Registered to the Event!');       
            res.render('./students/eventlist',{
                path: "student",
                message: req.flash('message'),
        stud_id: req.cookies['std_id'],
        data: rows,
                Menu : Menu
            });
            
        }
        });
})


router.get("/" ,(req,res)=>{
    res.render('./students/index');
});

router.post('/login', function(request,response,next){
   
    //names of the input text fields in the views/index.ejs
    let minute = 600 * 10000;
    const username = request.body.username;
    const password = request.body.password;
    // Query the MySQL database for the student user record
    const query = 'SELECT * FROM studentinfoview WHERE sr_code = ?';
    db.query(query,[username], function(error,result){
         // If the user is found, return the user's record
         
        if (result.length === 0) { 
            return CatchThatError('Invalid Password or Username',401,next);// HTTP Unauthorized
        }

         //checking of password and salt
         for(var passCount = 0; passCount < result.length; passCount++){
            const salt = result[passCount].salt;
            const passwordHash = password+salt;
            const dbPassword = result[passCount].password;
            const has = crypto.createHash('sha256');
            // Update the hash with the data
            has.update(passwordHash);
            // Calculate the hexadecimal hash
            const hashedSaltAndPass = has.digest('hex')
            if (dbPassword != hashedSaltAndPass) {
                return CatchThatError('Wrong Password',401,next);
            }
            request.session.studID = username;
            response.cookie("std_name", result[passCount].firstName + " " + result[passCount].lastName, { maxAge: minute }, { httpOnly: true });
            response.cookie("std_id", username, { maxAge: minute }, { httpOnly: true });
            response.cookie("utype", "student", { maxAge: minute }, { httpOnly: true });
            response.render("./students/dashboard",{
                sUsername: result[passCount].firstName + " " + result[passCount].lastName,
                Menu : Menu
            });
        }
           
        response.end();
        }); 
  });

function CatchThatError(errorMessage, errorStatus,next){
    const customError = new Error(errorMessage);
    customError.status = errorStatus; 
    next(customError);
    
}
 router.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });// to be thrown client side
  });

export default router;