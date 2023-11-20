import express from "express";
const router = express.Router();
import database from "../db/connection.mjs";
import sha256 from "../utils/sha256.mjs";
import { error } from "node:console";


const Departments = async () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM Department";

        database.query(query, (error, data) => {
            if (error) {
                reject(error);
                return;
            }

            if (data.length === 0) {
                reject("Departments not found");
                return;
            }

            resolve(data);
        });
    });
};

var Organizations= async ()=>{
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM Moderators";

        database.query(query, (error, data) => {
            if (error) {
                reject(error);
                return;
            }
            if (data.length === 0) {
                reject("Organization not found");
                return;
            }
            resolve(data);
        });
    });
}

router.get("/",(req,res)=>{
    res.render('./admin-moderator/index',{
        usertype: "Administrator" //DON'T REMOVE

    });
    
});


router.post('/login', function(request, response, next){

    var user_email_address = request.body.username;
    var user_password = request.body.password;
    //console.log(user_email_address,user_password);
    if(!user_email_address && !user_password)
    {
        CatchThatError("Please Enter Email Address and Password Details",400,next)
    }
    else
    {
       
        var query = `
        SELECT superID,password,salt FROM superusers 
        WHERE userName = ? AND superID = 0
        `;

        database.query(query, [user_email_address],function(error, data){

            if(data.length ===0)
            {
                return CatchThatError("Invalid Password or username",400,next);
            }
            else
            {
    let minute = 600 * 10000;
    //Concatenate user input password with database output salt
                    const passwordHash = user_password+data[0].salt;
                    const hashedSaltAndPass = sha256(passwordHash);
                    if(data[0].Password != hashedSaltAndPass)
                    {
                        return CatchThatError("Wrong Password",401,next);
                    }
                    else
                    {
                        request.session.superID = data[0].superID;
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



router.get("/dashboard", (req,res)=>{
    res.render('./admin-moderator/dashboard',{
        path: "admin",
        usertype : "Administrator"
    });
});

router.get("/moderatorlist", (req,res)=>{
    res.render('./admin-moderator/moderatorlist',{
        path: "admin",
        usertype : "Administrator"
    });
});

router.get("/eventmanagement", (req,res)=>{
    res.render('./admin-moderator/eventmanagement',{
        path: "admin",
        usertype : "Administrator"
    });
    
});

router.get("/eventlist", (req,res)=>{
    res.render('./admin-moderator/eventlist',{
        path: "admin",
        usertype : "Administrator"
    });
    
});

router.post("/addmoderator", async (req, res, next) => {
    // User inputs
    const username = req.body.username;
    const name = req.body.name;
    const password = req.body.password;
    const department = req.body.department;
  
    // Validation of user input
    if (!username) return CatchThatError("Username must not be empty!", 404, next);
    if (!password) return CatchThatError("Password must not be empty!", 404, next);
    if (!name) return CatchThatError("Organization Name must not be empty!", 404, next);
  
    // Declaring object for organizations
    const organizations = await Organizations();
  
    // Use the some method to check if any department has the same username across all organizations
    const usernameExists = organizations.some(organization => organization.username === username);
    if (usernameExists) return CatchThatError("Username already exists", 400, next);
  
    // Insert superusers first before organization
    //@param(orgname, password, username, deptid)
    const query = "CALL RegisterModerator(?,?,?,?)";
    
    // Begin the transaction
    database.beginTransaction((err) => {
      if (err) {
        return CatchThatError("Internal Server Error", 500, next);
      }
      
      // Initiating query   
      database.query(query, [name, password, username, department], (error, data) => {
        if (error) {
          // If database throws an error, rollback the transaction
          database.rollback(() => {
            return CatchThatError(error, 500, next);
          });
        } else {
          // Commit the changes if there is no error
          database.commit((commitError) => {
            if (commitError) {
              // If committing the transaction throws an error, rollback
              database.rollback(() => {
                CatchThatError(commitError, 500, next);
              });
            } else {
              // Send response if everything is successful
              res.send('Transaction successfully completed!');
            }
          });
        }
      });
    });
  });

router.get("/addmoderator", async (req, res) => {
    
    try {
        const deptList = await Departments();
        //console.log(deptList);
        
        res.render('./admin-moderator/addmoderator', {
            path: "admin",
            usertype: "Administrator",
            departments: deptList
            
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
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
