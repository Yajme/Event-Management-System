import express from "express";
import dashboard from "./dashboard.mjs";
import crypto from "node:crypto";
import database from "../db/connection.mjs";
import ModeratorModel from "../model/UserModel/ModeratorModel.mjs";
import Error from '../utils/error.mjs';

const router = express.Router();

router.get("/",(req,res)=>{
    res.render('./admin-moderator/index',{
        usertype: "Moderator", //DON'T REMOVE
        base: "moderator",
        login:"/moderator/login"
    });
   
});

router.get("/dashboard", (req,res)=>{
    
    res.render('./admin-moderator/dashboard',{
        usertype: "Moderator", //DON'T REMOVE
        path : "moderator",
        Menu : ModeratorModel
    });
});

router.get("/eventregistration", (req,res)=>{
    
    res.render('./admin-moderator/eventregistration',{
        usertype: "Moderator", //DON'T REMOVE
        path : "moderator",
        Menu : ModeratorModel
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
        usertype : "Moderator",
        Menu : ModeratorModel
    });
}
});
    
});

router.get("/eventmanagement", (req,res)=>{
    res.render('./admin-moderator/eventmanagement',{
        usertype: "Moderator", //DON'T REMOVE
        path: "moderator",
        Menu : ModeratorModel
    });
    
});

router.get("/moderatorlist", (req,res)=>{
    res.render('./admin-moderator/eventlist',{
        usertype: "Moderator", //DON'T REMOVE
        path: "moderator",
        Menu : ModeratorModel
    });
    
});
router.get("/addmoderator", (req,res)=>{
    res.render('./admin-moderator/addmoderator',{
        usertype: "Moderator", //DON'T REMOVE
        path: "moderator",
        Menu : ModeratorModel   
    });
    
});

router.get("/attendlist",(req,res)=>{
    res.render('./admin-moderator/attendlist',{
        usertype: "Moderator", //DON'T REMOVE
        path: "moderator",
        Menu : ModeratorModel
    });
});
router.get("/logout" ,(req,res)=>{
    res.cookie("m_std_id", "username", { maxAge: -1 }, { httpOnly: true });
    res.cookie("m_std_name", "username", { maxAge: -1 }, { httpOnly: true });
    res.redirect('/moderator')
});

router.post('/login', function(request, response, next){
    var user_email_address = request.body.user_email_address;
    var user_password = request.body.user_password;
    if(!user_email_address && !user_password)
    {
        Error("Please Enter Email Address and Password Details",400,next)
    }
    else
    {
       
        var query = `
        SELECT * FROM moderatorcoookies
        WHERE userName = ? 
        `;

        database.query(query, [user_email_address],function(error, data){

            if(data.length == 0)
            {
                return Error("Invalid Password or username",401,next);
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
                        return Error("Wrong Password",401,next);
                    }
                    else
                    {
                        response.cookie("m_std_name", user_email_address, { maxAge: minute }, { httpOnly: true });
                        response.cookie("m_std_id", data[0].superID, { maxAge: minute }, { httpOnly: true });
                        response.cookie("utype", "moderator", { maxAge: minute }, { httpOnly: true });
                        request.session.superID = data[0].superID;
                        response.redirect("/moderator/dashboard");
                    }
            }
            response.end();
        });
    }

});
router.post("/add-event", function(req, res, next){
    // User inputs
    const eName = req.body.eventName;
    const eDesc = req.body.eventDesc;
    const eDate = req.body.eventDate;
    const cookieValue= req.cookies['m_std_id'];
    const modID = cookieValue;
    console.log(eName,eDesc,eDate,modID);
    const query = 'CALL EventManager(?,?,?,?)';
    const values = [eName, eDesc,eDate,cookieValue]

    database.query(query,values,function(err,data){
        if(data===0){
            console.log('hindi pumasok ang data');
        }else{
            console.log('mabuhay! naipasok na ang imong data');
            res.render('./admin-moderator/eventregistration',{
                usertype: "Moderator",
                path: "moderator",
                Menu: ModeratorModel
            });
        }
    })
})



router.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });// to be thrown client side
  });
export default router;