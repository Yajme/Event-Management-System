import express from "express";
import crypto from "node:crypto";
const router = express.Router();
import database from "../db/connection.mjs";
import sha256 from "sha256";
import Swal from "sweetalert2";




router.get("/",(req,res)=>{
    res.render('./admin-moderator/index',{
        
        usertype: "Administrator" //DON'T REMOVE
    });
    
});

router.get("/dashboard", (req,res)=>{
    const Menu = [
        {
            "Menu" : [
                {
                    Title : "Main Menu",
                    Class : "nav-label first",
                    Dropdown : "Home",
                    Icon : "icon icon-single-04",
                    Subitem : [
                        { Name : "Dashboard", Route : "dashboard"}
                    ]
                },
                {
                    Title : "Account Management",
                    Class : "nav-label",
                    Dropdown : "Moderators",
                    Icon : "icon icon-app-store",
                    Subitem : [
                        { Name : "Account List", Route : "account"},
                        { Name : "Register Moderator", Route : "register"}
                    ]
                },
                {
                    Title : "Events Management",
                    Class : "nav-label",
                    Dropdown : "Events",
                    Icon : "icon icon-form",
                    Subitem : [
                        { Name : "Event List", Route : "events"},
                        { Name : "Add Events", Route : "registerevents"}
                    ]
                },
            ]
        }
    ]

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
        SELECT superID,uPassword,salt FROM superusers 
        WHERE userName = ? AND superID = 0
        `;

        database.query(query, [user_email_address],function(error, data){

            if(data.length == 0)
            {
                return CatchThatError("Invalid Password or username");
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
                        response.redirect("dashboard");
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
        path: "admin",
        Menu : Menu
    });
});

router.get("/account", (req,res)=>{
    res.render('./admin-moderator/view-moderator',{
        path: "admin",
        Menu : Menu
    });
});

router.get("/register", (req,res)=>{
    res.render('./admin-moderator/register-moderator',{
        path: "admin",
        Menu : Menu
    });
    
});

router.get("/events", (req,res)=>{
    res.render('./admin-moderator/view-events',{
        path: "admin",
        Menu : Menu
    });
    
});

router.get("/registerevents", (req,res)=>{
    res.render('./admin-moderator/create-events',{
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