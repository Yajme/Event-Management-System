import express from "express";
const router = express.Router();
import db from "../db/connection.mjs";
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

router.post("/login",(req,res,next)=>{



})

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