import express from "express";
import dashboard from "./dashboard.mjs";
import crypto from "node:crypto";
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
        usertype: "Moderator", //DON'T REMOVE
        path : "moderator",
        Menu : Menu
    });
});

router.get("/eventlist", (req,res)=>{
    
    database.query("SELECT * FROM `event_info` ", function (err, rows) {
        if (err) {
          req.flash('error', err)
          res.render('profile', { data: '' })
        } else {
          
        
    res.render('./admin-moderator/eventlist',{
        path: "moderator",
        data: rows,
        usertype : "Administrator"
    });
}
});
    
});

router.get("/eventmanagement", (req,res)=>{
    res.render('./admin-moderator/eventmanagement',{
        usertype: "Moderator", //DON'T REMOVE
        path: "moderator",
        Menu : Menu
    });
    
});

router.get("/moderatorlist", (req,res)=>{
    res.render('./admin-moderator/eventlist',{
        usertype: "Moderator", //DON'T REMOVE
        path: "moderator",
        Menu : Menu
    });
    
});

router.get("/addevent", (req,res)=>{
    res.render('./admin-moderator/addevent',{
        usertype: "Moderator", //DON'T REMOVE
        path: "moderator",
        Menu : Menu
    });
    
});

router.get("/addmoderator", (req,res)=>{
    res.render('./admin-moderator/addmoderator',{
        usertype: "Moderator", //DON'T REMOVE
        path: "moderator",
        Menu : Menu
    });
    
});

router.post("/add-event", function(req, res, next){
    // User inputs
    const eName = req.body.eventName;
    const eDesc = req.body.eventDesc;
    const eDate = req.body.eventDate;
    const cookieValue= req.cookies['org_id'];
    const modID = cookieValue;
    console.log(eName,eDesc,eDate,modID);
    const query = 'CALL EventManager(?,?,?,?)';
    const values = [eName, eDesc,eDate,modID]

    database.query(query,values,function(err,data){
        if(data===0){
            CatchThatError("Hindi naipasok ang imong data, pasinsya",400,next)
        }else{
            console.log('Mabuhay! naipasok na ang imong data');
            res.render('./admin-moderator/addevent',{
                usertype: "Moderator",
                path: "moderator",
                Menu: Menu
            });
        }
    })
})

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
        SELECT * FROM organdsuperuser 
        WHERE userName = ? 
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
                    if(data[0]. password != hashedSaltAndPass)
                    {
                        return CatchThatError("Wrong Password",401,next);
                    }
                    else
                    {
                        response.cookie("a_std_name", user_email_address, { maxAge: minute }, { httpOnly: true });
                        response.cookie("m_std_id", data[0].superID, { maxAge: minute }, { httpOnly: true });
                        response.cookie("org_id", data[0].org_ID, { maxAge: minute }, { httpOnly: true });
                        response.cookie("utype", "moderator", { maxAge: minute }, { httpOnly: true });
                        request.session.superID = data[0].superID;
                        response.redirect("/moderator/dashboard");
                    }
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