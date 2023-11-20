import express from "express";
import crypto from "node:crypto";
const router = express.Router();
import database from "../db/connection.mjs";
import sha256 from "sha256";
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
                Title : "Events List",
                Class : "nav-label",
                Icon : "icon icon-form",
                Route : "eventlist",
            },
            {
                Title : "Events Calendar",
                Class : "nav-label",
                Icon : "icon icon-form",
                Route : "eventcalendar",
            },
            {
                Title : "Moderator List",
                Class : "nav-label",
                Icon : "icon icon-form",
                Route : "moderatorlist",
            },
            {
                Title : "Moderator Mangament",
                Class : "nav-label",
                Icon : "icon icon-form",
                Route : "addmoderator",
            }
        ]
    }
]



router.get("/",(req,res)=>{
    res.render('./admin-moderator/index',{
        
        usertype: "Administrator" //DON'T REMOVE
    });
    
});

router.post('/login', function(request, response, next){
    var user_email_address = request.body.user_email_address;
    var user_password = request.body.user_password;
    if(!user_email_address && !user_password)
    {
        CatchThatError("Please Enter Email Address and Password Details",400,next)
    }
    else
    {
       
        var query = `
        SELECT * FROM superusers 
        WHERE userName = ? AND superID = 0
        `;

        database.query(query, [user_email_address],function(error, data){

            if(data.length == 0)
            {
                return CatchThatError("Invalid Password or username",401,next);
            }
            else
            {
    let minute = 600 * 10000;
    //Concatenate user input password with database output salt
                    const passwordHash = user_password+data[0].salt;
                    //declare sha2 var
                    const sha2 = crypto.createHash('sha256');
                    // Update the hash with the data
                    sha2.update(passwordHash);
                    // Calculate the hexadecimal hash
                    const hashedSaltAndPass = sha2.digest('hex');
                    if(data[0].password != hashedSaltAndPass)
                    {
                        return CatchThatError("Wrong Password",401,next);
                    }
                    else
                    {
                        request.session.superID = data[0].superID;
                        response.cookie("a_std_name", user_email_address, { maxAge: minute }, { httpOnly: true });
                        response.cookie("a_std_id", data[0].superID, { maxAge: minute }, { httpOnly: true });
                        response.cookie("utype", "admin", { maxAge: minute }, { httpOnly: true });
                        response.redirect("/admin/dashboard");
                    }
            }
            response.end();
        });
    }

});


router.post('/login-m', function(request, response, next){
    var user_email_address = request.body.user_email_address;
    var user_password = request.body.user_password;
    if(!user_email_address && !user_password)
    {
        CatchThatError("Please Enter Email Address and Password Details",400,next)
    }
    else
    {
       
        var query = `
        SELECT superID,password,salt FROM superusers 
        WHERE userName = ? 
        `;

        database.query(query, [user_email_address],function(error, data){

            if(data.length == 0)
            {
                return CatchThatError("Invalid Password or username",401,next);
            }
            else
            {
                    //Concatenate user input password with database output salt
                    const passwordHash = user_password+data[0].salt;
                    //declare sha2 var
                    const sha2 = crypto.createHash('sha256');
                    // Update the hash with the data
                    sha2.update(passwordHash);
                    // Calculate the hexadecimal hash
                    const hashedSaltAndPass = sha2.digest('hex');
                    if(data[0].uPassword != hashedSaltAndPass)
                    {
                        return CatchThatError("Wrong Password",401,next);
                    }
                    else
                    {
                        request.session.superID = data[0].superID;
                        response.redirect("/admin/dashboard-m");
                    }
            }
            response.end();
        });
    }

});



router.get("/",(req,res)=>{
    res.render('./admin-moderator/index',{
        usertype: "Administrator", //DON'T REMOVE
        base: "admin"
    });
   
});

router.get("/dashboard", (req,res)=>{
    res.render('./admin-moderator/dashboard',{
        usertype: "Administrator", //DON'T REMOVE
        path: "admin",
        Menu : Menu
    });
});

router.get("/attendlist", (req,res)=>{
    res.render('./admin-moderator/attendlist',{
        usertype: "Administrator", //DON'T REMOVE
        path: "admin",
        Menu : Menu
    });
});


router.get("/dashboard-m", (req,res)=>{
    res.render('./admin-moderator/dashboard',{
        usertype: "Moderator", //DON'T REMOVE
        path: "admin",
        Menu : Menu
    });
});

router.get("/moderatorlist", (req,res)=>{
    res.render('./admin-moderator/moderatorlist',{
        path: "admin",
        Menu : Menu
    });
});

router.get("/eventmanagement", (req,res)=>{
    res.render('./admin-moderator/eventmanagement',{
        path: "admin",
        Menu : Menu
    });
    
});

router.get("/eventlist", (req,res)=>{
    res.render('./admin-moderator/eventlist',{
        path: "admin",
        Menu : Menu
    });
    
});

router.get("/addmoderator", (req,res)=>{
    res.render('./admin-moderator/addmoderator',{
        path: "admin",
        Menu : Menu
    });
    
});

function CatchThatError(errorMessage, errorStatus,next){
    const customError = new Error(errorMessage);
    customError.status = errorStatus; // HTTP Unauthorized
    next(customError);
    
}

router.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });// to be thrown client side
  });

export default router;