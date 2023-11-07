import express from "express";
import dashboard from "./dashboard.mjs";
import db from "../db/connection.mjs";
const router = express.Router();

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

router.get("/events", (req,res)=>{
    res.render('./admin-moderator/view-events',{
        path: "moderator",
        Menu : Menu
    });
    
});

router.get("/registerevents", (req,res)=>{
    res.render('./admin-moderator/create-events',{
        path: "moderator",
        Menu : Menu
    });
    
});

router.post("/login",(req,res,next)=>{

    const username = req.body.username;
    const password = req.body.password;

    const query = "SELECT username,password FROM superusers WHERE superid != 0";
    db.query(query,(error,result)=>{
        

        if(result.length > 0){
            const resUsername = result[0].username;
            const resPassword = result[0].password;

            if(resUsername != username){
                return CatchThatError('Wrong username',401,next)
            }

            if(resPassword != password){
                return CatchThatError('Wrong password',401,next)
            }

            res.status(200).send('OK');
        }else{
            return CatchThatError('Invalid Password or Username',401,next)
        }

    })

})

function CatchThatError(errorMessage, errorStatus,next){
    const customError = new Error(errorMessage);
    customError.status = errorStatus; // HTTP Unauthorized
    next(customError);
    
}

router.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });// to be thrown client side
  });
export default router;