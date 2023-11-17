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
   
    res.render('./students/dashboard',{
        path: "student",
        Menu : Menu
    });
});

router.get("/eventcalendar", (req,res)=>{
   
    res.render('./students/eventcalendar',{
        path: "student",
        Menu : Menu
    });
})

router.get("/eventlist", (req,res)=>{
    
    res.render('./students/eventlist',{
        path: "student",
        Menu : Menu
    });
})


router.get("/" ,(req,res)=>{
    res.render('./students/index');
});

router.post('/login', function(request,response,next){
   
    //names of the input text fields in the views/index.ejs
    const username = request.body.username;
    const password = request.body.password;
    // Query the MySQL database for the student user record
    const query = 'SELECT * FROM userstudents WHERE sr_code = ?';
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
            response.redirect("/student/dashboard");
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