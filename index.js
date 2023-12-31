import express from "express";
import cors from "cors";
import { fileURLToPath } from 'url';
import path from 'path';
import db from "./db/connection.mjs";
import studentRouter from "./routes/student.mjs";
import adminRouter from "./routes/admin.mjs";
import modRouter from "./routes/moderator.mjs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import session  from "express-session";
import  SHA256  from 'sha256';
import expressflash from 'express-flash';

import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
app.use(expressflash());
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());
//For Client side page rendering do not replicate
app.set(express.static(path.join(__dirname,'views')));
app.use(express.static(path.join(__dirname,'public')));
// Client side

app.use(
    session({
        secret: '123@abcd',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000 },
    }),
  )

app.set("view engine","ejs")

//Routers
app.use("/admin/",adminRouter);
app.use("/moderator/",modRouter);
app.use("/student/",studentRouter);
//Routers

app.get('*', (req, res, next) => {
    const requestedURL = req.url;
    const error = new Error('Wrong URL ' + requestedURL + " is not existent");
    error.status = 404; // You can set the status to 404 or any other appropriate status code.
    
    next(error); // Pass the error to the error-handling middleware.
});
app.use((err, req, res, next) => {  
    res.status(err.status || 500);
    res.render('404',{
        Error : err
    });
});






const port = 8080;
app.listen(port, ()=> console.log(`Server is up on ${port}`))
