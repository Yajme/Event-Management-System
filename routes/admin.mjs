import express from "express";
const router = express.Router();
import database from "../db/connection.mjs";



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



    res.render('./admin-moderator/dashboard',{
        path: "admin",
        Menu : Menu
    });


    
    
});



router.post('/login', function(request, response, next){

    var user_email_address = request.body.user_email_address;

    var user_password = request.body.user_password;
    console.log(user_email_address + " = " + user_password);

    if(user_email_address && user_password)
    {
        var query = `
        SELECT * FROM superusers 
        WHERE userName = "${user_email_address}"
        `;
        console.log(query);

        database.query(query, function(error, data){

            if(data.length > 0)
            {
                for(var count = 0; count < data.length; count++)
                {
                    if(data[count].password == user_password)
                    {
                        request.session.superID = data[count].superID;

                        response.redirect("/admin/dashboard");
                    }
                    else
                    {
                        response.send('Incorrect Password');
                    }
                }
            }
            else
            {
                response.send('Incorrect Email Address');
            }
            response.end();
        });
    }
    else
    {
        response.send('Please Enter Email Address and Password Details');
        response.end();
    }

});




export default router;