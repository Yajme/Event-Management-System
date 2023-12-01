import express from "express";
import moderator from '../controller/ModeratorController.mjs';

const router = express.Router();

router.get("/", moderator.loginPage);
router.get("/dashboard", moderator.homePage);
router.get("/eventregistration", moderator.eventregistration);
router.get("/eventlist", moderator.eventlist);
router.get("/eventmanagement", moderator.eventlist);
router.get("/attendlist",moderator.attendlist);
router.get("/logout" ,moderator.logout);
router.get("/attendlist/:eventname", moderator.AttendListLoad)
router.post('/login', moderator.login);
router.post("/add-event", moderator.addevent);
router.post('/changepassword',moderator.changepassword);
router.post('/attendlist',moderator.AttendListSearch);
router.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });// to be thrown client side
  });
export default router;