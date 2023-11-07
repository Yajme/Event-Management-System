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
                Dropdown : "Home",
                Icon : "icon icon-single-04",
                Subitem : [
                    { Name : "Dashboard", Route : "/student/dashboard"}
                ]
            },
            {
                Title : "Events Manager",
                Class : "nav-label",
                Dropdown : "Events",
                Icon : "icon icon-form",
                Subitem : [
                    { Name : "List View", Route : "eventslist"},
                    { Name : "Calendar View", Route : "calendar"}
                ]
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

router.get("/calendar", (req,res)=>{
   
    res.render('./students/app-calender',{
        path: "student",
        Menu : Menu
    });
})

router.get("/eventslist", (req,res)=>{
    
    res.render('./students/table-datatable-basic',{
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
    const query = 'SELECT userID,password,salt FROM userstudents WHERE sr_code = ?';
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
            response.redirect('dashboard');
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