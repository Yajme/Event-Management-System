import express from "express";
import admin from "../controller/adminController.mjs";
const router = express.Router();

router.get("/",admin.loginPage);
router.post('/login', admin.login);

router.get("/logout" ,admin.logout);
router.get("/dashboard", admin.home);

router.get("/moderatorlist", admin.moderatorList);
router.get("/eventmanagement", admin.eventManagement);

router.get("/eventlist", admin.eventList);
router.post("/addmoderator", admin.addModerator);
router.get("/addmoderator", admin.addModeratorPage);

router.get("/attendlist", admin.AttendList);
router.post("/attendlist",admin.AttendListSearch);
router.get("/attendlist/:eventname", admin.AttendListLoad);

router.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });// to be thrown client side
  });

export default router;