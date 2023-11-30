import express from "express";
import student from '../controller/StudentController.mjs';
import db from "../db/connection.mjs";
const router = express.Router();


router.get("/" ,student.loginPage);

router.get("/dashboard" ,student.home);

router.get("/logout" ,student.logout);

router.get("/eventcalendar", student.eventcalendar);

router.get("/eventlist", student.eventlist);

router.post("/register", student.register);

router.post("/changepassword", student.changepassword);



router.get("/changepass" ,(req,res)=>{
    let val_dept_ID = req.cookies['u_dept_id'];
    
    let query = "SELECT * FROM `stud_atendees_view` right join event_info on stud_atendees_view.eventID=event_info.eventID where event_info.dept_ID = ? and  event_info.statusID = 2 group by event_info.eventID ;";
    db.query(query, [val_dept_ID], function (err, rows) {
        if (err) {
          req.flash('error', err)
          res.render('404', { data: '' })
        } else {
          
    req.flash('message', 'You Registered to the Event!');      
    res.render('./students/eventlist',{
        path: "student",
        messagepass: req.flash('message'),
        stud_id: req.cookies['std_id'],
        data: rows,
        Menu : Menu
    });
}
});
});

router.post('/login', student.login);


 router.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });// to be thrown client side
  });

export default router;