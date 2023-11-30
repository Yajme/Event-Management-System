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





router.post('/login', student.login);


 router.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });// to be thrown client side
  });

export default router;