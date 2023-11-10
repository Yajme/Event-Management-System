import express from "express";
import dashboard from "./dashboard.mjs";
import crypto from "node:crypto";
import sha256 from "../utils/sha256.mjs";
import database from "../db/connection.mjs";
const router = express.Router();

const Menu = [
    {
        "Menu" : [
            {
                Title : "Main Menu",
                Class : "nav-label first",
                Dropdown : "Home",
                Icon : "icon icon-single-04",
                Route : "dashboard"
            },
            {
                Title : "Events List",
                Class : "nav-label",
                Dropdown : "Events",
                Icon : "icon icon-form",
                Route : "eventlist",
            },
            {
                Title : "Events Calendar",
                Class : "nav-label",
                Dropdown : "Events",
                Icon : "icon icon-form",
                Route : "eventcalendar",
            },
            {
                Title : "Moderator List",
                Class : "nav-label",
                Dropdown : "Events",
                Icon : "icon icon-form",
                Route : "moderatorlist",
            },
            {
                Title : "Moderator Mangament",
                Class : "nav-label",
                Dropdown : "Events",
                Icon : "icon icon-form",
                Route : "addmoderator",
            },
        ]
    }
]
router.get("/",(req,res)=>{
    res.render('./admin-moderator/index',{
        usertype: "Moderator", //DON'T REMOVE
        base: "moderator"
    });
   
});

router.get("/dashboard", (req,res)=>{
    
    res.render('./admin-moderator/dashboard',{
        path : "moderator",
        Menu : Menu
    });
});

router.get("/eventlist", (req,res)=>{
    res.render('./admin-moderator/eventlist',{
        path: "moderator",
        Menu : Menu
    });
    
});

router.get("/eventmanagement", (req,res)=>{
    res.render('./admin-moderator/eventmanagement',{
        path: "moderator",
        Menu : Menu
    });
    
});

router.get("/moderatorlist", (req,res)=>{
    res.render('./admin-moderator/eventlist',{
        path: "moderator",
        Menu : Menu
    });
    
});
router.get("/addmoderator", (req,res)=>{
    res.render('./admin-moderator/addmoderator',{
        path: "moderator",
        Menu : Menu
    });
    
});
router.post('/login', function(request, response, next){

    var user_email_address = request.body.username;
    var user_password = request.body.password;
    if(!user_email_address && !user_password)
    {
        CatchThatError("Please Enter Email Address and Password Details",400,next)
    }
    else
    {
       
        var query = `
        SELECT superID,Password,salt FROM superusers 
        WHERE userName = ? AND superID != 0
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
                    const hashedSaltAndPass = sha256(passwordHash);
                    if(data[0].Password != hashedSaltAndPass)
                    {
                        return CatchThatError("Wrong Password",401,next); //HTTP 400 Unauthorized
                    }
                    
                    response.send(Menu);
            }
            response.end();
        });
    }

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