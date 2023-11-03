import express from "express";
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



    res.render('./admin-moderator/dashboard',{
        path: "admin",
        Menu : Menu
    });


    
    
});



router.post('/login', function(request, response, next){

    var user_email_address = request.body.user_email_address;

    var user_password = request.body.user_password;
    console.log(user_email_address + " = " + user_password);

    if(!user_email_address && !user_password)
    {
        response.send('Please Enter Email Address and Password Details');
        response.end();
    }
    else
    {
       
        var query = `
        SELECT superID,uPassword FROM superusers 
        WHERE userName = ?
        `;
        console.log(query);

        database.query(query, [user_email_address],function(error, data){

            if(data.length == 0)
            {
                response.send('Incorrect Email Address');
            }
            else
            {
               
                for(var count = 0; count < data.length; count++)
                {
                    let valPassword = sha256(user_password)
                    if(data[count].uPassword != valPassword)
                    {
                        
                        response.send("<script>alert('Wrong Password!'); window.location.replace('/admin');</script> ");

                    }
                    else
                    {
                        
                        request.session.superID = data[count].superID;

                        response.redirect("dashboard");
                    }
                }

            }
            response.end();
        });
    }

});




export default router;